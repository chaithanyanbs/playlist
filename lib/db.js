var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'test1user',
	password:'Ttech@123456',
	database:'test1'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;