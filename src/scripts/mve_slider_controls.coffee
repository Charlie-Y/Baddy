mve = require('./mve_base')
MVE_Plugin = require('./mve_plugins')


MVE_SliderControls = MVE_Plugin.extend({
	defaults: {
		playerSliderSelector: ".slider-bar"


		dragNewMoveSelector: ".drag-new-move"
		zoomInSelector: ".zoom-in"
		zoomOutSelector: ".zoom-out"
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

		# ------- Drag data ------ #


		@options.dragStartHandle = new can.Map(mve.handleData)
		@options.dragEndHandle = new can.Map(mve.handleData)
		@options.dragMiddle = new can.Map(mve.handleMiddleData)
		viewData.attr('dragStartHandle', @options.dragStartHandle)
		viewData.attr('dragEndHandle', @options.dragEndHandle)
		viewData.attr('dragMiddle', @options.dragMiddle)




		# ----- Drag State machine stuff ---- #		 	

		@app.setupState(@DMS)
		@app.options.dragMoveState = can.compute()
		@options.dragMoveState = @app.options.dragMoveState
		@options.dragMoveState(@DMS.NONE)


		# ------ Buttons etc ----- #

		@options.sliderButtons = @app.options.sliderButtons


		@on()




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

		@handleDragPlayerInterval()


	onPlayerStateChange: (newState, oldState) ->
		@_super()





	"{playerSliderSelector} mouseenter": (el, ev) ->
		@mouseenterSlider = true
		@app.options.sliderMouser.removeClass('hide')
		# @app.options.sliderBubble.removeClass('hide')
		@options.sliderBubbleData.attr('show', true)

	"{playerSliderSelector} mousemove": (el, ev) ->

		if @handleMouseMove(el, ev)
			return 

		if @mouseenterSlider
			# @sliderMouser
			# x = el.get(0).offsetLeft 
			x = el.offset().left
			mouseX = ev.clientX

			@app.options.sliderMouser.css('left', "#{mouseX - x - @app.options.sliderMouser.width()/2}px")
			# console.log(x:x, mouseX: mouseX)

			@options.sliderBubbleData.attr('time', @timeFromX(mouseX - x))
			@options.sliderBubbleData.attr('left', "#{mouseX - x - @element.find('.slider-bubble').width()/2}px")
			# @setSighImg(@timeFromX(mouseX - x))

	# el should always be {playerSliderSelector}
	timeFromSliderMouse: (el, ev) ->
		return @timeFromX( @xFromSliderMouse(el, ev))

	xFromSliderMouse: (el, ev) ->
		x = el.offset().left
		mouseX = ev.clientX
		return mouseX - x


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
		@mousedown = false

		# @options.dragMoveState(@DMS.DONE)
		@handleDragMouseUp()

		@app.options.sliderMouser.addClass('hide')
		# @app.options.sliderBubble.addClass('hide')
		@options.sliderBubbleData.attr('show', false)


	# the functionality that I want ---

	###

	drag and slide across the slider bar creates a zone with two defined handles
	fades out the slider handle stuff for the current move

	once the handles are finished - it will display 2 icons - 
	zoom in, zoom out, and a create Move button, Plus
	
	clikcing plus creates a move with those start and end times


	pops out two buttons in the slider-bottom spacer
	zoom/zoom in


	###

	# Drag move state

	DMS: {
		NONE:{
			enter: (_this) ->
				_this.options.dragStartHandle.attr('show', false)
				_this.options.dragEndHandle.attr('show', false)
				_this.options.dragMiddle.attr('show', false)
				_this.options.sliderButtons.attr('showNewMove', false)
				return jQuery.when()

		}
		DOWN:{

		}
		
		MOVED:{ # moved while down

		}

		UP:{
		}
		DONE:{

		}
	}

	# Zoom Steate
	ZS: {

	}


	# ------------------- Drag + create stuff ----------------- #


	"{dragMoveState} change": (newMoveState, ev, newState, oldState) ->
		_this = @
		
		# mc = @movementControls()
		# if newState isnt @DMS.DONE
		# 	mc.options.playMoveState(mc.PMS.DONE)
		# 	mc.options.newMoveState(mc.NMS.DONE)
		@app.handleStateChange(_this, newState, oldState, 'dragMoveState')

	"{playerSliderSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		console.log('click')

		if @options.dragMoveState() is @DMS.MOVED
			return

		@movementControls().cancelMovePlay()
		sliderWidth = @app.options.slider.width()
		# clickWidth = event.pageX - @slider.get(0).offsetLeft
		clickWidth = event.pageX - @app.options.slider.offset().left
		percentage = clickWidth / sliderWidth
		timeFromPercent = @duration * percentage
		# @sliderBar.width("#{percentage * 100}%")
		if @options.playerState() is mve.PS.UNSTARTED
			@player.playVideo()

		@player.seekTo(timeFromPercent)


	"{playerSliderSelector} mousedown": (el, ev) ->
		mve.disableEvent(ev)

		@options.dragMoveState(@DMS.DOWN)

		@mousedownClientX = @xFromSliderMouse(el, ev)
		

		@options.dragStartHandle.attr('left', "#{@mousedownClientX}px")
		@options.dragStartHandle.attr('time', @timeFromSliderMouse(el,ev))

		@options.dragEndHandle.attr('show', false)
		@options.dragEndHandle.attr('time', -1)

		
		@options.dragMiddle.attr('show', false)
		@options.dragMiddle.attr('left', "#{@mousedownClientX}px")

		# console.log('down')


	handleDragPlayerInterval: () ->
		# if @options.dragMoveState() is @DMS.MOVED



	handleMouseMove: (el, ev) ->
		if @options.dragMoveState() in [@DMS.DOWN, @DMS.MOVED]
			# show the two things

			@options.dragMoveState(@DMS.MOVED)

			# @mousemove = true
			@options.dragStartHandle.attr('show', true)
			@options.dragEndHandle.attr('show', true)

			@options.dragEndHandle.attr('left', "#{@xFromSliderMouse(el, ev)}px")
			@options.dragEndHandle.attr('time', @timeFromSliderMouse(el,ev))


			# TODO - debounce on the seekTo
			@player.pauseVideo()
			# @player.seekTo(@timeFromSliderMouse(el,ev))

			@updateHandleMiddle(@options.dragMiddle, @options.dragStartHandle.time, @options.dragEndHandle.time, @options.dragStartHandle, @options.dragEndHandle)

			# console.log("foo")


	"{playerSliderSelector} mouseup": (el, ev) ->
		mve.disableEvent(ev)
		# console.log('up')
		@handleDragMouseUp()

	handleDragMouseUp: () ->

		if @options.dragMoveState() is @DMS.MOVED
			@showDragMoveButtons()
		else if @options.dragMoveState() is @DMS.DOWN
			@options.dragStartHandle.attr('show', false)
			@options.dragMiddle.attr('show', false)
			@options.sliderButtons.attr('show', false)





		@options.dragMoveState(@DMS.DONE)

		# if @mousemove


	showDragMoveButtons: () ->
		# get the middle value
		o = @options
		
		middleVal = ( o.dragStartHandle.time + o.dragEndHandle.time ) / 2
		newLeft = @percentForTime(middleVal)

		# console.log(newLeft: newLeft)

		# TODO - center this naturally
		o.sliderButtons.attr('show', true)
		o.sliderButtons.attr('showNewMove', true)

		o.sliderButtons.attr('left', "#{newLeft * 100 - 3}%")

	updateHandleMiddle: (handleMiddle, startTime, endTime, startHandle, endHandle) ->
		# startTime = @options.currentMovement.startTime
		# endTime = @options.currentMovement.endTime
		if !(startTime? and endTime?)
			return 

		timeDifference = Math.abs(endTime - startTime)
		smallerVal = if startTime < endTime then startTime else endTime

		handleMiddle.attr('left', "#{smallerVal / @duration * 100}%")
		handleMiddle.attr('width', "#{timeDifference / @duration * 100}%")
		handleMiddle.attr('show', startHandle.attr('show') and endHandle.attr('show'))


	"{dragNewMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		o = @options
		startTime = o.dragStartHandle.attr('time')
		endTime = o.dragEndHandle.attr('time')

		@movementControls().loadCreatedMovement(startTime, endTime)

		@options.dragMoveState(@DMS.NONE)

	# ------------------- Zoom stuff -------------------------- #



	"{zoomOutSelector} click": (el, ev) ->
		mve.disableEvent(ev)



	"{zoomInSelector} click": (el, ev) ->
		mve.disableEvent(ev)



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


})

module.exports = MVE_SliderControls





















