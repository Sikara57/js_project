var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user.js');;

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var promise=mongoose.connect('mongodb://localhost:27017/js',{
    useMongoClient:true,
});

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


app.get('/users',function(req,res){
	User.find({},function(err,collection){
		if(err){
			console.log(err);
			return res.send(500);
		}else{
			return res.send(collection);
		}
	});
});

app.get('/users/:id',function(req,res){
	console.log(req.params);
	User.findOne({"_id":req.params.id},function(err,objet){
		if(err){
			console.log(err);
			return res.send(500);
		}else{
			return res.send(objet);
		}
	});
});

app.post('/users',function(req,res){
	console.log(req.body.user);
	var userToSave = new User(req.body.user);
	userToSave.save(function(err,success){
		if(err){
			console.log(err);
			return res.send(500);
		}else{
			console.log(success);
			res.send(success);
		}
	});
});

app.delete('/api/liste/:id', function(req, res) {
    console.log(req.body);
    User.findByIdAndRemove(req.params.id,function(err, response){
        if(err){
            console.log(err);
        }
        else{
            console.log(response);
            console.log("deleted");
            io.sockets.emit('userDelete', response);
            res.send(200);

        }
    });
});

// exemple de rendu html / jade
app.put('/api/liste/:id', function(req, res) {
    console.log(req.params);
    console.log(req.body);
    // console.log(req.params.id);

    User.findByIdAndUpdate(req.params.id,req.body, { new: true }, function (err, updateUser) {
      if (err) return handleError(err);
      console.log(updateUser);
      res.status(200).send(updateUser);
    });

});