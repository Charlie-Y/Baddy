# STORYBOARDS YES BABY
# http://ctrlq.org/code/19236-youtube-storyboard-bookmarklet

#https://github.com/bulutcy/youtube-storyboard/blob/master/youtube-storyboard/storyboard.js


# baddy = window.baddy or {} 

baddy = {}
# window.baddy = baddy
baddy.mustachePath = 'mustache/'

baddy.mustacheFor = (fileNameNoExt) ->
	return @mustachePath + fileNameNoExt + '.mustache'

disableEvent = (ev) ->
	ev.preventDefault()
	ev.stopPropagation()

baddy.disableEvent = disableEvent


baddy.timeInMinsSeconds = (timeInSeconds) ->
	mins = Math.floor(timeInSeconds / 60)
	seconds = timeInSeconds % 60
	# // return {'mins': mins, 'seconds': seconds}
	seconds = Math.round(seconds * 100)/100;
	if seconds < 10
	    seconds = "0" + seconds
	return mins + " : " + seconds

baddy.timeInHoursMinsSeconds = (timeInSeconds) ->
	
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


baddy.min = (array) ->
	return Math.min.apply(Math, array);

baddy.max = (array) ->
	return Math.max.apply(Math, array);

baddy.DeadPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"


module.exports = baddy

















