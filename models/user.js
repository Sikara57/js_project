var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	"nom": String,
	"prenom":String,
	"mail":String
});

var User = mongoose.model('Users',userSchema);

module.exports = User;