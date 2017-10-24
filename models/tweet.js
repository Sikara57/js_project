mongoose = require('mongoose');

var twitterSchema = mongoose.Schema({
	'tweet_creation':Date,
	'tweet_text':String,
	'user_name':String,
	'user_location':String
});

var Twitter = mongoose.model('Twitters',twitterSchema);
module.exports = Twitter;