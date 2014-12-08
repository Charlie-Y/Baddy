# STORYBOARDS YES BABY
# http://ctrlq.org/code/19236-youtube-storyboard-bookmarklet

#https://github.com/bulutcy/youtube-storyboard/blob/master/youtube-storyboard/storyboard.js


# mve = window.mve or {} 

mve = {}
# window.mve = mve
mve.mustachePath = 'mustache/'

mve.mustacheFor = (fileNameNoExt) ->
	return @mustachePath + fileNameNoExt + '.mustache'

disableEvent = (ev) ->
	ev.preventDefault()
	ev.stopPropagation()

mve.disableEvent = disableEvent


mve.timeInMinsSeconds = (timeInSeconds) ->
	mins = Math.floor(timeInSeconds / 60)
	seconds = timeInSeconds % 60
	# // return {'mins': mins, 'seconds': seconds}
	seconds = Math.round(seconds * 100)/100;
	if seconds < 10
	    seconds = "0" + seconds
	return mins + " : " + seconds

mve.timeInHoursMinsSeconds = (timeInSeconds) ->
	
	# in case can.computes are passed in
	if typeof( timeInSeconds) is "function"
		timeInSeconds = timeInSeconds()

	# uh in case strings already passed in, or "---" etc...
	if typeof( timeInSeconds ) is "string"
		return timeInSeconds

	hours = Math.floor(timeInSeconds / 60 / 60)
	mins = Math.floor(timeInSeconds / 60)
	seconds = timeInSeconds % 60
	# // return {'mins': mins, 'seconds': seconds}
	# seconds = Math.round(seconds * 100)/100; # round 2 decimal places
	seconds = Math.round(seconds * 100)/100;

	if seconds < 10
	    seconds = "0" + seconds
	
	if hours is 0
		return mins + " : " + seconds
	else 
		if mins < 10
			mins = "0" + mins
		return hours + ":" + mins + " : " + seconds


mve.min = (array) ->
	return Math.min.apply(Math, array);

mve.max = (array) ->
	return Math.max.apply(Math, array);

mve.DeadPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

mve.PS = {
	UNSTARTED: -1
	ENDED: 0
	PLAYING: 1
	PAUSED: 2
	BUFFERING: 3
	VIDEO_CUED: 5
}

mve.handleData = {
	time: -1
	left: -1
	selected: false
	show: false
	}

mve.handleMiddleData = {
	left: false
	width: false
	show: false
	}



module.exports = mve

















