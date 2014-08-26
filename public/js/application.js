(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MVEPlayerApp, MVE_MovementControls, MVE_SliderControls, MVE_TimeControls, Movement, mve;

mve = require('./mve_base');

Movement = require('./mve_movement');

MVE_TimeControls = require('./mve_time_controls');

MVE_SliderControls = require('./mve_slider_controls');

MVE_MovementControls = require('./mve_movement_controls');

MVEPlayerApp = can.Control.extend({
  defaults: {
    template: mve.mustacheFor('mve_player'),
    iframeSelector: 'player',
    iframeWrapSelector: '.player-wrap',
    vidWidth: 1080,
    vidHeight: 558,
    videoId: "CGyEd0aKWZE",
    autoplay: 0,
    controls: 0,
    ytplayer: void 0
  }
}, {
  init: function(element, options) {
    var handleData, helpers, viewData, _this;
    if (window.MVE != null) {
      console.error("There should only be one MVEPlayerApp");
      console.error("i'm not building for two in the same page");
      return;
    }
    window.MVE = this;
    viewData = new can.Map();
    _this = this;
    this.duration = void 0;
    this.playerIntervalId = void 0;
    this.PLAYER_INTERVAL_TIME = 100;
    this.options.globalCurrentTime = can.compute(0);
    this.useHighestQuality = false;
    this.qualityLevels = new can.List();
    viewData.attr('qualityLevels', this.qualityLevels);
    this.youtubeAPILoaded = can.compute(false);
    this.options.playerState = can.compute(mve.PS.UNSTARTED);
    helpers = {
      "formattedTime": mve.timeInHoursMinsSeconds
    };
    viewData.attr('deadPixel', mve.DeadPixel);
    this.element.html(can.view(this.options.template, viewData, helpers));
    this.playerWrap = this.element.find('.player-wrap');
    handleData = {
      time: -1,
      left: -1,
      selected: false,
      show: false
    };
    this.options.startHandleData = new can.Map(handleData);
    this.options.endHandleData = new can.Map(handleData);
    viewData.attr('startHandleData', this.options.startHandleData);
    viewData.attr('endHandleData', this.options.endHandleData);
    this.options.handleMiddle = new can.Map({
      left: false,
      width: false,
      show: false
    });
    viewData.attr('handleMiddle', this.options.handleMiddle);
    this.movements = new Movement.List(Movement.devMovements);
    viewData.attr('movements', this.movements);
    this.timeControls = new MVE_TimeControls(this.element, {
      viewData: viewData,
      app: _this
    });
    this.sliderControls = new MVE_SliderControls(this.element, {
      viewData: viewData,
      app: _this
    });
    this.movementControls = new MVE_MovementControls(this.element, {
      viewData: viewData,
      app: _this
    });
    this.controls = [this.sliderControls, this.timeControls, this.movementControls];
    this.on();
    this.setupYoutubeApiReady();
    return this.insertYoutubeApiScript();
  },
  setupYoutubeApiReady: function() {
    var onPlayerReady, onPlayerStateChange, player, _this;
    player = {};
    this.player = player;
    _this = this;
    onPlayerReady = function(event) {
      return _this.onPlayerReady();
    };
    onPlayerStateChange = function(event) {
      return _this.changePlayerState(event.data);
    };
    return window.onYouTubeIframeAPIReady = function() {
      return _this.player = new YT.Player('player', {
        height: _this.options.vidHeight,
        width: _this.options.vidWidth,
        videoId: _this.options.videoId,
        playerVars: {
          controls: _this.options.controls,
          autoplay: _this.options.autoplay
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    };
  },
  insertYoutubeApiScript: function() {
    var firstScriptTag, tag;
    tag = document.createElement('script');
    tag.src = "js/youtube_api.js";
    firstScriptTag = document.getElementsByTagName('script')[0];
    return firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },
  onPlayerReady: function() {
    var control, _i, _len, _ref, _results, _this;
    this.player.playVideo();
    this.youtubeAPILoaded(true);
    window.player = this.player;
    this.duration = this.player.getDuration();
    this.player.mute();
    _this = this;
    this.playerIntervalId = setInterval(this.playerInterval, this.PLAYER_INTERVAL_TIME, _this);
    _ref = this.controls;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _results.push(control.onPlayerReady());
    }
    return _results;
  },
  setQualityRate: function() {
    var highestQuality, lowestQuality;
    if (!this.qualityLevels.attr('length')) {
      this.qualityLevels.replace(this.player.getAvailableQualityLevels());
      if (this.useHighestQuality) {
        highestQuality = this.qualityLevels[0];
        return this.player.setPlaybackQuality(highestQuality);
      } else {
        lowestQuality = this.qualityLevels.attr(this.qualityLevels.attr('length') - 2);
        return this.player.setPlaybackQuality(lowestQuality);
      }
    }
  },
  changePlayerState: function(newState) {
    return this.options.playerState(newState);
  },
  playerInterval: function(_this) {
    var control, _i, _len, _ref, _results;
    if (!_this.youtubeAPILoaded()) {
      return;
    }
    _this.options.globalCurrentTime(_this.player.getCurrentTime());
    _ref = _this.controls;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _results.push(control.onPlayerInterval());
    }
    return _results;
  },
  "{playerState} change": function(playerState, ev, newVal, oldVal) {
    var control, _i, _len, _ref, _results;
    this.setQualityRate();
    _ref = this.controls;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _results.push(control.onPlayerStateChange(newVal, oldVal));
    }
    return _results;
  },
  ".flip-icon click": function(el, ev) {
    return this.playerWrap.toggleClass('flipped');
  },
  loadNewPlayer: function() {
    return this.player.loadVideoById(this.options.videoId);
  },
  getAspectRatio: function() {
    return 16 / 9;
  },
  setupState: function(states) {
    var key, obj, _results;
    _results = [];
    for (key in states) {
      obj = states[key];
      states[key].name = key;
      if (!states[key].enter) {
        states[key].enter = function() {
          return jQuery.Deferred().resolve();
        };
      }
      if (!states[key].leave) {
        _results.push(states[key].leave = function() {
          return jQuery.Deferred().resolve();
        });
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  handleStateChange: function(_this, newState, oldState, superStateName) {
    console.log({
      superState: superStateName,
      newState: newState.name,
      oldState: oldState.name
    });
    return oldState.leave(_this).done(function() {
      return newState.enter(_this).done(function() {});
    });
  }
});

module.exports = MVEPlayerApp;

$(document).ready(function() {
  var mvePlayer;
  return mvePlayer = new MVEPlayerApp("#main-super-wrap");
});



},{"./mve_base":2,"./mve_movement":3,"./mve_movement_controls":4,"./mve_slider_controls":6,"./mve_time_controls":7}],2:[function(require,module,exports){

/*


Development guidelines



- use options.elements for elements
 */
var disableEvent, mve;

console.log("RRAAA");

mve = {};

window.mve = mve;

mve.mustachePath = 'mustache/';

mve.mustacheFor = function(fileNameNoExt) {
  return this.mustachePath + fileNameNoExt + '.mustache';
};

disableEvent = function(ev) {
  ev.preventDefault();
  return ev.stopPropagation();
};

mve.disableEvent = disableEvent;

mve.timeInMinsSeconds = function(timeInSeconds) {
  var mins, seconds;
  mins = Math.floor(timeInSeconds / 60);
  seconds = timeInSeconds % 60;
  seconds = Math.round(seconds * 100) / 100;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return mins + " : " + seconds;
};

mve.timeInHoursMinsSeconds = function(timeInSeconds) {
  var hours, mins, seconds;
  if (typeof timeInSeconds === "function") {
    timeInSeconds = timeInSeconds();
  }
  if (typeof timeInSeconds === "string") {
    return timeInSeconds;
  }
  hours = Math.floor(timeInSeconds / 60 / 60);
  mins = Math.floor(timeInSeconds / 60);
  seconds = timeInSeconds % 60;
  seconds = Math.round(seconds * 100) / 100;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (hours === 0) {
    return mins + " : " + seconds;
  } else {
    if (mins < 10) {
      mins = "0" + mins;
    }
    return hours + ":" + mins + " : " + seconds;
  }
};

mve.DeadPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

mve.PS = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  VIDEO_CUED: 5
};

module.exports = mve;



},{}],3:[function(require,module,exports){
var Movement;

Movement = can.Model.extend({
  devMovements: [
    {
      startTime: 10,
      endTime: 13,
      movementId: 0,
      videoId: void 0,
      name: "Move 1",
      playing: false
    }, {
      startTime: 16,
      endTime: 20,
      movementId: 1,
      videoId: void 0,
      name: "Move 2",
      playing: false
    }, {
      startTime: 0,
      endTime: 10,
      movementId: 2,
      videoId: void 0,
      name: "Move 3",
      playing: false
    }
  ]
}, {
  startTime: false,
  endTime: false,
  movementId: false,
  validated: false,
  videoId: false,
  name: false,
  playing: false,
  saved: false,
  init: function() {},
  isValid: function() {
    if (Number.isNaN(parseInt(this.startTime)) || Number.isNaN(parseInt(this.endTime))) {
      this.attr('validated', false);
      return false;
    }
    this.attr('validated', true);
    return true;
  },
  setStart: function(newTime, duration) {
    var difference, initialStartTime;
    initialStartTime = this.startTime;
    this.attr('startTime', newTime);
    if (this.isValid()) {
      if (newTime > this.endTime) {
        difference = Math.abs(initialStartTime - this.endTime);
        return this.attr('endTime', newTime + difference);
      }
    }
  },
  setEnd: function(newTime, duration) {
    var initialEndTime;
    initialEndTime = this.endTime;
    return this.attr('endTime', newTime);
  },
  fixTimes: function() {
    var difference;
    if (this.startTime > this.endTime) {
      difference = this.startTime - this.endTime;
      return this.attr('endTime', this.startTime + difference);
    }
  }
});

module.exports = Movement;



},{}],4:[function(require,module,exports){
var MVE_MovementControls, MVE_Plugin, Movement, mve;

mve = require('./mve_base');

MVE_Plugin = require('./mve_plugins');

Movement = require('./mve_movement');

MVE_MovementControls = MVE_Plugin.extend({
  defaults: {
    newMoveSelector: ".new-move",
    saveMoveSelector: ".new-move-save",
    cancelMoveSelector: ".new-move-cancel",
    chainMoveSelector: ".new-move-chain",
    setTimeSelector: ".set-time",
    cancelTimeSelector: ".cancel-time",
    playMoveSelector: '.play-move',
    loopMoveSelector: '.loop-move',
    moveDataSelector: '.movement-data',
    editStartSelector: ".edit-start",
    editEndSelector: ".edit-end"
  }
}, {
  init: function(element, options) {
    this._super();
    this.options.newMovementCover = this.element.find(".new-movement.cover");
    this.options.newMovementContent = this.element.find(".new-movement.content").hide();
    this.options.currentMovement = new Movement({
      startTime: "---",
      endTime: "---",
      name: "New Movement",
      saved: false,
      tempTime: -1,
      tempStart: false,
      tempEnd: false,
      looping: false
    });
    this.options.viewData.attr('currentMovement', this.options.currentMovement);
    this.startHandleData = this.app.options.startHandleData;
    this.endHandleData = this.app.options.endHandleData;
    this.handleMiddle = this.app.options.handleMiddle;
    this.options.startTimeEl = this.element.find(".start");
    this.options.endTimeEl = this.element.find(".end");
    this.options.editStartTimeButton = this.options.startTimeEl.find('.edit-time');
    this.options.editEndTimeButton = this.options.endTimeEl.find('.edit-time');
    this.options.startTimeButtons = this.options.startTimeEl.find('.time-button-wrap').hide();
    this.options.endTimeButtons = this.options.endTimeEl.find('.time-button-wrap').hide();
    this.options.showMovementPlayButtons = can.compute(false);
    this.options.viewData.attr('showMovementPlayButtons', this.options.showMovementPlayButtons);
    this.app.setupState(this.NMS);
    this.options.newMoveState = can.compute();
    this.options.newMoveState(this.NMS.NONE);
    this.app.setupState(this.PMS);
    this.options.playMoveState = can.compute();
    this.options.playMoveState(this.PMS.NONE);
    this.on();
    this.options.playMoveState(this.PMS.NONE);
    return this.options.newMoveState(this.NMS.DONE);
  },
  NMS: {
    NONE: {
      enter: function(_this) {
        return jQuery.when(_this.options.newMovementCover.show(), _this.options.newMovementContent.hide(), _this.updateHandleVisiblity());
      },
      leave: function(_this) {
        return jQuery.when(_this.options.newMovementCover.hide(), _this.options.newMovementContent.show(), _this.updateHandleVisiblity());
      }
    },
    START: {
      enter: function(_this) {
        _this.options.startTimeButtons.show();
        _this.options.editStartTimeButton.hide();
        _this.options.currentMovement.attr('tempStart', true);
        _this.options.startTimeEl.addClass('show-buttons');
        return jQuery.when();
      },
      leave: function(_this) {
        _this.options.editStartTimeButton.show();
        _this.options.startTimeButtons.hide();
        _this.options.currentMovement.attr('tempStart', false);
        _this.options.startTimeEl.removeClass('show-buttons');
        return jQuery.when();
      }
    },
    END: {
      enter: function(_this) {
        _this.options.endTimeButtons.show();
        _this.options.editEndTimeButton.hide();
        _this.options.currentMovement.attr('tempEnd', true);
        _this.options.endTimeEl.addClass('show-buttons');
        return jQuery.when();
      },
      leave: function(_this) {
        _this.options.editEndTimeButton.show();
        _this.options.endTimeButtons.hide();
        _this.options.currentMovement.attr('tempEnd', false);
        _this.options.endTimeEl.removeClass('show-buttons');
        return jQuery.when();
      }
    },
    DONE: {
      enter: function(_this) {
        return jQuery.when(_this.options.newMovementCover.hide(), _this.options.newMovementContent.show());
      }
    }
  },
  onPlayerReady: function() {
    this._super();
    return this.dev_setupPMS();
  },
  onPlayerInterval: function() {
    var _ref;
    if ((_ref = this.options.newMoveState()) === this.NMS.START || _ref === this.NMS.END) {
      this.options.currentMovement.attr('tempTime', this.player.getCurrentTime());
    }
    return this.handlePlayMoveStateInterval();
  },
  updateMovementPlayControls: function() {
    return this.options.showMovementPlayButtons(this.options.currentMovement.isValid());
  },
  updateHandles: function() {},
  "{currentMovement} change": function(currentMovement, obj, attr, ev, newVal, oldVal) {
    if (attr === 'startTime') {
      this.updateHandle(this.startHandleData, newVal);
    }
    if (attr === 'endTime') {
      return this.updateHandle(this.endHandleData, newVal);
    }
  },
  updateHandle: function(handle, time) {
    handle.attr('time', time);
    handle.attr('left', "" + (time / this.duration * 100) + "%");
    handle.attr('show', true);
    return this.updateHandleMiddle();
  },
  shouldShowHandle: function(handle) {
    var result;
    result = false;
    if (this.options.newMoveState() === this.NMS.NONE) {
      result = false;
      return result;
    }
    result = handle.time >= 0;
    return result;
  },
  updateHandleVisiblity: function() {
    this.startHandleData.attr('show', this.shouldShowHandle(this.startHandleData));
    this.endHandleData.attr('show', this.shouldShowHandle(this.endHandleData));
    return this.handleMiddle.attr('show', this.startHandleData.attr('show') && this.endHandleData.attr('show'));
  },
  updateHandleMiddle: function() {
    var endTime, smallerVal, startTime, timeDifference;
    startTime = this.options.currentMovement.startTime;
    endTime = this.options.currentMovement.endTime;
    if (!((startTime != null) && (endTime != null))) {
      return;
    }
    timeDifference = Math.abs(endTime - startTime);
    smallerVal = startTime < endTime ? startTime : endTime;
    this.handleMiddle.attr('left', "" + (smallerVal / this.duration * 100) + "%");
    this.handleMiddle.attr('width', "" + (timeDifference / this.duration * 100) + "%");
    return this.handleMiddle.attr('show', this.startHandleData.attr('show') && this.endHandleData.attr('show'));
  },
  "{newMoveState} change": function(newMoveState, ev, newState, oldState) {
    var _this;
    _this = this;
    if (newState !== this.NMS.DONE) {
      this.options.playMoveState(this.PMS.NONE);
    }
    return this.app.handleStateChange(_this, newState, oldState, 'newMoveState');
  },
  "{editStartSelector} click": function(el, ev) {
    mve.disableEvent(ev);
    return this.options.newMoveState(this.NMS.START);
  },
  "{editEndSelector} click": function(el, ev) {
    mve.disableEvent(ev);
    return this.options.newMoveState(this.NMS.END);
  },
  "{newMoveSelector} click": function(el, ev) {
    mve.disableEvent(ev);
    return this.options.newMoveState(this.NMS.DONE);
  },
  "{cancelMoveSelector} click": function(el, ev) {
    mve.disableEvent(ev);
    return this.options.newMoveState(this.NMS.NONE);
  },
  "{saveMoveSelector} click": function(el, ev) {
    return mve.disableEvent(ev);
  },
  "{chainMoveSelector} click": function(el, ev) {
    return mve.disableEvent(ev);
  },
  "{cancelTimeSelector} click": function(el, ev) {
    mve.disableEvent(ev);
    return this.options.newMoveState(this.NMS.DONE);
  },
  "{setTimeSelector} click": function(el, ev) {
    var endTime;
    mve.disableEvent(ev);
    if (this.options.newMoveState() === this.NMS.START) {
      this.options.currentMovement.setStart(this.player.getCurrentTime(), this.duration);
      this.updateMovementPlayControls();
      endTime = parseInt(this.options.currentMovement.attr('endTime'));
      if (Number.isNaN(endTime)) {
        this.options.newMoveState(this.NMS.END);
      } else {
        this.options.newMoveState(this.NMS.DONE);
      }
      return;
    }
    if (this.options.newMoveState() === this.NMS.END) {
      this.options.currentMovement.setEnd(this.player.getCurrentTime(), this.duration);
      this.updateMovementPlayControls();
      this.options.newMoveState(this.NMS.DONE);
    }
  },
  saveNewMovement: function() {},
  dev_setupPMS: function() {
    this.options.currentMovement.attr('startTime', 10);
    this.options.currentMovement.attr('endTime', 13);
    this.options.currentMovement.isValid();
    return this.options.newMoveState(this.NMS.DONE);
  },
  PMS: {
    NONE: {},
    DONE: {},
    PLAYING: {
      enter: function(_this) {
        _this.element.find('.play-move').addClass('selected');
        return jQuery.when();
      },
      leave: function(_this) {
        _this.element.find('.play-move').removeClass('selected');
        return jQuery.when();
      }
    },
    PAUSE_POINT: {}
  },
  "{playMoveState} change": function(playMoveState, ev, newState, oldState) {
    var _this;
    _this = this;
    if (newState !== this.PMS.NONE) {
      this.options.newMoveState(this.NMS.DONE);
    }
    return this.app.handleStateChange(_this, newState, oldState, 'playMoveState');
  },
  "{playMoveSelector} click": function(el, ev) {
    mve.disableEvent(ev);
    return this.handleMovePlay();
  },
  "{loopMoveSelector} click": function(el, ev) {
    var looping;
    mve.disableEvent(ev);
    looping = this.options.currentMovement.looping;
    return this.options.currentMovement.attr('looping', !looping);
  },
  handleMovePlay: function() {
    this.options.playMoveState(this.PMS.PLAYING);
    this.player.seekTo(this.options.currentMovement.startTime);
    return this.player.playVideo();
  },
  cancelMovePlay: function() {
    this.options.currentMovement.attr('looping', false);
    return this.options.playMoveState(this.PMS.NONE);
  },
  handlePlayMoveStateInterval: function() {
    if (this.options.playMoveState() === this.PMS.PLAYING) {
      if (this.player.getCurrentTime() > this.options.currentMovement.endTime) {
        if (this.options.currentMovement.attr('looping')) {
          return this.handleMovePlay();
        } else {
          this.options.playMoveState(this.PMS.NONE);
          return this.player.pauseVideo();
        }
      }
    }
  },
  "{window} keypress": function(el, ev) {
    var L, R, keyCode;
    keyCode = ev.keyCode;
    if (keyCode === 13) {
      this.handleMovePlay();
      return;
    }
    R = 114;
    return L = 108;
  },
  setPlayingMovement: function(movement) {},
  setHandlesToMovement: function(movement) {},
  setMoveToPlaying: function(movement) {}
});

module.exports = MVE_MovementControls;



},{"./mve_base":2,"./mve_movement":3,"./mve_plugins":5}],5:[function(require,module,exports){
var MVE_Plugin, mve;

mve = require('./mve_base');


/*

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
 */

MVE_Plugin = can.Control.extend({
  defaults: {
    listensToInterval: false,
    listensToPlayerState: false,
    listensToPlayerReady: false,
    template: mve.mustacheFor("nil")
  }
}, {
  init: function(el, ev) {
    this.app = this.options.app;
    if (this.options.viewData === void 0 || this.options.app === void 0) {
      return console.error("failed to pass in viewData and app");
    }
  },
  onPlayerReady: function() {
    this.player = this.options.app.player;
    this.duration = this.player.getDuration();
    this.options.playerState = this.options.app.options.playerState;
    this.options.youtubeAPILoaded = this.options.app.youtubeAPILoaded;
  },
  onPlayerInterval: function(el, ev) {},
  onPlayerStateChange: function(newState, oldState) {},
  sliderControls: function() {
    return this.options.app.sliderControls;
  },
  movementControls: function() {
    return this.options.app.movementControls;
  },
  timeControls: function() {
    return this.options.app.timeControls;
  }
});

module.exports = MVE_Plugin;


/*

MVE_TimeControls

Handles seeking, play/pause button, playback rates
 */

mve.SliderHandle = MVE_Plugin.extend({
  defaults: {}
}, {
  init: function(element, options) {}

  /*
  
  	Elements
  		needs a time displayed
  		needs a handle
  		might need a thumbnail?
  
  	Actions
  		responds to clicks
  		responds to mouse hold and drag
  
  		tells app about time
  		tells app about its events
   */
});

mve.StoryBoardCarousel = can.Control.extend({});

mve.storyboardAssetManager = "something that gets thumbnail assets";

mve.SAM = mve.storyboardAssetManager;



},{"./mve_base":2}],6:[function(require,module,exports){
var MVE_Plugin, MVE_SliderControls, mve;

mve = require('./mve_base');

MVE_Plugin = require('./mve_plugins');

MVE_SliderControls = MVE_Plugin.extend({
  defaults: {
    playerSliderSelector: ".slider-bar"
  }
}, {
  init: function(element, options) {
    var viewData;
    this._super();
    viewData = this.options.viewData;
    this.mouseenterSlider = false;
    this.sliderLabels = new can.List();
    viewData.attr('sliderLabels', this.sliderLabels);
    this.app.options.slider = this.element.find(this.options.playerSliderSelector);
    this.app.options.sliderProgressBar = this.element.find('.slider-progress');
    this.app.options.loadedBar = this.element.find('.slider-loaded');
    this.app.options.sliderMouser = this.element.find(".slider-mouser");
    this.app.options.sliderBubble = this.element.find(".slider-bubble");
    this.options.sliderBubbleData = new can.Map({
      show: false,
      left: false,
      time: false,
      src: void 0,
      backgroundSize: "400px 300px",
      backgroundPosition: "0 0",
      highQuality: true
    });
    viewData.attr('sliderBubbleData', this.options.sliderBubbleData);
    this.options.sighDataLoaded = can.compute(false);
    return this.options.sighData = new can.Map({
      sigh: false,
      base: false
    });
  },
  onPlayerReady: function() {
    this._super();
    return this.labelSliderBar();
  },
  onPlayerInterval: function() {
    var currentTime, loadedPercentage, percentage;
    this._super();
    currentTime = this.player.getCurrentTime();
    percentage = "" + (this.percentForTime(currentTime) * 100) + "%";
    this.app.options.sliderProgressBar.width(percentage);
    loadedPercentage = "" + (this.player.getVideoLoadedFraction() * 100) + "%";
    return this.app.options.loadedBar.width(loadedPercentage);
  },
  onPlayerStateChange: function(newState, oldState) {
    return this._super();
  },
  labelSliderBar: function() {},
  labelSliderBar: function() {
    var sliderBar, width;
    sliderBar = this.element.find('.slider-bar');
    return width = sliderBar.width();
  },
  "{playerSliderSelector} click": function(el, ev) {
    var clickWidth, percentage, sliderWidth, timeFromPercent;
    this.movementControls().cancelMovePlay();
    mve.disableEvent(ev);
    sliderWidth = this.app.options.slider.width();
    clickWidth = event.pageX - this.app.options.slider.offset().left;
    percentage = clickWidth / sliderWidth;
    timeFromPercent = this.duration * percentage;
    if (this.options.playerState() === mve.PS.UNSTARTED) {
      this.player.playVideo();
    }
    return this.player.seekTo(timeFromPercent);
  },
  "{playerSliderSelector} mouseenter": function(el, ev) {
    this.mouseenterSlider = true;
    this.app.options.sliderMouser.removeClass('hide');
    return this.options.sliderBubbleData.attr('show', true);
  },
  "{playerSliderSelector} mousemove": function(el, ev) {
    var mouseX, x;
    if (this.mouseenterSlider) {
      x = el.offset().left;
      mouseX = ev.clientX;
      this.app.options.sliderMouser.css('left', "" + (mouseX - x - this.app.options.sliderMouser.width() / 2) + "px");
      this.options.sliderBubbleData.attr('time', mve.timeInMinsSeconds(this.timeFromX(mouseX - x)));
      return this.options.sliderBubbleData.attr('left', "" + (mouseX - x - this.element.find('.slider-bubble').width() / 2) + "px");
    }
  },
  percentForTime: function(timeInSeconds) {
    return timeInSeconds / this.player.getDuration();
  },
  timeFromX: function(x) {
    var percentage, time, totalWidth;
    totalWidth = this.app.options.slider.width();
    percentage = x / totalWidth;
    time = this.duration * percentage;
    return time;
  },
  "{playerSliderSelector} mouseleave": function(el, ev) {
    this.mouseenterSlider = false;
    this.app.options.sliderMouser.addClass('hide');
    return this.options.sliderBubbleData.attr('show', false);
  },
  loadSighData: function() {
    var _this;
    _this = this;
    return $.get('/sigh/' + this.app.options.videoId, function(data) {
      if (data.statusCode === 200) {
        _this.options.sighData.attr('base', data.base);
        _this.options.sighData.attr('sigh', data.sigh);
        _this.options.sighDataLoaded(true);
        return console.log("sighDataLoaded");
      } else {
        return console.error("Can't get sigh with error: " + data.statusCode);
      }
    });
  },
  setSighImg: function(time) {
    var backgroundPosition, backgroundX, backgroundY, base, frameLength, frameNumber, sigh, sliderBubble, spriteCol, spriteIndex, spriteRow, src, storyboardMax, storyboardNumber, tileHeight, tileWidth;
    if (!this.options.sighDataLoaded()) {
      console.error("Sigh data not loaded");
    }
    base = this.options.sighData.attr('base');
    sigh = this.options.sighData.attr('sigh');
    storyboardNumber = 1;

    /*
    
    		here's how I think it works
    
    
    		if there are less then 250 seconds in a movie, then each frame
    		is given 2 seconds and the frame number is Math.floor(time/2)
    		frameLength = 2
    		frameNumber = Math.floor( time / frameLength)
    
    		if there are more than 250 seconds in a movie, then each 
    		frameLength = duration / 125 frames 
    		frameNumber = Math.floor( time / frameLength )
    
    		Then if the movies even longer I have no damn clue...
     */
    frameNumber = -1;
    frameLength = -1;
    if (this.duration <= 250) {
      frameLength = 2;
    } else if (this.duration < 1200) {
      frameLength = this.duration / 125;
    }
    frameNumber = Math.floor((time + 1) / frameLength);
    if (frameNumber <= 0) {
      frameNumber = 1;
    }
    spriteIndex = frameNumber % 25;
    spriteRow = Math.floor(spriteIndex / 5);
    spriteCol = spriteIndex % 5;
    sliderBubble = this.element.find(".slider-bubble .bubble-img");
    tileWidth = sliderBubble.width();
    tileHeight = sliderBubble.height();
    backgroundX = "" + (-tileWidth * spriteCol) + "px";
    backgroundY = "" + (-tileHeight * spriteRow) + "px";
    backgroundPosition = "" + backgroundX + " " + backgroundY;
    this.options.sliderBubbleData.attr('backgroundSize', "" + (tileWidth * 5) + "px " + (tileHeight * 5) + "px");
    this.options.sliderBubbleData.attr('backgroundPosition', backgroundPosition);
    storyboardMax = this.duration < 60 * 20 ? 5 : time / (60 * 4);
    storyboardNumber = Math.floor(frameNumber / 25);
    console.log({
      storyboardNumber: storyboardNumber,
      frameNumber: spriteIndex
    });
    src = "" + base + storyboardNumber + ".jpg?sigh=" + sigh;
    return this.options.sliderBubbleData.attr('src', src);
  },
  getSighPosition: function(time) {}
});

module.exports = MVE_SliderControls;



},{"./mve_base":2,"./mve_plugins":5}],7:[function(require,module,exports){
var MVE_Plugin, MVE_TimeControls, mve;

mve = require('./mve_base');

MVE_Plugin = require('./mve_plugins');

MVE_TimeControls = MVE_Plugin.extend({
  defaults: {}
}, {
  init: function(element, options) {
    var baseTime, viewData;
    this._super();
    console.log('MVE_TimeControls');
    viewData = this.options.viewData;
    this.SMALL_SEEK = .05;
    this.LARGE_SEEK = .10;
    baseTime = "00:00:00";
    this.zeroTimeObs = can.compute(baseTime);
    this.currentTimeObs = can.compute(baseTime);
    this.totalTimeObs = can.compute(baseTime);
    viewData.attr('zeroTimeObs', this.zeroTimeObs);
    viewData.attr('currentTimeObs', this.currentTimeObs);
    viewData.attr('totalTimeObs', this.totalTimeObs);
    this.playbackRates = new can.List();
    viewData.attr('playbackRates', this.playbackRates);
    return this.currentPlaybackRate = 1;
  },
  onPlayerReady: function() {
    var allPlaybackRates, playbackRate, _i, _len, _results;
    this._super();
    this.totalTimeObs(mve.timeInHoursMinsSeconds(this.duration));
    this.zeroTimeObs(mve.timeInHoursMinsSeconds(0));
    allPlaybackRates = this.player.getAvailablePlaybackRates();
    _results = [];
    for (_i = 0, _len = allPlaybackRates.length; _i < _len; _i++) {
      playbackRate = allPlaybackRates[_i];
      if (playbackRate <= 1) {
        _results.push(this.playbackRates.push(new can.Map({
          rate: playbackRate,
          active: playbackRate === 1
        })));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  onPlayerInterval: function() {
    return this.updateTimeDisplay();
  },
  onPlayerStateChange: function(newState, oldState) {
    var playIcon;
    playIcon = this.element.find('.play-icon');
    if (newState === mve.PS.PLAYING) {
      playIcon.removeClass('fa-play');
      return playIcon.addClass('fa-pause');
    } else {
      playIcon.removeClass('fa-pause');
      return playIcon.addClass('fa-play');
    }
  },
  updateTimeDisplay: function() {
    var currentTime;
    currentTime = this.player.getCurrentTime();
    return this.currentTimeObs(mve.timeInHoursMinsSeconds(currentTime));
  },
  ".playback-rate click": function(el, ev) {
    var rate;
    rate = el.data('rate');
    this.playbackRates.forEach(function(el) {
      return el.attr('active', el.rate === rate.rate);
    });
    return this.player.setPlaybackRate(rate.attr('rate'));
  },
  ".seek-icon click": function(el, ev) {
    var className, mappedVal, newTime, seekMap, seekVal, _i, _len, _ref;
    seekMap = {
      "fa-angle-double-left": -this.LARGE_SEEK,
      "fa-angle-left": -this.SMALL_SEEK,
      "fa-angle-right": this.SMALL_SEEK,
      "fa-angle-double-right": this.LARGE_SEEK
    };
    seekVal = void 0;
    _ref = el.get(0).classList;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      className = _ref[_i];
      mappedVal = seekMap[className];
      if (mappedVal !== void 0) {
        seekVal = mappedVal;
      }
    }
    if (seekVal === void 0) {
      console.error("Doom");
    }
    this.player.pauseVideo();
    newTime = this.player.getCurrentTime() + seekVal;
    return this.player.seekTo(newTime);
  },
  ".play-icon click": function(el, ev) {
    var _ref, _ref1;
    if ((_ref = this.options.playerState()) === mve.PS.PAUSED || _ref === mve.PS.ENDED || _ref === mve.PS.UNSTARTED) {
      this.player.playVideo();
      console.log("playVideo");
    } else if ((_ref1 = this.options.playerState()) === mve.PS.PLAYING) {
      this.player.pauseVideo();
      console.log("pauseVideo");
    }
    return mve.disableEvent(ev);
  },
  "{window} keydown": function(el, ev) {
    var LEFT, RIGHT, SPACE, keyCode;
    keyCode = ev.keyCode;
    LEFT = 37;
    RIGHT = 39;
    SPACE = 32;
    if (keyCode === SPACE) {
      this.togglePlayPause();
      return mve.disableEvent(ev);
    } else if (keyCode === LEFT) {
      this.player.pauseVideo();
      this.player.seekTo(this.player.getCurrentTime() - this.SMALL_SEEK);
      return mve.disableEvent(ev);
    } else if (keyCode === RIGHT) {
      this.player.pauseVideo();
      this.player.seekTo(this.player.getCurrentTime() + this.SMALL_SEEK);
      return mve.disableEvent(ev);
    }
  },
  togglePlayPause: function() {
    if (this.options.playerState() === mve.PS.PLAYING) {
      return this.player.pauseVideo();
    } else {
      return this.player.playVideo();
    }
  }
});

module.exports = MVE_TimeControls;



},{"./mve_base":2,"./mve_plugins":5}]},{},[1])