mve = window.mve or {} 
window.mve = mve

###

The problem with this approach is that it is a problem because the controls want
access to the individual elements.

Maybe just set the element to this one? YEAH. I CAN DO THAT

Just set _this.element to be the same element on all of them. that probably makes things easier
but this makes the mustache templating a bit weird?

So don't think of the controls as things that need mustache templates.
Think of them as functionaliy that moves around

Pass viewData into everything so they can pass data into the stuff

MVE_PlayerApp

- handling some of the video things
- all the things I don't want to put elsewhere
- quality
- delegates the stuff all the controls and plugins

MVE_SliderControls

- Everything related to sliders, mouse events over sliders
- buttons related to slider controls etc

MVE_TimeControls

- Everhthing related to those few ubtons that control easing
- Navigating through time

MVE_MovementControls =

- everythign related to displaying and responding to 
- 

MVE_MovementStorageControls = 

- everything related to taking the models and putting it onto the people


###

# disableEvent = mve.disableEvent

mve.MVE_Plugin = can.Control.extend({
	defaults: {
		listensToInterval: false
		listensToPlayerState: false
		listensToPlayerReady: false
		template: mve.mustacheFor("nil")
		}
}, {
	init: (el, ev) ->
		@app = @options.app
		
		if @options.viewData is undefined or @options.app is undefined
			console.error("failed to pass in viewData and app")

	onPlayerReady: () ->
		@player = @options.app.player


		@duration = @player.getDuration()
		@options.playerState = @options.app.options.playerState
		@options.youtubeAPILoaded = @options.app.youtubeAPILoaded


		return

	onPlayerInterval: (el, ev) ->
		return

	onPlayerStateChange: (newState, oldState) ->
		return

	#  Uhhh...
	sliderControls: () ->
		@options.app.sliderControls

	movementControls: () ->
		@options.app.movementControls

	timeControls: () ->
		@options.app.timeControls


})






###

MVE_TimeControls

Handles seeking, play/pause button, playback rates


###








# There should only be 2 of these
mve.SliderHandle = mve.MVE_Plugin.extend({
	defaults: {
		}
}, {
	init: (element, options) ->

	
	###

	Elements
		needs a time displayed
		needs a handle
		might need a thumbnail?

	Actions
		responds to clicks
		responds to mouse hold and drag

		tells app about time
		tells app about its events

	###


})



mve.StoryBoardCarousel = can.Control.extend({
	# loads all the necessary storyboard images
	# and then makes them high light on mouseover
})

mve.storyboardAssetManager = "something that gets thumbnail assets"
mve.SAM = mve.storyboardAssetManager




