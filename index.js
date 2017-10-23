var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var uri = 'mongodb://localhost:27017/projet';
var options = {useMongoClient:true};

var promise = mongoose.createConnection(uri,options);

promise.then(function(db){
	console.log('BdD Connecté');
	server.listen(3000,function(){
		console.log('Listening on 3000');
	});
});

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use('/client', express.static('./client'));
app.use('/bower_components',express.static('./bower_components'));
app.use('/node_modules',express.static('./node_modules'));

app.get('/',function(req,res){
	res.sendFile(__dirname + '/client/index.html');
});