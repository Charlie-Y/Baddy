# STORYBOARDS YES BABY
# http://ctrlq.org/code/19236-youtube-storyboard-bookmarklet

#https://github.com/bulutcy/youtube-storyboard/blob/master/youtube-storyboard/storyboard.js

###


Development guidelines



- use options.elements for elements


###


mve = window.mve or {} 
window.mve = mve

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

mve.DeadPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

mve.PS = {
	UNSTARTED: -1
	ENDED: 0
	PLAYING: 1
	PAUSED: 2
	BUFFERING: 3
	VIDEO_CUED: 5
}

# there should only be one
mve.MVEPlayerApp = can.Control.extend({
	defaults: {
		template: mve.mustacheFor('mve_player')
		iframeSelector: 'player'
		iframeWrapSelector: '.player-wrap'

		# playerSliderSelector: ".player-slider"


		# vidWidth: 853
		# vidHeight: 480
		vidWidth: 1080
		vidHeight: 558
		# vidHeight: 608
		videoId: "CGyEd0aKWZE" # burn
		# videoId: "o5qW-u_U1JU" # double broadsword
		# videoId: "WX8-W3FA9b8" # mirrors
		# videoId: "C46C9O7VXxE" # pusher love girl

		autoplay: 0
		controls: 0
		ytplayer: undefined
	}
}, {
	init: (element, options) ->
		if window.MVE?
			console.error("There should only be one MVEPlayerApp")
			console.error("i'm not building for two in the same page")
			return 

		window.MVE = @
		viewData = new can.Map()
		_this = @

		@setupAllStates()

		# --- Video playback variables --- #
		@duration = undefined # time in seconds of the movie

		# --- Interval variables --- #
		@playerIntervalId = undefined
		@PLAYER_INTERVAL_TIME = 100
		@options.globalCurrentTime = can.compute(0)

		# --- Quality variables --- #
		@useHighestQuality = false
		@qualityLevels = new can.List()
		viewData.attr('qualityLevels', @qualityLevels)

		# --- Playerstate machine stuff --- #
		@youtubeAPILoaded = can.compute(false)
		@options.playerState = can.compute(mve.PS.UNSTARTED)
		
		# @options.newMoveState = can.compute(@NMS.NONE)
		# viewData.attr('newMoveState', @options.newMoveState)

		# @options.playMoveState = can.compute(@NMS.NONE)
		# viewData.attr('playMoveState', @options.playMoveState)

		# --- Define the helpers ---- #
		helpers = {
			"formattedTime": mve.timeInHoursMinsSeconds
		}

		# --- Load the html ---- #

		viewData.attr('deadPixel', mve.DeadPixel)

		@element.html(can.view(@options.template, viewData, helpers))

		# --- Video elements --- # 
		@playerWrap = @element.find('.player-wrap')


		# -- Shared slider variables --- #
		handleData = {
			time: -1
			left: -1
			selected: false
			show: false
			}

		@options.startHandleData = new can.Map(handleData)
		@options.endHandleData = new can.Map(handleData)
		viewData.attr('startHandleData', @options.startHandleData)
		viewData.attr('endHandleData', @options.endHandleData)

		@options.handleMiddle = new can.Map({
			left: false
			width: false
			show: false
			})
		viewData.attr('handleMiddle', @options.handleMiddle)



		# --- JS Movements --- #
		@movements = new mve.Movement.List(mve.Movement.devMovements)
		viewData.attr('movements', @movements)


		@timeControls = new mve.MVE_TimeControls(@element, {viewData: viewData, app: _this})
		@sliderControls = new mve.MVE_SliderControls(@element, {viewData: viewData, app: _this})
		@movementControls = new mve.MVE_MovementControls(@element, {viewData: viewData, app: _this})
		@controls = [@sliderControls, @timeControls, @movementControls]

		@on()

		# do the setup
		@setupYoutubeApiReady()
		@insertYoutubeApiScript()



	setupYoutubeApiReady: () ->
		player = {}
		@player = player
		_this = @

		# Just pass on the event
		onPlayerReady = (event) -> 
			_this.onPlayerReady()

		onPlayerStateChange = (event) ->
			_this.changePlayerState(event.data)

		window.onYouTubeIframeAPIReady = () ->
			_this.player = new YT.Player('player', {
				height: _this.options.vidHeight
				width: _this.options.vidWidth
				videoId: _this.options.videoId
				playerVars: { controls: _this.options.controls, autoplay: _this.options.autoplay}
				events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
				}
			});

		
		
	insertYoutubeApiScript: () ->
		tag = document.createElement('script');
		# tag.src = "https://www.youtube.com/iframe_api";
		tag.src = "js/youtube_api.js"
		firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	onPlayerReady: () ->
		@player.playVideo()
		@youtubeAPILoaded(true)
		window.player = @player
		@duration = @player.getDuration()
		@player.mute()

		# Set the player interval tracker
		_this = @
		@playerIntervalId = setInterval( @playerInterval, @PLAYER_INTERVAL_TIME, _this )

		# Label here. probably redo labeling elsewhere

		for control in @controls
			control.onPlayerReady()

	
	setQualityRate: () ->
		# quality level stuff
		if !@qualityLevels.attr('length') 
			@qualityLevels.replace(@player.getAvailableQualityLevels())
			if @useHighestQuality
				highestQuality = @qualityLevels[0]
				@player.setPlaybackQuality(highestQuality)
			else 
				lowestQuality = @qualityLevels.attr(@qualityLevels.attr('length') - 2)
				# console.log(lowestQuality)
				@player.setPlaybackQuality(lowestQuality)


	changePlayerState: (newState) ->
		@options.playerState(newState)

	playerInterval: (_this) ->
		if !_this.youtubeAPILoaded()
			return

		_this.options.globalCurrentTime(_this.player.getCurrentTime())

		for control in _this.controls
			control.onPlayerInterval()

	# Here is how we react to stuff
	# this is so roundabout
	"{playerState} change": (playerState, ev, newVal, oldVal) ->
		# this has to be here, because qualityrates for onPlayerReady don't work
		@setQualityRate()

		for control in @controls
			control.onPlayerStateChange(newVal, oldVal)

	".flip-icon click" : (el, ev) ->
		@playerWrap.toggleClass('flipped')

	loadNewPlayer: () ->
		@player.loadVideoById(@options.videoId)

	# based on the youtube API, figure out what the quality level of this
	# thing is cut out to be
	getAspectRatio: () ->
		return 16/9
		# quality = @player.getPlaybackQuality()


	# getAspectRatio: () ->
		# quality = @player.

	# =======================  State machine stuff ======================= #

	setupAllStates: () ->
		# @setupState(@NMS)
		# @setupState(@PMS)

	setupState: (states) ->

		for key, obj of states
			# append a name to each state
			states[key].name = key

			# setup a dummy deferred function
			if not states[key].enter
				states[key].enter = () ->
					return jQuery.Deferred().resolve()
			if not states[key].leave
				states[key].leave = () ->
					return jQuery.Deferred().resolve()

	handleStateChange: (_this, newState, oldState) ->
		console.log(newState: newState.name, oldState: oldState.name)
		oldState.leave(_this).done( () ->
			# console.log(doneLeaving: oldState.name)
			newState.enter(_this).done( () ->
				# console.log(doneEntering: newState.name)
				)
			)


	# New Move State
	# NMS: {
	# 	NONE: {
	# 	}
	# 	START:{
	# 	}
	# 	END: {
	# 	}
	# 	DONE: {
	# 	}
	# }

	# Play move state
	# haha pms. no.
	# PMS:{
	# 	NONE: {
	# 	}
	# 	PLAYING_MOVE: {
	# 	}
	# 	PAUSED_MOVE: {
	# 	}
	# 	LOOPING_MOVE: {
	# 	}
	# }


	###

	This needs to be a good thing that works well
	I basically need a bunch of mini states which make it impossible for
	them to interfere with each other

	for example,if I am in edit mode and I want to go into play mode
		that doesn't bother me

		I alsow want plugins to be able to have their own state machienes
		which are taken into consideration by the larger state machine manager 
		inside the app

		I also don't like editing a big ass state machine so I want sub state machines
		that all work perfectly fine together


		app.setCurrentState(afsd)

		if enter state si called
			leavecurrentstae.done()


		leavecurrentstate: ->
			if new state.superstate is a different superstate
				return prev state.superstate.leave
			else 
				return 

		superstate.leave() ->
			leave the particular inner state
			reset the superstate to its starting position



	









	###
	# "{newMoveState} change": (newMoveState, ev, newState, oldState) ->
		# console.log(newState: newState)
		# @movementControls.onNewMoveStateChange(newState, oldState)






})

# mve.UIState = can.Construct.extend({

# }, {
# 	init: () ->

# 	enter: () ->
# 		return jQuery.Deferred().resolve()
# 	leave: () ->
# 		return jQuery.Deferred().resolve()


# 	substates: []
# })




















