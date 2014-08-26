mve = require('./mve_base')
MVE_Plugin = require('./mve_plugins')


MVE_SliderControls = MVE_Plugin.extend({
	defaults: {
		playerSliderSelector: ".slider-bar"
	}
},{
	init: (element, options) ->
		@_super()

		viewData = @options.viewData

		# --- Slider variables --- #
		@mouseenterSlider = false
		@sliderLabels = new can.List() # label: {left: % | px, type: full | half}
		viewData.attr('sliderLabels', @sliderLabels)
		
		# --- Slider elements --- #
		@app.options.slider = @element.find(@options.playerSliderSelector)
		@app.options.sliderProgressBar = @element.find('.slider-progress')
		@app.options.loadedBar = @element.find('.slider-loaded')
		@app.options.sliderMouser = @element.find(".slider-mouser")
		@app.options.sliderBubble = @element.find(".slider-bubble")

		@options.sliderBubbleData = new can.Map({
			show: false
			left: false
			time: false
			src: undefined
			backgroundSize: "400px 300px"
			backgroundPosition: "0 0"
			highQuality: true
			# then will need background src soon
			})
		viewData.attr('sliderBubbleData', @options.sliderBubbleData)

		@options.sighDataLoaded = can.compute(false)
		@options.sighData = new can.Map({
			sigh: false
			base: false
			})


	onPlayerReady: () ->
		@_super()
		@labelSliderBar()
		# @loadSighData()

	onPlayerInterval: () ->
		@_super()
		currentTime = @player.getCurrentTime()
		# update the bar
		percentage = "#{@percentForTime(currentTime)*100}%"
		# console.log(percentage)
		@app.options.sliderProgressBar.width( percentage )

		loadedPercentage = "#{@player.getVideoLoadedFraction() * 100}%"
		@app.options.loadedBar.width( loadedPercentage )

	onPlayerStateChange: (newState, oldState) ->
		@_super()

	labelSliderBar: () ->




	# label a large thing every minute
	# label a small one every half minute
	# label: {left: % | px, type: full | half}

	# THIS IS REALLY HARD

	labelSliderBar: () ->
		sliderBar = @element.find('.slider-bar')
		width = sliderBar.width()
		# console.log(duration: @duration)


		# halfminutes = Math.floor( @duration / 60)
		# for num in [1..minutes]
		# 	@sliderLabels.push(
		# 		{
		# 			left: "#{ num * 60 / @duration * 100 }%"
		# 			type: 'full'
		# 		})

	"{playerSliderSelector} click": (el, ev) ->
		# console.log("foo")

		@movementControls().cancelMovePlay()

		mve.disableEvent(ev)
		sliderWidth = @app.options.slider.width()
		# clickWidth = event.pageX - @slider.get(0).offsetLeft
		clickWidth = event.pageX - @app.options.slider.offset().left
		percentage = clickWidth / sliderWidth
		timeFromPercent = @duration * percentage
		# @sliderBar.width("#{percentage * 100}%")
		if @options.playerState() is mve.PS.UNSTARTED
			@player.playVideo()

		@player.seekTo(timeFromPercent)


	"{playerSliderSelector} mouseenter": (el, ev) ->
		@mouseenterSlider = true
		@app.options.sliderMouser.removeClass('hide')
		# @app.options.sliderBubble.removeClass('hide')
		@options.sliderBubbleData.attr('show', true)

	"{playerSliderSelector} mousemove": (el, ev) ->
		if @mouseenterSlider
			# @sliderMouser
			# x = el.get(0).offsetLeft 
			x = el.offset().left
			mouseX = ev.clientX

			@app.options.sliderMouser.css('left', "#{mouseX - x - @app.options.sliderMouser.width()/2}px")
			# console.log(x:x, mouseX: mouseX)

			@options.sliderBubbleData.attr('time', mve.timeInMinsSeconds(@timeFromX(mouseX - x)))
			@options.sliderBubbleData.attr('left', "#{mouseX - x - @element.find('.slider-bubble').width()/2}px")
			# @setSighImg(@timeFromX(mouseX - x))

	percentForTime: (timeInSeconds) ->
		# console.log(timeInSeconds: timeInSeconds, duration: @duration)
		return timeInSeconds / @player.getDuration()

	timeFromX: (x) ->
		totalWidth = @app.options.slider.width()
		percentage = x / totalWidth;
		time = @duration * percentage;
		return time;

	"{playerSliderSelector} mouseleave": (el, ev) ->
		@mouseenterSlider = false
		@app.options.sliderMouser.addClass('hide')
		# @app.options.sliderBubble.addClass('hide')
		@options.sliderBubbleData.attr('show', false)


	#
	loadSighData: () ->
		_this = @

		$.get('/sigh/' + @app.options.videoId, (data) ->
			if data.statusCode is 200
				_this.options.sighData.attr('base', data.base)
				_this.options.sighData.attr('sigh', data.sigh)
				_this.options.sighDataLoaded(true)
				
				console.log("sighDataLoaded");

			else 
				console.error("Can't get sigh with error: " + data.statusCode)
			)

	setSighImg: (time) ->
		if !@options.sighDataLoaded()
			console.error("Sigh data not loaded")

		base = @options.sighData.attr('base')
		sigh = @options.sighData.attr('sigh')

		storyboardNumber = 1

		# what is this l,onger than 20 mins case?
		# i guess there is a completely diff case.. sigh


		# THIS IS PRETTY DAMN ANNOYING


		###

		here's how I think it works


		if there are less then 250 seconds in a movie, then each frame
		is given 2 seconds and the frame number is Math.floor(time/2)
		frameLength = 2
		frameNumber = Math.floor( time / frameLength)

		if there are more than 250 seconds in a movie, then each 
		frameLength = duration / 125 frames 
		frameNumber = Math.floor( time / frameLength )

		Then if the movies even longer I have no damn clue...


		###

		# aspect ratio

		frameNumber = -1
		frameLength = -1

		if @duration <= 250
			frameLength = 2
		else if @duration < 1200 # 20 minutes
			frameLength = @duration / 125


		# skip the zeroth frame. seconds 0-2 are the first frame
		frameNumber = Math.floor( (time + 1) / frameLength)
		if frameNumber <= 0
			frameNumber = 1

		# frame number is not that simple.....
		# o5qW-u_U1JU




		spriteIndex = frameNumber % 25
		spriteRow = Math.floor(spriteIndex / 5) 
		spriteCol = spriteIndex % 5


		sliderBubble = @element.find(".slider-bubble .bubble-img")
		tileWidth = sliderBubble.width()
		tileHeight = sliderBubble.height()

		backgroundX = "#{-tileWidth * spriteCol}px"
		backgroundY = "#{-tileHeight * spriteRow}px"
		backgroundPosition = "#{backgroundX} #{backgroundY}"

		@options.sliderBubbleData.attr('backgroundSize', "#{tileWidth * 5}px #{tileHeight * 5}px")
		@options.sliderBubbleData.attr('backgroundPosition', backgroundPosition)


		storyboardMax = if (@duration < 60 * 20) then 5 else time / (60 * 4);
		storyboardNumber = Math.floor( frameNumber / 25 )

		console.log({storyboardNumber: storyboardNumber, frameNumber: spriteIndex})
		# n = (time < 60 * 20) ? 5 : time / (60 * 4);


		src = "#{base}#{storyboardNumber}.jpg?sigh=#{sigh}"

		@options.sliderBubbleData.attr('src', src)


	getSighPosition: (time) ->


})

module.exports = MVE_SliderControls





















