mve = require('./mve_base')

MVE_THUMBNAIL = {
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

}

module.exports = MVE_THUMBNAIL