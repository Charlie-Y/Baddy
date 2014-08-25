mve.MVE_TimeControls = mve.MVE_Plugin.extend({
	defaults:{

		}
},{	
	init: (element, options) ->
		@_super()
		console.log('MVE_TimeControls')

		viewData = @options.viewData

		# ---- Time / Seek variables --- #
		@SMALL_SEEK = .05
		@LARGE_SEEK = .10
		
		baseTime = "00:00:00"
		@zeroTimeObs = can.compute(baseTime)
		@currentTimeObs = can.compute(baseTime)
		@totalTimeObs = can.compute(baseTime)
		viewData.attr('zeroTimeObs', @zeroTimeObs)
		viewData.attr('currentTimeObs', @currentTimeObs)
		viewData.attr('totalTimeObs', @totalTimeObs)

		# --- Playback Rate variables --- #
		@playbackRates = new can.List()
		viewData.attr('playbackRates', @playbackRates)
		@currentPlaybackRate = 1

	onPlayerReady: () ->
		@_super();

		# Setup the correct time
		@totalTimeObs(mve.timeInHoursMinsSeconds(@duration))
		@zeroTimeObs(mve.timeInHoursMinsSeconds(0))

		# only allow rates <= 1. No point in watching faster ones
		allPlaybackRates = @player.getAvailablePlaybackRates()
		for playbackRate in allPlaybackRates
			if playbackRate <= 1
				@playbackRates.push(new can.Map({rate: playbackRate, active: (playbackRate is 1)}))

	onPlayerInterval: () ->
		# update the times
		@updateTimeDisplay()

	onPlayerStateChange: (newState, oldState) ->
		playIcon = @element.find('.play-icon')
		if newState is mve.PS.PLAYING
			playIcon.removeClass('fa-play')
			playIcon.addClass('fa-pause')
		else 
			playIcon.removeClass('fa-pause')
			playIcon.addClass('fa-play')

	updateTimeDisplay: () ->
		currentTime = @player.getCurrentTime()
		@currentTimeObs(mve.timeInHoursMinsSeconds(currentTime))

	".playback-rate click": (el, ev) ->
		rate = el.data('rate')

		@playbackRates.forEach( (el) ->
			el.attr('active', el.rate is rate.rate)
			)
		@player.setPlaybackRate(rate.attr('rate'))

	".seek-icon click": (el, ev) ->
		seekMap = {
			"fa-angle-double-left": -@LARGE_SEEK
			"fa-angle-left": -@SMALL_SEEK
			"fa-angle-right": @SMALL_SEEK
			"fa-angle-double-right": @LARGE_SEEK
		}
		seekVal = undefined
		# this is def roundabout... sigh
		for className in el.get(0).classList
			mappedVal = seekMap[className]
			if mappedVal isnt undefined
				seekVal = mappedVal
		
		if seekVal is undefined
			console.error("Doom")
 
		@player.pauseVideo()
		newTime = @player.getCurrentTime() + seekVal
		@player.seekTo(newTime)

	".play-icon click": (el, ev) ->
		# console.log("click")
		if @options.playerState() in [mve.PS.PAUSED, mve.PS.ENDED, mve.PS.UNSTARTED]
			@player.playVideo()
			console.log("playVideo")
			# el.removeClass('fa-pause')
			# el.addClass('fa-play')
		else if @options.playerState() in [mve.PS.PLAYING]
			@player.pauseVideo()
			console.log("pauseVideo")

			# el.removeClass('fa-play')
			# el.addClass('fa-pause')
		mve.disableEvent(ev)


	"{window} keydown": (el,ev) ->
		# console.log(keyCode: ev.keyCode)
		keyCode = ev.keyCode
		LEFT = 37
		RIGHT = 39
		SPACE = 32
		if keyCode is SPACE
			@togglePlayPause()
			mve.disableEvent(ev)
		else if keyCode is LEFT
			@player.pauseVideo()
			@player.seekTo( @player.getCurrentTime() - @SMALL_SEEK)
			# so calling disable event somehow breaks this...
			mve.disableEvent(ev)
		else if keyCode is RIGHT
			@player.pauseVideo()
			# console.log( @player.getCurrentTime() + @SMALL_SEEK )
			@player.seekTo( @player.getCurrentTime() + @SMALL_SEEK )
			mve.disableEvent(ev)


	togglePlayPause: () ->
		if @options.playerState() is mve.PS.PLAYING
			@player.pauseVideo()
		else 
			@player.playVideo()
})