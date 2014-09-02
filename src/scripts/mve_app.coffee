###

Thigns to implement before a grevious redesign and refactoring

Zooming with Labeling
Chaining
Remote Controlling
PausePoints




###

mve = require('./mve_base')

Movement = require('./mve_movement')
MVE_TimeControls = require('./mve_time_controls')
MVE_SliderControls = require('./mve_slider_controls')
MVE_MovementControls = require('./mve_movement_controls')
MVE_Storage = require('./mve_storage')

# there should only be one
MVEPlayerApp = can.Control.extend({
	defaults: {
		template: mve.mustacheFor('mve_player')
		iframeSelector: 'player'
		iframeWrapSelector: '.player-wrap'

		# playerSliderSelector: ".player-slider"

		storageSetting: 'LOCAL'
		# storageSetting: 'DEV'
		# storageSetting: 'SERVER'


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
		

		@options.startHandleData = new can.Map(mve.handleData)
		@options.endHandleData = new can.Map(mve.handleData)
		viewData.attr('startHandleData', @options.startHandleData)
		viewData.attr('endHandleData', @options.endHandleData)

		@options.handleMiddle = new can.Map( mve.handleMiddleData)
		viewData.attr('handleMiddle', @options.handleMiddle)

		@options.sliderButtons = new can.Map({
			show: false
			showNewMove: true
			showZoomIn: true
			showZoomOut: true
			left: false
			})

		viewData.attr('sliderButtons', @options.sliderButtons)

		# --- JS Movements --- #
		# @movements = new Movement.List(Movement.devMovements)
		@options.movements = @loadMovements()
		viewData.attr('movements', @options.movements)

		@timeControls = new MVE_TimeControls(@element, {viewData: viewData, app: _this})
		@sliderControls = new MVE_SliderControls(@element, {viewData: viewData, app: _this})
		@movementControls = new MVE_MovementControls(@element, {viewData: viewData, app: _this})
		@controls = [@sliderControls, @timeControls, @movementControls]

		@on()

		# do the setup
		@setupYoutubeApiReady()
		@insertYoutubeApiScript()



	setupYoutubeApiReady: () ->
		player = {}
		@player = player
		_this = @


		pathname = window.location.pathname

		if pathname isnt '/'
			@options.videoId = pathname.slice(1)


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

	handleStateChange: (_this, newState, oldState, superStateName) ->
		console.log(superState: superStateName, newState: newState.name, oldState: oldState.name)
		


		oldState.leave(_this).done( () ->
			# console.log(doneLeaving: oldState.name)
			newState.enter(_this).done( () ->
				# console.log(doneEntering: newState.name)
				)
			)


	# ===================== Movements ============== #

	# Why are the movements here? Why aren't they in the movements controls?
	# maybe because other things might want them, but I'm not entirely sure


	loadMovements: () ->
		switch @options.storageSetting
			when 'LOCAL'
				return new Movement.List( MVE_Storage.getMovementsRaw(@options.videoId) )
			when 'SERVER'
				return new Movement.findAll('some parameter TODO') 
			when 'DEV'
				return new Movement.List(Movement.devMovements)

	"{movements} change": (movements, ev, index, event, changedMovements) ->
		switch @options.storageSetting
			when 'LOCAL'
				# console.log("Saving to local...")
				MVE_Storage.saveMovements(@options.videoId, movements.attr())



})

module.exports = MVEPlayerApp

$(document).ready( () ->
    mvePlayer = new MVEPlayerApp("#main-super-wrap");
	)