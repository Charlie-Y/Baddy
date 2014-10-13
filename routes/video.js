
// Video contains information about all breakpoint videos made
// Take a look at videoseed.json or models/video.js for schema/sample data
// Setlist = mongoose.model('Setlist');

var mongoose = require('mongoose');
var VideoSigh = mongoose.model('VideoSigh');
var request = require("request");


exports.watchVideo = function(req, res){

};

exports.updateBreakpoints = function( req, res){
    // Ajax route to update the video
    var videoId = req.params.id;
    var breakpoints = req.body.breakpoints;
    // console.log("Breakpoints: " + JSON.stringify(breakpoints));
    console.log("updateBreakpoints at video: " + videoId);
}


getImgSrcs = function(base, sigh, lengthInSeconds){
    var srcs = [];
    var n = (lengthInSeconds < 60 * 20) ? 5 : lengthInSeconds / (60 * 4);
    for (i = 0; i < n + 1; i++) {
        var newSrc = base + i + ".jpg?sigh=" + sigh;
        newSrc = newSrc.replace(/\\/g, '');
        srcs.push(newSrc);
       // console.log(newSrc);
    }
    return srcs;
}

exports.videoSigh = function( req, res){

    var ytid = req.params.ytid;
    var imgs = req.params.imgs;
    // ytid = '5VJhar3X_JA'
    // var ytid = 'IxxstCcJlsc'

    console.log(ytid);

    // First check if the video already exists
    VideoSigh.find({ytid: ytid}).exec( function (err, sighs) {
        // if (0){
        if (sighs.length != 0){
            console.log("Existing Sigh found");
            // console.log(req.params);

            var existingSigh = sighs[0];
            var resultData = {
                base: existingSigh.sighBase,
                sigh: existingSigh.sigh,
                lengthInSeconds: existingSigh.lengthInSeconds,
                _id: existingSigh._id,
                statusCode: 200
             };
             if (imgs){
                res.render('error', {data: getImgSrcs(resultData.base, resultData.sigh, resultData.lengthInSeconds)})
             } else {
                res.json(resultData);
             }
        } else {
            console.log("no existing sighs found");
            request('https://www.youtube.com/watch?v=' + ytid, function (error, response, data) {
                // console.log({error: error, response: response})
              if (!error && response.statusCode == 200) {
                // console.log(data) // Print the google web page.
                var patt=new RegExp("\"storyboard_spec\": \"(.*?)\"","g");
                var result=patt.exec(data);
                patt=new RegExp("(http.*?)\\|.*?#M\\$M#(.*)","g");//"(http.*?)\\|.*?#M\\$M#(.*?)\\|","g"); 
                
                // res.render('error', {stuff: data, data:[]});
                // return;

                result=patt.exec(result[1]);
                
                var a = result[0]
                console.log(a);

                // Parse the Storyboard URL to get the base and unique ID of thumbnail images
                var b = a.split("|");
                var base = b[0].split("$")[0] + "2/M";
                var c = b[3].split("#");
                var sigh = c[c.length - 1];


                base = base.replace(/\\/g, ''),

                 // Good at this point
                // console.log(base) 
                // console.log(sigh)

                patt = new RegExp("\"length_seconds\": (.*?),","g");
                result = patt.exec(data);

                var lengthInSeconds = result[1]
                
                // console.log("length_seconds")
                // console.log(result[1])

         
                // Queue all the thumbnail images
                if (imgs){
                    var srcs = [];
                    var n = (lengthInSeconds < 60 * 20) ? 5 : lengthInSeconds / (60 * 4);
                    for (i = 0; i < n + 1; i++) {
                        var newSrc = base + i + ".jpg?sigh=" + sigh;
                        newSrc = newSrc.replace(/\\/g, '');
                        srcs.push(newSrc);
                       // console.log(newSrc);
                    }
                }

                var resultData = {
                    base: base,
                    sigh: sigh,
                    lengthInSeconds: lengthInSeconds,
                    statusCode: response.statusCode

                 };

                 var newVideoSigh = new VideoSigh({
                    sighBase: base,
                    sigh: sigh,
                    ytid: ytid,
                    lengthInSeconds: parseInt(lengthInSeconds.replace('"', ''))
                 })

                 newVideoSigh.save(function(err){
                    if (err) {
                        console.log("CAN'T SAVE VIDEO: " + err);
                    } 
                 });

                // console.log(req.params);
                if (!imgs){
                    res.json(resultData);
                } else {
                    res.render('error', {data: srcs})
                }


                //  Get the lower quality ones
                // var patt=new RegExp("\"storyboard_spec\": \"(.*?)\"","g");
                // var result=patt.exec(data);
                // patt=new RegExp("(http.*?)\\|.*?#M\\$M#(.*)","g");//"(http.*?)\\|.*?#M\\$M#(.*?)\\|","g"); 
                // result=patt.exec(result[1]);
                // //console.log(result);
                // var httpSource = result[1];
                // var sigh = result[2];

                // srcs.push( httpSource.replace(/\\/g, "").replace("$L", "1").replace("$N", "M0") + "?sigh="+sigh );
                // srcs.push( httpSource.replace(/\\/g, "").replace("$L", "1").replace("$N", "M1") + "?sigh="+sigh );
                // srcs.push( httpSource.replace(/\\/g, "").replace("$L", "1").replace("$N", "M2") + "?sigh="+sigh );



              } else{
                // console.log(response);
                // console.log(error)
                var resultData = {
                    statusCode: response.statusCode
                };
                res.status(400);
                res.json(resultData);
              }
            })
        }
    })
}



exports.devClear = function(req, res) {


    VideoSigh.remove({}, function(err) { 
       console.log('collection removed');
    });
    // mongoose.connection.collections['videoSighs'].drop();
    res.json({done: "Done"})
}
