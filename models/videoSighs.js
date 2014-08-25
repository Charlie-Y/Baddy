var mongoose = require('mongoose');

var VideoSigh = new mongoose.Schema({
	sighBase: String,
	sigh: String,
	ytid: String,
	lengthInSeconds: Number
});

VideoSigh.index( { keyword: 1 } );

module.exports.VideoSigh = VideoSigh;

exports.VideoSigh = mongoose.model('VideoSigh', VideoSigh);