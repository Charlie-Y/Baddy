mve = window.mve or {} 
window.mve = mve


# 
mve.Movement = can.Model.extend({
	devMovements: [
		{
			startTime: 10
			endTime: 13
			movementId: 0
			videoId: undefined
			name: "Move 1"
			playing: false
		},
		{
			startTime: 16
			endTime: 20
			movementId: 1
			videoId: undefined
			name: "Move 2"
			playing: false

		},
		{
			startTime: 0
			endTime: 10
			movementId: 2
			videoId: undefined
			name: "Move 3"
			playing: false

		}
	]
},{
	# in seconds
	startTime: false
	endTime: false
	movementId: false
	validated: false
	videoId: false
	name: false
	playing: false
	saved: false

	init: () ->

	isValid: () ->

		if Number.isNaN(parseInt(@startTime)) or Number.isNaN(parseInt(@endTime))
			# console.log("failed")
			@attr('validated', false)
			return false

		@attr('validated', true)
		return true
		# return @startTime? and @endTime? # and @movementId? and @name?

	setStart: (newTime, duration) ->
		initialStartTime = @startTime
		@attr('startTime', newTime)

		if @isValid()
			if newTime > @endTime
				difference = Math.abs(initialStartTime - @endTime)
				@attr('endTime', newTime + difference)

	setEnd: (newTime, duration) ->
		initialEndTime = @endTime
		@attr('endTime', newTime)

		# if @isValid()
		# 	if @startTime < @endTime
		# 		difference = initialEndTime - @startTime
		# 		@attr('startTime', @startTime + difference)

	fixTimes: () ->
		if @startTime > @endTime
			difference = @startTime - @endTime
			@attr('endTime', @startTime + difference)






})