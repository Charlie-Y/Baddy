# Everything related to newmove, savemove, edit move stuff is all here
# That means managing slider objects and time objects as well

# ALL the logic goes here. even if an element is defined elsewhere, put it back hers

mve = require('./mve_base')
MVE_Plugin = require('./mve_plugins')
Movement = require('./mve_movement')


MVE_MovementControls = MVE_Plugin.extend({
	defaults: {

		# Selectors related to making new moves
		newMoveCreateSelector: ".new-move-create"
		# saveMoveSelector: ".new-move-save"
		# cancelMoveSelector: ".new-move-cancel"
		pausePointSelector: '.new-move-pause-point'
		chainMoveSelector: ".new-move-chain"

		deselectMoveSelector: ".move-deselect"

		editStartSelector: ".edit-start"
		editEndSelector: ".edit-end"

		enabledButtonClass: "enabled"
		activeButtonClass: "active"

		# Selectors related to playing moves
		playMoveSelector: '.play-move'
		loopMoveSelector: '.loop-move'
		

		moveDataSelector: '.movement-data'

		seekableSelector: "[data-seekable]"

		# Saved movement stuff
		setCurrentMoveSelector: '.set-move'
		setPlayMoveSelector: '.set-play-move'
		setLoopMoveSelector: '.set-loop-move'
		deleteMoveSelector: '.delete-move'

		


		playerSliderSelector: "."

	}
},{
	init: (element, options) ->
		@_super();

		@options.movementButtons = @element.find(".new-move-button-block")
		# console.log(@options.movementButtons.addClass("active"))
		@options.movementPlayButton = @element.find(@options.playMoveSelector)
		@options.movementLoopButton = @element.find(@options.loopMoveSelector)
		@options.movementCreateButton = @element.find(@options.newMoveCreateSelector)
		# @options.newMovement.hide().removeClass('hide')

		# -- Current move stuff --- #
		@pausePoints = new can.List()
		@options.showPausePoints = can.compute(false)
		@options.viewData.attr('showPausePoints', @options.showPausePoints)
		@options.pausePointLength = can.compute(500)

		# @loadNewMovement(false)
		@options.viewData.attr('pausePoints', @pausePoints)

		# --- DIsplay elements --- # 
		@startHandleData = @app.options.startHandleData
		@endHandleData = @app.options.endHandleData
		@handleMiddle = @app.options.handleMiddle
		# @options.newMoveState = @app.options.newMoveState

		# --- html elements --- #

		@loadHTMLElems()

		# @options.nameBlock = @element.find('.name-left')
		@options.showMovementPlayButtons = can.compute(false)
		@options.viewData.attr('showMovementPlayButtons', @options.showMovementPlayButtons)



		# ---- State machine stuff ---- #
		@app.fullSetupState(@NMS, @, 'newMoveState')
		@app.fullSetupState(@PMS, @, 'playMoveState')


		@on();

		#  call @on first so that the control can react to this binding
		@options.playMoveState(@PMS.NONE)
		# @options.newMoveState(@NMS.DONE)

		# console.log("Foo")



	# New Move State
	NMS: {
		# When a move doesn't exist
		NONE: {
			enter: (_this) ->
				_this.options.showPausePoints(false)
				return jQuery.when(
					_this.options.movementButtons.removeClass(_this.options.enabledButtonClass)
					_this.updateHandleVisiblity()

					)
			leave: (_this) ->
				_this.options.showPausePoints(true)

				return jQuery.when(
					_this.updateHandleVisiblity()
					)
		}
		# When a move exists
		DONE: {
			enter: (_this) ->
				return jQuery.when(
					_this.options.movementButtons.addClass(_this.options.enabledButtonClass)
					_this.updateHandleVisiblity()

					)
		}
	}

	loadHTMLElems: () ->

	onPlayerReady:() ->
		@_super()
		# @dev_setupPMS() 	


	# states probably shouldn't change in these
	onPlayerInterval: () ->

		@handlePlayMoveStateInterval()


	loadNewCurrentmovement: (movement) ->
		if @options.currentMovement?
			@options.currentMovement.attr('current', false)

		@options.currentMovement = movement
		cm = @options.currentMovement
		cm.attr('current', true)
		@options.viewData.attr('currentMovement', cm)
		# cm.isValid()
		@checkMoveComplete()

		@pausePoints.replace(cm.pausePoints)

		@on()
		@loadHTMLElems()
		@updateHandles()

	loadNewMovement: (rebind = true) ->
		if @options.currentMovement?
			@options.currentMovement.attr('current', false)

		@options.currentMovement = new Movement({
			startTime: "---"
			endTime: "---"
			name: "New Movement"
			saved: false

			# to show or not to show considered 
			looping: false
			current: true
			})
		@options.viewData.attr('currentMovement', @options.currentMovement)
		
		@pausePoints.replace([])

		if rebind
			@loadHTMLElems()
			@updateHandles()
			@on()




	# Somethign else, drag handles, is creating a movement
	# and setting it to be the current movement
	# used to create one from a zoom or something like tha
	loadCreatedMovement: (startTime, endTime) ->
		@loadNewMovement()
		cm = @options.currentMovement
		if startTime < endTime
			cm.attr('startTime', startTime)
			cm.attr('endTime', endTime)
		else 
			cm.attr('startTime', endTime)
			cm.attr('endTime', startTime)
		
		@checkMoveComplete()
		@options.newMoveState(@NMS.DONE)


	createChainedMovement: () ->
		currentEnd = @options.currentMovement.endTime
		@loadNewMovement()
		@options.currentMovement.attr('startTime', currentEnd)
		@updateHandleVisiblity()
		@player.seekTo(currentEnd)

		@options.newMoveState(@NMS.END)


	# Called when you want to know if you should show the movement
	# play and loop buttons
	checkMoveComplete: () ->
		cm = @options.currentMovement
		@options.showMovementPlayButtons( cm.isValid() )
		
		if cm.validated
			@saveMovement()



	updateHandles: () ->
		cm = @options.currentMovement
		@updateHandle(@startHandleData, cm.startTime)
		@updateHandle(@endHandleData, cm.endTime)

	"{currentMovement} change": (currentMovement, obj, attr, ev, newVal, oldVal) ->
		# console.log("change")
		if attr is 'startTime'
			@updateHandle(@startHandleData, newVal)
		if attr is 'endTime'
			@updateHandle(@endHandleData, newVal)

	updateHandle: (handle, time) ->
		handle.attr('time', time)
		handle.attr('left', "#{time / @duration * 100}%")
		handle.attr('show', true)

		startTime = @options.currentMovement.startTime
		endTime = @options.currentMovement.endTime
		@sliderControls().updateHandleMiddle(@handleMiddle, startTime, endTime, @startHandleData, @endHandleData)


	shouldShowHandle: (handle) ->
		result = false
		if @options.newMoveState() is @NMS.NONE
			result = false
			return result

		result = handle.time >= 0
		return result 


	# If each handle has a time properly set, set the show property on them
	updateHandleVisiblity: () ->
		@startHandleData.attr('show', @shouldShowHandle(@startHandleData))
		@endHandleData.attr('show', @shouldShowHandle(@endHandleData))
		@handleMiddle.attr('show', @startHandleData.attr('show') and @endHandleData.attr('show'))







	# ======== New move creation stuff ======= #


	"{newMoveState} change": (newMoveState, ev, newState, oldState) ->
		_this = @
		
		if newState isnt @NMS.NONE
			@options.playMoveState(@PMS.DONE)

		@app.handleStateChange(_this, newState, oldState, 'newMoveState')

	"{editStartSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		# @options.newMoveState(@NMS.START)

		cm = @options.currentMovement
		cm.attr('startTime', @)


	"{editEndSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		# @options.newMoveState(@NMS.END)

	"{newMoveCreateSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		# puts the movement there
		@loadNewMovement()

		# now i have to set the times

		cm = @options.currentMovement

		cm.attr('startTime', @player.getCurrentTime())
		cm.attr('endTime',mve.min([@player.getCurrentTime() + 3, @duration]))

		@updateHandles()
		console.log(cm)

		@options.newMoveState(@NMS.DONE)
		@saveMovement()


	"{deselectMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		@options.newMoveState(@NMS.NONE)

		@options.currentMovement.attr('current', false)
		@options.currentMovement = undefined


	"{saveMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		# console.log("???")
		@saveMovement()
		# @options.newMoveState(@app.NMS.DONE)

	"{chainMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		@createChainedMovement()


	"{pausePointSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		@createPausePoint()


		if @options.newMoveState() is @NMS.END

			@options.currentMovement.setEnd(@player.getCurrentTime(), @duration)

			@checkMoveComplete()
			@options.newMoveState(@NMS.DONE)

			return 

	saveMovement: () ->
		# this should be loading the attrs into anew model and pushing that
		# unless this model is already saved
		# console.log("??")
		# ??
		cm = @options.currentMovement

		# check if the movement is already in @app.movements

		if @app.options.movements.indexOf(cm) > -1
			# console.log("Save to localstorage or something")
			return 
		else 
			movementId = @app.options.movements.attr('length') + 1
			cm.attr('movementId', movementId)
			@app.options.movements.unshift(cm)


		# if nots, unshift
		# newMovement = new Movement({
		# 	startTime: cm.startTime
		# 	endTime: cm.endTime
		# 	name: "Move #{movementId}"
		# 	movementId: movementId
		# 	})
		
	
	# ======== Pause point stuff ========= # 
	

	createPausePoint: () ->
		currentTime = @player.getCurrentTime()
		console.log(createPausePoint: currentTime)

		cm = @options.currentMovement

		if !cm
			return

		if !(cm.startTime <= currentTime <= cm.endTime)
			console.log("pausePoint needs to be inside the movement")

		pausePoint = {
			time: currentTime
			left: "#{@sliderControls().modLeft(currentTime)}px"
		}

		@pausePoints.push(pausePoint)
		cm.pausePoints.push(pausePoint)

	# ======== Move Playing stuff ========= #

	dev_setupPMS: () ->
		# return 
		@loadNewMovement()

		cm = @options.currentMovement

		cm.attr('startTime', 10)
		cm.attr('endTime', 13)
		# cm.isValid()
		@checkMoveComplete()
		@options.newMoveState(@NMS.DONE)


	PMS: {
		# instead of 2 states for every play_state for play_once and play_loop
		# I'll just keep this looping var here
		# looping: false

		NONE:{
			enter: (_this) ->
				clearInterval(_this.pausePointInterval)
				clearTimeout(_this.pausePointPauseTimeout)

				return jQuery.when()

		}
		DONE:{
		}
		PLAYING:{
			enter: (_this) ->
				_this.element.find('.play-move').addClass('selected')
				return jQuery.when()
			leave: (_this) ->
				_this.element.find('.play-move').removeClass('selected')
				

				return jQuery.when()
		}
		PAUSE_POINT:{

		}

	}




	"{playMoveState} change": (playMoveState, ev, newState, oldState) ->
		_this = @
		if newState isnt @PMS.NONE
			@options.newMoveState(@NMS.DONE)


		@app.handleStateChange(_this, newState, oldState, 'playMoveState')

	"{playMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		@handleMovePlay()

	"{loopMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		# @handleMovePlay(true)
		# @PMS.looping = !@PMS.looping
		looping = @options.currentMovement.looping
		@options.currentMovement.attr('looping', !looping)

		# el.toggleClass('selected')

	"{seekableSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		time = el.data('seekable')
		@player.seekTo(time)

	handleMovePlay: () ->
		@options.playMoveState(@PMS.PLAYING)
		@player.seekTo(@options.currentMovement.startTime)

		# each pausepoint can be visited
		@pausePoints.each ((item, index) -> 
			item.attr('visited', false)
		)
		@pausePoints.comparator = 'time'
		@pausePoints.sort()

		@pausePointIndex = 0
		
		clearInterval(@pausePointInterval)
		@pausePointInterval = setInterval( @checkPausePoint, 10, @)

		# console.log(pausePointInterval: @pausePointInterval)

		@player.playVideo()


	checkPausePoint: (_this) ->
		if _this.pausePointIndex >= _this.pausePoints.length
			clearInterval(_this.pausePointInterval)
			return 

		upcomingPausePoint = _this.pausePoints.attr(_this.pausePointIndex)
		
		if _this.player.getCurrentTime() > upcomingPausePoint.time
			upcomingPausePoint.attr('visited', true)
			_this.pausePointIndex += 1
			_this.player.pauseVideo()

			clearTimeout(_this.pausePointPauseTimeout)
			_this.pausePointPauseTimeout = setTimeout( _this.continueFromPausePoint, _this.options.pausePointLength(), _this)



	continueFromPausePoint: (_this) ->
		_this.player.playVideo()




	cancelMovePlay: () ->
		if @options.currentMovement
			@options.currentMovement.attr('looping', false)

		@options.playMoveState(@PMS.NONE)


		# if @options.playMoveState() in [@PMS.PAUSED, @PMS.NONE, @PMS.DONE]
		# else if @options.playMoveState() is @PMS.PLAYING

	handlePlayMoveStateInterval: () ->
		if @options.playMoveState() is @PMS.PLAYING
			# console.log('playing')
			if @player.getCurrentTime() > @options.currentMovement.endTime
				# console.log("foo")
				if @options.currentMovement.attr('looping')
					@handleMovePlay()
				else
					@options.playMoveState(@PMS.NONE)
					@player.pauseVideo()



	# make some keycodes
	"{window} keypress": (el, ev) ->
		keyCode = ev.keyCode
		# console.log(keyCode)
		if keyCode is 13
			@handleMovePlay()

			return
		R = 114
		L = 108 
		# different in keypress and keydown...
		# if keyCode is L

		# if keyCode is 13


	# ======== Saved Move Control stuff ========= #

	# this is going to be a bit weird - 
	# i still need to figure out how the saving thing works
	# probably should be automatic

	# every time you click learn new movement it should create one for sure
	# chain 
	# assume things like chanin 


	"{setCurrentMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		movement = el.closest( @options.moveDataSelector ).data('movement')

		if @options.currentMovement isnt movement
			@loadNewCurrentmovement(movement)
			@options.playMoveState(@PMS.NONE)
			@options.newMoveState(@NMS.DONE)


	"{setPlayMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		movement = el.closest( @options.moveDataSelector ).data('movement')

		if @options.currentMovement isnt movement
			@loadNewCurrentmovement(movement)
			# console.log('foo')
			@options.newMoveState(@NMS.DONE)


		@handleMovePlay()

	"{setLoopMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		movement = el.closest( @options.moveDataSelector ).data('movement')
		if @options.currentMovement isnt movement
			@loadNewCurrentmovement(movement)
			@options.newMoveState(@NMS.DONE)

		movement.attr('looping', true)
		@handleMovePlay()


	"{deleteMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		movement = el.closest( @options.moveDataSelector ).data('movement')
		movements = @app.options.movements

		console.log("deleting movements")

		index = movements.indexOf(movement)
		movements.splice(index, 1)

		if @options.currentMovement is movement
			@options.newMoveState(@NMS.NONE)

})




module.exports = MVE_MovementControls















