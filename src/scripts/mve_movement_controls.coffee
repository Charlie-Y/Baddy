# Everything related to newmove, savemove, edit move stuff is all here
# That means managing slider objects and time objects as well

# ALL the logic goes here. even if an element is defined elsewhere, put it back hers


mve.MVE_MovementControls = mve.MVE_Plugin.extend({
	defaults: {

		# Selectors related to making new moves
		newMoveSelector: ".new-move"
		saveMoveSelector: ".new-move-save"
		cancelMoveSelector: ".new-move-cancel"
		chainMoveSelector: ".new-move-chain"
		setTimeSelector: ".set-time"
		cancelTimeSelector: ".cancel-time"

		# Selectors related to playing moves
		playMoveSelector: '.play-move'
		loopMoveSelector: '.loop-move'
		moveDataSelector: '.movement-data'

		editStartSelector: ".edit-start"
		editEndSelector: ".edit-end"

	}
},{
	init: (element, options) ->
		@_super();
		@options.newMovementCover = @element.find(".new-movement.cover")
		@options.newMovementContent = @element.find(".new-movement.content").hide()
		# @options.newMovement.hide().removeClass('hide')

		# -- Current move stuff --- #
		@options.currentMovement = new mve.Movement({
			startTime: "---"
			endTime: "---"
			name: "New Movement"
			saved: false

			# to show or not to show considered 
			tempTime: -1
			tempStart: false
			tempEnd: false

			})
		@options.viewData.attr('currentMovement', @options.currentMovement)




		# --- DIsplay elements --- # 
		@startHandleData = @app.options.startHandleData
		@endHandleData = @app.options.endHandleData
		@handleMiddle = @app.options.handleMiddle
		# @options.newMoveState = @app.options.newMoveState

		# --- html elements --- #
		@options.startTimeEl = @element.find(".start")
		@options.endTimeEl = @element.find(".end")

		@options.editStartTimeButton = @options.startTimeEl.find('.edit-time')
		@options.editEndTimeButton = @options.endTimeEl.find('.edit-time')
		@options.startTimeButtons = @options.startTimeEl.find('.time-button-wrap').hide()
		@options.endTimeButtons = @options.endTimeEl.find('.time-button-wrap').hide()

		# @options.nameBlock = @element.find('.name-left')
		@options.showMovementPlayButtons = can.compute(false)
		@options.viewData.attr('showMovementPlayButtons', @options.showMovementPlayButtons)



		# ---- State machine stuff ---- #
		@app.setupState(@NMS)
		@options.newMoveState = can.compute()
		@options.newMoveState(@NMS.NONE)

		# @options.newMoveState = @app.options.newMoveState
		# @options.playMoveState = @app.options.playMoveState

		@app.setupState(@PMS)
		@options.playMoveState = can.compute()
		@options.playMoveState(@PMS.NONE)

		@on();

		#  call @on first so that the control can react to this binding
		@options.playMoveState(@PMS.NONE)
		@options.newMoveState(@NMS.DONE)





	# New Move State
	NMS: {
		NONE: {
			enter: (_this) ->
				return jQuery.when(
					_this.options.newMovementCover.show(),
					_this.options.newMovementContent.hide()
					_this.updateHandleVisiblity()

					)
			leave: (_this) ->
				return jQuery.when(
					_this.options.newMovementCover.hide(),
					_this.options.newMovementContent.show()
					_this.updateHandleVisiblity()

					)
		}
		START:{
			enter: (_this) ->
				_this.options.startTimeButtons.show()
				_this.options.editStartTimeButton.hide()

				_this.options.currentMovement.attr('tempStart', true)
				_this.options.startTimeEl.addClass('show-buttons')
				return jQuery.when()
			leave: (_this) ->
				_this.options.editStartTimeButton.show()
				_this.options.startTimeButtons.hide()
				_this.options.currentMovement.attr('tempStart', false)
				_this.options.startTimeEl.removeClass('show-buttons')
				# _this.updateHandleVisiblity()

				return jQuery.when()
		}
		END: {
			enter: (_this) ->
				_this.options.endTimeButtons.show()
				_this.options.editEndTimeButton.hide()

				_this.options.currentMovement.attr('tempEnd', true)

				_this.options.endTimeEl.addClass('show-buttons')
				return jQuery.when()
			leave: (_this) ->
				_this.options.editEndTimeButton.show()
				_this.options.endTimeButtons.hide()
				_this.options.currentMovement.attr('tempEnd', false)
				_this.options.endTimeEl.removeClass('show-buttons')
				# _this.updateHandleVisiblity()

				return jQuery.when()
		}
		DONE: {
			enter: (_this) ->
				return jQuery.when(
					_this.options.newMovementCover.hide(),
					_this.options.newMovementContent.show()
					)
		}
	}


	onPlayerReady:() ->
		@_super()
		# @showNewMovementControls()
		@dev_setupPMS()


	# states probably shouldn't change in these
	onPlayerInterval: () ->
		if @options.newMoveState() in [@NMS.START, @NMS.END]
			@options.currentMovement.attr('tempTime',  @player.getCurrentTime())

		@handlePlayMoveStateInterval()


	updateMovementPlayControls: () ->
		@options.showMovementPlayButtons( @options.currentMovement.isValid() )

	updateHandles: () ->
		# @updateHandle(@startHandleData, @newMoveStart())
		# @updateHandle(@endHandleData, @newMoveEnd())

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
		@updateHandleMiddle()


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

	updateHandleMiddle: () ->
		startTime = @options.currentMovement.startTime
		endTime = @options.currentMovement.endTime
		if !(startTime? and endTime?)
			return 

		timeDifference = Math.abs(endTime - startTime)
		smallerVal = if startTime < endTime then startTime else endTime

		@handleMiddle.attr('left', "#{smallerVal / @duration * 100}%")
		@handleMiddle.attr('width', "#{timeDifference / @duration * 100}%")
		@handleMiddle.attr('show', @startHandleData.attr('show') and @endHandleData.attr('show'))





	# ======== New move creation stuff ======= #



	"{newMoveState} change": (newMoveState, ev, newState, oldState) ->
		_this = @
		
		if newState isnt @NMS.NONE
			@options.playMoveState(@PMS.NONE)

		@app.handleStateChange(_this, newState, oldState)




		# if newState is @app.NMS.START
		# 	@startHandleData.attr('show', true)
		# 	@startHandleData.attr('selected', true)

		# 	@endHandleData.attr('show', true)
		# 	@endHandleData.attr('selected', false)
		# 	@handleMiddle.attr('show', true)

		# 	@updateHandles()


		# if newState is @app.NMS.END
		# 	# @endHandleData.attr('show', true)
		# 	@endHandleData.attr('selected', true)
		# 	@startHandleData.attr('selected', false)
		# 	@handleMiddle.attr('show', true)
			
		# 	@updateHandles()


		# if newState is @app.NMS.NONE
		# 	@startHandleData.attr('show', false)
		# 	@endHandleData.attr('show', false)
		# 	@startHandleData.attr('selected', false)
		# 	@endHandleData.attr('selected', false)
		# 	@handleMiddle.attr('show', false)

	"{editStartSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		@options.newMoveState(@NMS.START)

	"{editEndSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		@options.newMoveState(@NMS.END)

	"{newMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		@options.newMoveState(@NMS.DONE)
		# @options.newMoveState(@NMS.START)

		# if not @creatingMovement
		# 	@showNewMovementControls()

	"{cancelMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		@options.newMoveState(@NMS.NONE)

		# if @creatingMovement
		# 	@hideNewMovementControls()

	"{saveMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		# @saveNewMovement()
		# @options.newMoveState(@app.NMS.DONE)

		# @hideNewMovementControls()

	"{chainMoveSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		# @saveNewMovement()
		# @newMoveStart( @newMoveEnd())
		# @newMoveStartDisplay( mve.timeInHoursMinsSeconds(@newMoveEnd()))
		# @updateHandle(@startHandleData, @newMoveStart())

		# @options.newMoveState(@app.NMS.END)


	"{cancelTimeSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		@options.newMoveState(@NMS.DONE)



	"{setTimeSelector} click": (el, ev) ->
		mve.disableEvent(ev)
		if @options.newMoveState() is @NMS.START


			# @options.currentMovement.attr('startTime', @player.getCurrentTime())
			@options.currentMovement.setStart(@player.getCurrentTime(), @duration)

			# @updateHandle(@startHandleData, @player.getCurrentTime())
			@updateMovementPlayControls()



			endTime = parseInt(@options.currentMovement.attr('endTime'))
			# console.log(endTime)
			if Number.isNaN(endTime)
				@options.newMoveState(@NMS.END)
			else 
				@options.newMoveState(@NMS.DONE)

			return 


		if @options.newMoveState() is @NMS.END

			@options.currentMovement.setEnd(@player.getCurrentTime(), @duration)

			@updateMovementPlayControls()
			@options.newMoveState(@NMS.DONE)

			return 

	saveNewMovement: () ->
		# this should be loading the attrs into anew model and pushing that
		# unless this model is already saved

		# movementId = @app.movements.attr('length') + 1
		# newMovement = new mve.Movement({
		# 	startTime: @newMoveStart()
		# 	endTime: @newMoveEnd()
		# 	name: "Move #{movementId}"
		# 	movementId: movementId
		# 	})
		# @app.movements.unshift(newMovement)





	# ======== Move Playing stuff ========= #

	dev_setupPMS: () ->
		# return 
		@options.currentMovement.attr('startTime', 10)
		@options.currentMovement.attr('endTime', 13)
		@options.currentMovement.isValid()
		@options.newMoveState(@NMS.DONE)


	PMS: {
		# instead of 2 states for every play_state for play_once and play_loop
		# I'll just keep this looping var here
		# looping: false

		NONE:{
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
			@options.newMoveState(@PMS.DONE)


		@app.handleStateChange(_this, newState, oldState)

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

	handleMovePlay: () ->
		@options.playMoveState(@PMS.PLAYING)
		@player.seekTo(@options.currentMovement.startTime)
		@player.playVideo()

	cancelMovePlay: () ->
		@options.currentMovement.attr('looping', false)
		

		@options.playMoveState(@PMS.NONE)


		# if @options.playMoveState() in [@PMS.PAUSED, @PMS.NONE, @PMS.DONE]
		# else if @options.playMoveState() is @PMS.PLAYING

	handlePlayMoveStateInterval: () ->
		if @options.playMoveState() is @PMS.PLAYING
			if @player.getCurrentTime() > @options.currentMovement.endTime
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



	setPlayingMovement: (movement) ->
		# @setHandlesToMovement(movement)
		# @player.seekTo(movement.startTime)
		# @setMoveToPlaying(movement)
		# @currentMovement = movement
		# @player.playVideo()

	setHandlesToMovement: (movement) ->
		# @newMoveStart(movement.startTime)
		# @newMoveEnd(movement.endTime)

		# @startHandleData.attr('show', true)
		# @endHandleData.attr('show', true)
		# @handleMiddle.attr('show', true)

		# @updateHandles()
		# @updateHandleMiddle()

	setMoveToPlaying: (movement) ->
		# for otherMovement in @app.movements
		# 	otherMovement.attr('playing', false)
		# movement.attr('playing', true)


})




















