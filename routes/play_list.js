

module.exports = function(io) {

var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');



router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM playlist ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            res.render('playlist',{data:''});   
        } else {
            res.render('playlist',{data:rows});
        }
    });
});

router.get('/add', function(req, res, next) {    
    // render to add.ejs
    //io.emit('stats', { numClients: 'mm' });

    res.render('playlist/add', {
        name: '',
        singer: ''        
    })


})

// add a new book
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let singer = req.body.singer;
    let errors = false;

    if(name.length === 0 || singer.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and the singer");
        // render to add.ejs with flash message
        res.render('playlist/add', {
            name: name,
            singer: singer
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            singer: singer
        }
        
        // insert query
        dbConn.query('INSERT INTO playlist SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('playlist/add', {
                    name: form_data.name,
                    singer: form_data.singer                    
                })
            } else {  
                console.log('ioooooooo',io); 
               // payload={ name: form_data.name,}
                io.sockets.emit('payload',form_data);      
                req.flash('success', 'Playlist successfully added');
                res.redirect('/playlist');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM playlist WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Playlist not found with id = ' + id)
            res.redirect('/playlist')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('playlist/edit', {
                title: 'Edit Book', 
                id: rows[0].id,
                name: rows[0].name,
                singer: rows[0].singer
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let singer = req.body.singer;
    let errors = false;

    if(name.length === 0 || singer.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and the singer");
        // render to add.ejs with flash message
        res.render('playlist/edit', {
            id: req.params.id,
            name: name,
            singer: singer
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            singer: singer
        }
        // update query
        dbConn.query('UPDATE playlist SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('playlist/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    singer: form_data.singer
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/playlist');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM playlist WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            res.redirect('/playlist')
        } else {
            // set flash message
            req.flash('success', 'Playlist successfully deleted! ID = ' + id)
            res.redirect('/playlist')
        }
    })
})

//module.exports = router;
return router;
};