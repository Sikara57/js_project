var Particle = require('particle-api-js');
var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var User = require('./models/user.js');;
var Devices = require('./models/device.js');
var EventsObj = require('./models/eventObj.js');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var promise=mongoose.connect('mongodb://localhost:27017/js',{
    useMongoClient:true,
});

var particle = new Particle();
var token;

var myDevice = '190036001047343438323536';

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
			io.emit('userCreate',success);
		}
	});
});

app.delete('/users/:id', function(req, res) {
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
app.put('/users/:id', function(req, res) {
    console.log(req.params);
    console.log(req.body);
    // console.log(req.params.id);

    User.findByIdAndUpdate(req.params.id,req.body, { new: true }, function (err, updateUser) {
      if (err) return handleError(err);
      console.log(updateUser);
      io.sockets.emit('userUpdate',updateUser);
      res.status(200);
    });

});


/* --------------------------------------------------------------------------------------- */
/* -------------------------------------- OBJET ------------------------------------------ */
/* --------------------------------------------------------------------------------------- */


particle.login({username:'sikara57@gmail.com',password:'zfgp64s3*'}).then(
    function(data){
        token = data.body.access_token;
        console.log('Access Granted !');
        var devicesPr = particle.listDevices({ auth: token });
        devicesPr.then(
            function(devices){
              //console.log('Devices: ', devices);
              devices.body.forEach(function(device){
                // console.log(device.id);
                Devices.findOne({"id":device.id}, function(err,objet){
                    if(objet)
                    {
                        // si je trouve objet je update
                        console.log('device Update in progress');
                        var dateActu = new Date();
                        var toUpdate = new Devices(objet);
                        toUpdate.last_heard = dateActu.toISOString();
                        Devices.findByIdAndUpdate(objet._id,toUpdate,{new:true}, function(err,objet){
                            if(err){
                                console.log('Update Error ' + err);
                            }else{
                                console.log('Device updated ');
                            }
                        });

                    }
                    else if(err)
                    {
                        console.log('Error '+ err);
                    }
                    else
                    { 
                        // Si je trouve pas un objet avec le même id objet je l'ajoute
                        console.log('device Add in progress');
                        var toSave = new Devices(device);
                        toSave.save(function(err,success){
                            if(err){
                                console.log('Add Error '+ err);
                            }else{
                                console.log('Device added');
                            }
                        });
                    }
                })
                
              });
            },
            function(err) {
              console.log('List devices call failed: ', err);
            }
        );
        particle.getEventStream({ deviceId: myDevice,name: 'beamStatus', auth: token }).then(function(stream) {
            stream.on('event', function(data) {
                var toSave = new EventsObj(data);
                toSave.save(function(err,success){
                    if(err){
                        console.log('Add event Error ' + err);
                    }else{
                        console.log('Event added');
                        io.emit('newEvent',success);
                    }
                });
              // console.log("Event: " + JSON.stringify(data));
            });
        });
        particle.getEventStream({ deviceId: myDevice,name: 'Intensity', auth: token }).then(function(stream) {
            stream.on('event', function(data) {
                var toSave = new EventsObj(data);
                toSave.save(function(err,success){
                    if(err){
                        console.log('Add event Error ' + err);
                    }else{
                        console.log('Intensity Chart Value added');
                        io.emit('Intensity',success);
                    }
                });
              // console.log("Event: " + JSON.stringify(data));
            });
        });

    },
    function(err){
        console.log('Could not login '+ err);
    }
);


app.get('/boitier',function(req,res){
    Devices.find({},null,function(err,collection){
        if(err){
            console.log(err);
            return res.send(500);
        }else{
            console.log(collection);
            res.send(JSON.stringify(collection));
        }
    });
});

app.get('/boitier/:id', function(req,res){
    Devices.findOne({'_id':req.params.id},function(err,objet){
        if(err){
            console.log('Find Error' + err);
        }else {
            return res.send(objet);
        }
    });
});

app.post('/event', function(req,res){
    console.log("une requete est arrivée");

    var objet = req.body;
    console.log(objet)
    var fnPr = particle.callFunction({ deviceId: myDevice, name: 'light', argument: 'hi', auth: token });
 
    fnPr.then(
        function(data) {
            console.log('Function called succesfully');
            objet.data = data.body.return_value;
            var toSave = new EventsObj(objet);
            toSave.save(function(err,success){
                if(err){
                    console.log('Add Event Error ' + err);
                }else{
                    console.log('Added Event Light');
                    res.send(success);
                }
            })

        }, function(err) {
            var erro = 'error';
            console.log('An error occurred');
            res.send(erro);
    });
});

app.get('/event',function(req,res){
    EventsObj.find({},null,function(err,collection){
        if(err){
            console.log(err);
            return res.send(500);
        }else{
            // console.log(collection);
            res.send(collection);
        }
    });
});



app.post('/boitier', function(req,res){
    var myPhoto = particle.getVariable({ deviceId: myDevice, name: 'analogvalue', auth: token });
    
    myPhoto.then(
        function(data) {
            console.log('Device variable retrieved successfully:', data);
        }, 
        function(err) {
            console.log('An error occurred while getting attrs:', err);
    });
});