(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
@namespace Event Utilities

totally taken from AOS store code....
All credit goes to them...
 */
var ev, metaKeyCodes;

metaKeyCodes = void 0;


/**
@lends jQuery.AsEvent
 */

ev = {

  /**
  Keyboard Key Codes
  @namespace
  @name jQuery.AsEvent.Keyboard
   */
  Keyboard: {

    /**
    @type {Number}
     */
    Backspace: 8,

    /**
    @type {Number}
     */
    Tab: 9,

    /**
    @type {Number}
     */
    Clear: 12,

    /**
    @type {Number}
     */
    Return: 13,

    /**
    @type {Number}
     */
    Shift: 16,

    /**
    @type {Number}
     */
    Ctrl: 17,

    /**
    @type {Number}
     */
    Alt: 18,

    /**
    @type {Number}
     */
    Esc: 27,

    /**
    @type {Number}
     */
    ArrowLeft: 37,

    /**
    @type {Number}
     */
    ArrowUp: 38,

    /**
    @type {Number}
     */
    ArrowRight: 39,

    /**
    @type {Number}
     */
    ArrowDown: 40,

    /**
    @type {Number}
     */
    Delete: 46,

    /**
    @type {Number}
     */
    Home: 36,

    /**
    @type {Number}
     */
    End: 35,

    /**
    @type {Number}
     */
    PageUp: 33,

    /**
    @type {Number}
     */
    PageDown: 34,

    /**
    @type {Number}
     */
    Insert: 45,

    /**
    @type {Number}
     */
    CapsLock: 20,

    /**
    @type {Number}
     */
    LeftCommand: 91,

    /**
    @type {Number}
     */
    RightCommand: 93,

    /**
    @type {Number}
     */
    MozillaCommand: 224,

    /**
    @type {Number}
     */
    RightWindowsStart: 92,

    /**
    @type {Number}
     */
    Pause: 19,

    /**
    @type {Number}
     */
    Space: 32,

    /**
    @type {Number}
     */
    Help: 47,

    /**
    @type {Number}
     */
    LeftWindow: 91,

    /**
    @type {Number}
     */
    Select: 93,

    /**
    @type {Number}
     */
    NumPad0: 96,

    /**
    @type {Number}
     */
    NumPad1: 97,

    /**
    @type {Number}
     */
    NumPad2: 98,

    /**
    @type {Number}
     */
    NumPad3: 99,

    /**
    @type {Number}
     */
    NumPad4: 100,

    /**
    @type {Number}
     */
    NumPad5: 101,

    /**
    @type {Number}
     */
    NumPad6: 102,

    /**
    @type {Number}
     */
    NumPad7: 103,

    /**
    @type {Number}
     */
    NumPad8: 104,

    /**
    @type {Number}
     */
    NumPad9: 105,

    /**
    @type {Number}
     */
    NumPadMultiply: 106,

    /**
    @type {Number}
     */
    NumPadPlus: 107,

    /**
    @type {Number}
     */
    NumPadEnter: 108,

    /**
    @type {Number}
     */
    NumPadMinus: 109,

    /**
    @type {Number}
     */
    NumPadPeriod: 110,

    /**
    @type {Number}
     */
    NumPadDivide: 111,

    /**
    @type {Number}
     */
    F1: 112,

    /**
    @type {Number}
     */
    F2: 113,

    /**
    @type {Number}
     */
    F3: 114,

    /**
    @type {Number}
     */
    F4: 115,

    /**
    @type {Number}
     */
    F5: 116,

    /**
    @type {Number}
     */
    F6: 117,

    /**
    @type {Number}
     */
    F7: 118,

    /**
    @type {Number}
     */
    F8: 119,

    /**
    @type {Number}
     */
    F9: 120,

    /**
    @type {Number}
     */
    F10: 121,

    /**
    @type {Number}
     */
    F11: 122,

    /**
    @type {Number}
     */
    F12: 123,

    /**
    @type {Number}
     */
    F13: 124,

    /**
    @type {Number}
     */
    F14: 125,

    /**
    @type {Number}
     */
    F15: 126,

    /**
    @type {Number}
     */
    NumLock: 144,

    /**
    @type {Number}
     */
    ScrollLock: 145
  },

  /**
  Mouse Button Numbers
  @namespace
  @name jQuery.AsEvent.Mouse
   */
  Mouse: {

    /**
    @type {Number}
     */
    Left: 1,

    /**
    @type {Number}
     */
    Right: 3
  },

  /**
  Describes whether an event is the result of a meta key keypress
  @param  {Event}  event
  @return {boolean}
   */
  isMetaKey: function(event) {
    var isMeta;
    isMeta = false;
    switch (event.keyCode) {
      case ev.Keyboard.Tab:
      case ev.Keyboard.Clear:
      case ev.Keyboard.Return:
      case ev.Keyboard.Shift:
      case ev.Keyboard.Ctrl:
      case ev.Keyboard.Alt:
      case ev.Keyboard.Esc:
      case ev.Keyboard.Left:
      case ev.Keyboard.Up:
      case ev.Keyboard.Right:
      case ev.Keyboard.Down:
      case ev.Keyboard.Home:
      case ev.Keyboard.End:
      case ev.Keyboard.PageUp:
      case ev.Keyboard.PageDown:
      case ev.Keyboard.Insert:
      case ev.Keyboard.CapsLock:
      case ev.Keyboard.LeftCommand:
      case ev.Keyboard.RightCommand:
      case ev.Keyboard.MozillaCommand:
      case ev.Keyboard.RightWindowsStart:
        isMeta = true;
        break;
    }
    return isMeta;
  },

  /**
  For Keyboard events in a field its often necessary to wait for the user to be fininshed. This is the standard value for waiting
  @type {Number}
   */
  StandardDeferredInputTimeout: 333,
  isNumpadNumKey: function(evt) {
    return 96 <= evt.keyCode && evt.keyCode <= 111;
  },
  isAlphaNumKey: function(evt) {
    return ev.isNumpadNumKey(evt) || (!(evt.keyCode in metaKeyCodes()));
  }
};

metaKeyCodes = function() {
  var hash, k;
  if (!metaKeyCodes.parsed) {
    hash = {};
    k = void 0;
    for (k in ev.Keyboard) {
      if (ev.Keyboard.hasOwnProperty(k)) {
        hash[ev.Keyboard[k]] = k;
      }
    }
    (metaKeyCodes = function() {
      return hash;
    }).parsed = true;
    return hash;
  }
};

module.exports = ev;



},{}],2:[function(require,module,exports){

/*

Thigns to implement before a grevious redesign and refactoring

Zooming with Labeling
Chaining
Remote Controlling
PausePoints
 */
var MVEPlayerApp, MVE_MovementControls, MVE_SliderControls, MVE_Storage, MVE_TimeControls, Movement, mve;

mve = require('./mve_base');

Movement = require('./mve_movement');

MVE_TimeControls = require('./mve_time_controls');

MVE_SliderControls = require('./mve_slider_controls');

MVE_MovementControls = require('./mve_movement_controls');

MVE_Storage = require('./mve_storage');

MVEPlayerApp = can.Control.extend({
  defaults: {
    template: mve.mustacheFor('mve_player'),
    iframeSelector: 'player',
    iframeWrapSelector: '.player-wrap',
    storageSetting: 'LOCAL',
    vidWidth: 1080,
    vidHeight: 558,
    videoId: "CGyEd0aKWZE",
    autoplay: 0,
    controls: 0,
    ytplayer: void 0
  }
}, {
  init: function(element, options) {
    var helpers, viewData, _this;
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
    this.options.startHandleData = new can.Map(mve.handleData);
    this.options.endHandleData = new can.Map(mve.handleData);
    viewData.attr('startHandleData', this.options.startHandleData);
    viewData.attr('endHandleData', this.options.endHandleData);
    this.options.handleMiddle = new can.Map(mve.handleMiddleData);
    viewData.attr('handleMiddle', this.options.handleMiddle);
    this.options.sliderButtons = new can.Map({
      show: false,
      showNewMove: true,
      showZoomIn: true,
      showZoomOut: false,
      left: false
    });
    viewData.attr('sliderButtons', this.options.sliderButtons);
    this.options.movements = this.loadMovements();
    viewData.attr('movements', this.options.movements);
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
    var onPlayerReady, onPlayerStateChange, pathname, player, _this;
    player = {};
    this.player = player;
    _this = this;
    pathname = window.location.pathname;
    if (pathname !== '/') {
      this.options.videoId = pathname.slice(1);
    }
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
  },
  loadMovements: function() {
    switch (this.options.storageSetting) {
      case 'LOCAL':
        return new Movement.List(MVE_Storage.getMovementsRaw(this.options.videoId));
      case 'SERVER':
        return new Movement.findAll('some parameter TODO');
      case 'DEV':
        return new Movement.List(Movement.devMovements);
    }
  },
  "{movements} change": function(movements, ev, index, event, changedMovements) {
    switch (this.options.storageSetting) {
      case 'LOCAL':
        return MVE_Storage.saveMovements(this.options.videoId, movements.attr());
    }
  }
});

module.exports = MVEPlayerApp;

$(document).ready(function() {
  var mvePlayer;
  return mvePlayer = new MVEPlayerApp("#main-super-wrap");
});



},{"./mve_base":3,"./mve_movement":4,"./mve_movement_controls":5,"./mve_slider_controls":7,"./mve_storage":8,"./mve_time_controls":9}],3:[function(require,module,exports){
var disableEvent, mve;

mve = {};

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

mve.handleData = {
  time: -1,
  left: -1,
  selected: false,
  show: false
};

mve.handleMiddleData = {
  left: false,
  width: false,
  show: false
};

module.exports = mve;



},{}],4:[function(require,module,exports){
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
  name: false,
  current: false,
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



},{}],5:[function(require,module,exports){
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
    seekableSelector: "[data-seekable]",
    setCurrentMoveSelector: '.set-move',
    setPlayMoveSelector: '.set-play-move',
    setLoopMoveSelector: '.set-loop-move',
    deleteMoveSelector: '.delete-move',
    editStartSelector: ".edit-start",
    editEndSelector: ".edit-end",
    playerSliderSelector: "."
  }
}, {
  init: function(element, options) {
    this._super();
    this.options.newMovementCover = this.element.find(".new-movement.cover");
    this.options.newMovementContent = this.element.find(".new-movement.content").hide();
    this.loadNewMovement(false);
    this.startHandleData = this.app.options.startHandleData;
    this.endHandleData = this.app.options.endHandleData;
    this.handleMiddle = this.app.options.handleMiddle;
    this.loadHTMLElems();
    this.options.showMovementPlayButtons = can.compute(false);
    this.options.viewData.attr('showMovementPlayButtons', this.options.showMovementPlayButtons);
    this.app.setupState(this.NMS);
    this.app.options.newMoveState = can.compute();
    this.options.newMoveState = this.app.options.newMoveState;
    this.options.newMoveState(this.NMS.NONE);
    this.app.setupState(this.PMS);
    this.app.options.playMoveState = can.compute();
    this.options.playMoveState = this.app.options.playMoveState;
    this.options.playMoveState(this.PMS.NONE);
    this.on();
    return this.options.playMoveState(this.PMS.NONE);
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
        _this.options.startTimeButtons.hide();
        _this.options.endTimeButtons.hide();
        return jQuery.when(_this.options.newMovementCover.hide(), _this.options.newMovementContent.show(), _this.updateHandleVisiblity());
      }
    }
  },
  loadHTMLElems: function() {
    this.options.startTimeEl = this.element.find(".start");
    this.options.endTimeEl = this.element.find(".end");
    this.options.editStartTimeButton = this.options.startTimeEl.find('.edit-time');
    this.options.editEndTimeButton = this.options.endTimeEl.find('.edit-time');
    this.options.startTimeButtons = this.options.startTimeEl.find('.time-button-wrap').hide();
    return this.options.endTimeButtons = this.options.endTimeEl.find('.time-button-wrap').hide();
  },
  onPlayerReady: function() {
    return this._super();
  },
  onPlayerInterval: function() {
    var _ref;
    if ((_ref = this.options.newMoveState()) === this.NMS.START || _ref === this.NMS.END) {
      this.options.currentMovement.attr('tempTime', this.player.getCurrentTime());
    }
    return this.handlePlayMoveStateInterval();
  },
  loadCurrentMovement: function(movement) {
    var cm;
    if (this.options.currentMovement != null) {
      this.options.currentMovement.attr('current', false);
    }
    this.options.currentMovement = movement;
    cm = this.options.currentMovement;
    cm.attr('tempStart', false);
    cm.attr('tempTime', -1);
    cm.attr('tempEnd', false);
    cm.attr('current', true);
    this.options.viewData.attr('currentMovement', cm);
    this.checkMoveComplete();
    this.on();
    this.loadHTMLElems();
    return this.updateHandles();
  },
  loadNewMovement: function(rebind) {
    if (rebind == null) {
      rebind = true;
    }
    if (this.options.currentMovement != null) {
      this.options.currentMovement.attr('current', false);
    }
    this.options.currentMovement = new Movement({
      startTime: "---",
      endTime: "---",
      name: "New Movement",
      saved: false,
      tempTime: -1,
      tempStart: false,
      tempEnd: false,
      looping: false,
      current: true
    });
    this.options.viewData.attr('currentMovement', this.options.currentMovement);
    if (rebind) {
      this.loadHTMLElems();
      this.updateHandles();
      return this.on();
    }
  },
  loadCreatedMovement: function(startTime, endTime) {
    var cm;
    this.loadNewMovement();
    cm = this.options.currentMovement;
    if (startTime < endTime) {
      cm.attr('startTime', startTime);
      cm.attr('endTime', endTime);
    } else {
      cm.attr('startTime', endTime);
      cm.attr('endTime', startTime);
    }
    this.checkMoveComplete();
    return this.options.newMoveState(this.NMS.DONE);
  },
  checkMoveComplete: function() {
    var cm;
    cm = this.options.currentMovement;
    this.options.showMovementPlayButtons(cm.isValid());
    if (cm.validated) {
      return this.saveMovement();
    }
  },
  updateHandles: function() {
    var cm;
    cm = this.options.currentMovement;
    this.updateHandle(this.startHandleData, cm.startTime);
    return this.updateHandle(this.endHandleData, cm.endTime);
  },
  "{currentMovement} change": function(currentMovement, obj, attr, ev, newVal, oldVal) {
    if (attr === 'startTime') {
      this.updateHandle(this.startHandleData, newVal);
    }
    if (attr === 'endTime') {
      return this.updateHandle(this.endHandleData, newVal);
    }
  },
  updateHandle: function(handle, time) {
    var endTime, startTime;
    handle.attr('time', time);
    handle.attr('left', "" + (time / this.duration * 100) + "%");
    handle.attr('show', true);
    startTime = this.options.currentMovement.startTime;
    endTime = this.options.currentMovement.endTime;
    return this.sliderControls().updateHandleMiddle(this.handleMiddle, startTime, endTime, this.startHandleData, this.endHandleData);
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
    this.loadNewMovement();
    return this.options.newMoveState(this.NMS.DONE);
  },
  "{cancelMoveSelector} click": function(el, ev) {
    mve.disableEvent(ev);
    this.options.newMoveState(this.NMS.NONE);
    this.options.currentMovement.attr('current', false);
    return this.options.currentMovement = void 0;
  },
  "{saveMoveSelector} click": function(el, ev) {
    mve.disableEvent(ev);
    return this.saveMovement();
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
      this.checkMoveComplete();
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
      this.checkMoveComplete();
      this.options.newMoveState(this.NMS.DONE);
    }
  },
  saveMovement: function() {
    var cm, movementId;
    cm = this.options.currentMovement;
    if (this.app.options.movements.indexOf(cm) > -1) {

    } else {
      movementId = this.app.options.movements.attr('length') + 1;
      cm.attr('movementId', movementId);
      return this.app.options.movements.unshift(cm);
    }
  },
  dev_setupPMS: function() {
    var cm;
    cm = this.options.currentMovement;
    cm.attr('startTime', 10);
    cm.attr('endTime', 13);
    this.checkMoveComplete();
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
  "{seekableSelector} click": function(el, ev) {
    var time;
    mve.disableEvent(ev);
    time = el.data('seekable');
    return this.player.seekTo(time);
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
  "{setCurrentMoveSelector} click": function(el, ev) {
    var movement;
    mve.disableEvent(ev);
    movement = el.closest(this.options.moveDataSelector).data('movement');
    if (this.options.currentMovement !== movement) {
      this.loadCurrentMovement(movement);
      this.options.playMoveState(this.PMS.NONE);
      return this.options.newMoveState(this.NMS.DONE);
    }
  },
  "{setPlayMoveSelector} click": function(el, ev) {
    var movement;
    mve.disableEvent(ev);
    movement = el.closest(this.options.moveDataSelector).data('movement');
    if (this.options.currentMovement !== movement) {
      this.loadCurrentMovement(movement);
      this.options.newMoveState(this.NMS.DONE);
    }
    return this.handleMovePlay();
  },
  "{setLoopMoveSelector} click": function(el, ev) {
    var movement;
    mve.disableEvent(ev);
    movement = el.closest(this.options.moveDataSelector).data('movement');
    if (this.options.currentMovement !== movement) {
      this.loadCurrentMovement(movement);
      this.options.newMoveState(this.NMS.DONE);
    }
    movement.attr('looping', true);
    return this.handleMovePlay();
  },
  "{deleteMoveSelector} click": function(el, ev) {
    var index, movement, movements;
    mve.disableEvent(ev);
    movement = el.closest(this.options.moveDataSelector).data('movement');
    movements = this.app.options.movements;
    console.log("deleting movements");
    index = movements.indexOf(movement);
    movements.splice(index, 1);
    if (this.options.currentMovement === movement) {
      return this.options.newMoveState(this.NMS.NONE);
    }
  }
});

module.exports = MVE_MovementControls;



},{"./mve_base":3,"./mve_movement":4,"./mve_plugins":6}],6:[function(require,module,exports){
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



},{"./mve_base":3}],7:[function(require,module,exports){
var MVE_Plugin, MVE_SliderControls, mve;

mve = require('./mve_base');

MVE_Plugin = require('./mve_plugins');

MVE_SliderControls = MVE_Plugin.extend({
  defaults: {
    playerSliderSelector: ".slider-bar",
    dragNewMoveSelector: ".drag-new-move",
    zoomInSelector: ".zoom-in",
    zoomOutSelector: ".zoom-out"
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
    this.options.sighData = new can.Map({
      sigh: false,
      base: false
    });
    this.options.dragStartHandle = new can.Map(mve.handleData);
    this.options.dragEndHandle = new can.Map(mve.handleData);
    this.options.dragMiddle = new can.Map(mve.handleMiddleData);
    viewData.attr('dragStartHandle', this.options.dragStartHandle);
    viewData.attr('dragEndHandle', this.options.dragEndHandle);
    viewData.attr('dragMiddle', this.options.dragMiddle);
    this.app.setupState(this.DMS);
    this.app.options.dragMoveState = can.compute();
    this.options.dragMoveState = this.app.options.dragMoveState;
    this.options.dragMoveState(this.DMS.NONE);
    this.options.sliderButtons = this.app.options.sliderButtons;
    return this.on();
  },
  onPlayerReady: function() {
    this._super();
    return this.labelSliderBar(0, this.duration);
  },
  onPlayerInterval: function() {
    var currentTime, loadedPercentage, percentage;
    this._super();
    currentTime = this.player.getCurrentTime();
    percentage = "" + (this.percentForTime(currentTime) * 100) + "%";
    this.app.options.sliderProgressBar.width(percentage);
    loadedPercentage = "" + (this.player.getVideoLoadedFraction() * 100) + "%";
    this.app.options.loadedBar.width(loadedPercentage);
    return this.handleDragPlayerInterval();
  },
  onPlayerStateChange: function(newState, oldState) {
    return this._super();
  },
  "{playerSliderSelector} mouseenter": function(el, ev) {
    this.mouseenterSlider = true;
    this.app.options.sliderMouser.removeClass('hide');
    return this.options.sliderBubbleData.attr('show', true);
  },
  "{playerSliderSelector} mousemove": function(el, ev) {
    var mouseX, x;
    if (this.handleMouseMove(el, ev)) {
      return;
    }
    if (this.mouseenterSlider) {
      x = el.offset().left;
      mouseX = ev.clientX;
      this.app.options.sliderMouser.css('left', "" + (mouseX - x - this.app.options.sliderMouser.width() / 2) + "px");
      this.options.sliderBubbleData.attr('time', this.timeFromX(mouseX - x));
      return this.options.sliderBubbleData.attr('left', "" + (mouseX - x - this.element.find('.slider-bubble').width() / 2) + "px");
    }
  },
  timeFromSliderMouse: function(el, ev) {
    return this.timeFromX(this.xFromSliderMouse(el, ev));
  },
  xFromSliderMouse: function(el, ev) {
    var mouseX, x;
    x = el.offset().left;
    mouseX = ev.clientX;
    return mouseX - x;
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
    this.mousedown = false;
    this.handleDragMouseUp();
    this.app.options.sliderMouser.addClass('hide');
    return this.options.sliderBubbleData.attr('show', false);
  },

  /*
  
  	drag and slide across the slider bar creates a zone with two defined handles
  	fades out the slider handle stuff for the current move
  
  	once the handles are finished - it will display 2 icons - 
  	zoom in, zoom out, and a create Move button, Plus
  	
  	clikcing plus creates a move with those start and end times
  
  
  	pops out two buttons in the slider-bottom spacer
  	zoom/zoom in
   */
  DMS: {
    NONE: {
      enter: function(_this) {
        _this.options.dragStartHandle.attr('show', false);
        _this.options.dragEndHandle.attr('show', false);
        _this.options.dragMiddle.attr('show', false);
        _this.options.sliderButtons.attr('showNewMove', false);
        return jQuery.when();
      }
    },
    DOWN: {},
    MOVED: {},
    UP: {},
    DONE: {}
  },
  ZS: {},
  "{dragMoveState} change": function(newMoveState, ev, newState, oldState) {
    var _this;
    _this = this;
    return this.app.handleStateChange(_this, newState, oldState, 'dragMoveState');
  },
  "{playerSliderSelector} click": function(el, ev) {
    var clickWidth, percentage, sliderWidth, timeFromPercent;
    mve.disableEvent(ev);
    if (this.options.dragMoveState() === this.DMS.MOVED) {
      return;
    }
    this.movementControls().cancelMovePlay();
    sliderWidth = this.app.options.slider.width();
    clickWidth = event.pageX - this.app.options.slider.offset().left;
    percentage = clickWidth / sliderWidth;
    timeFromPercent = this.duration * percentage;
    if (this.options.playerState() === mve.PS.UNSTARTED) {
      this.player.playVideo();
    }
    return this.player.seekTo(timeFromPercent);
  },
  "{playerSliderSelector} mousedown": function(el, ev) {
    mve.disableEvent(ev);
    this.options.dragMoveState(this.DMS.DOWN);
    this.mousedownClientX = this.xFromSliderMouse(el, ev);
    this.options.dragStartHandle.attr('left', "" + this.mousedownClientX + "px");
    this.options.dragStartHandle.attr('time', this.timeFromSliderMouse(el, ev));
    this.options.dragEndHandle.attr('show', false);
    this.options.dragEndHandle.attr('time', -1);
    this.options.dragMiddle.attr('show', false);
    return this.options.dragMiddle.attr('left', "" + this.mousedownClientX + "px");
  },
  handleDragPlayerInterval: function() {},
  handleMouseMove: function(el, ev) {
    var _ref;
    if ((_ref = this.options.dragMoveState()) === this.DMS.DOWN || _ref === this.DMS.MOVED) {
      this.options.dragMoveState(this.DMS.MOVED);
      this.options.dragStartHandle.attr('show', true);
      this.options.dragEndHandle.attr('show', true);
      this.options.dragEndHandle.attr('left', "" + (this.xFromSliderMouse(el, ev)) + "px");
      this.options.dragEndHandle.attr('time', this.timeFromSliderMouse(el, ev));
      this.player.pauseVideo();
      return this.updateHandleMiddle(this.options.dragMiddle, this.options.dragStartHandle.time, this.options.dragEndHandle.time, this.options.dragStartHandle, this.options.dragEndHandle);
    }
  },
  "{playerSliderSelector} mouseup": function(el, ev) {
    mve.disableEvent(ev);
    return this.handleDragMouseUp();
  },
  handleDragMouseUp: function() {
    if (this.options.dragMoveState() === this.DMS.MOVED) {
      this.showDragMoveButtons(this.options.dragStartHandle.time + this.options.dragEndHandle.time);
    } else if (this.options.dragMoveState() === this.DMS.DOWN) {
      this.options.dragStartHandle.attr('show', false);
      this.options.dragMiddle.attr('show', false);
      this.options.sliderButtons.attr('show', false);
    }
    return this.options.dragMoveState(this.DMS.DONE);
  },
  showDragMoveButtons: function(startTime, endTime) {
    var middleVal, newLeft, o;
    o = this.options;
    middleVal = (startTime + endTime) / 2;
    newLeft = this.percentForTime(middleVal);
    o.sliderButtons.attr('show', true);
    o.sliderButtons.attr('showNewMove', true);
    return o.sliderButtons.attr('left', "" + (newLeft * 100 - 3) + "%");
  },
  updateHandleMiddle: function(handleMiddle, startTime, endTime, startHandle, endHandle) {
    var smallerVal, timeDifference;
    if (!((startTime != null) && (endTime != null))) {
      return;
    }
    timeDifference = Math.abs(endTime - startTime);
    smallerVal = startTime < endTime ? startTime : endTime;
    handleMiddle.attr('left', "" + (smallerVal / this.duration * 100) + "%");
    handleMiddle.attr('width', "" + (timeDifference / this.duration * 100) + "%");
    return handleMiddle.attr('show', startHandle.attr('show') && endHandle.attr('show'));
  },
  "{dragNewMoveSelector} click": function(el, ev) {
    var endTime, o, startTime;
    mve.disableEvent(ev);
    o = this.options;
    startTime = o.dragStartHandle.attr('time');
    endTime = o.dragEndHandle.attr('time');
    this.movementControls().loadCreatedMovement(startTime, endTime);
    return this.options.dragMoveState(this.DMS.NONE);
  },
  "{zoomOutSelector} click": function(el, ev) {
    return mve.disableEvent(ev);
  },
  "{zoomInSelector} click": function(el, ev) {
    mve.disableEvent(ev);
    return console.log("zoomInSelector click");
  },

  /*
  
  	labelOptions: {
  		showMins: true
  		minInterval: 1 
  		
  		showSeconds: true
  		secondsInterval: 30
  
  		showHours: false
  		hoursInterval: 1 
  		}
  
  	 * globalLabelOptions
  	GLO: {
  		majorLabelsVisible: 5
  	}
  
  	 * lets not worry about the minor labels for now
  
  
  	 *  Intervals will be 10, 5, 1, 30s, 5s, 1s
  
  	from 6 * this interval -- 6 * next interval, show this interval's count
  
  	60  - 30 mins 	show 10m
  	30  - 6 mins 	show 5m
  	6   - 3 mins 	show 1m
  	3   - 30s 		show 30s
  	30s - 6s 		show 5s
  	6s  - 3s 		show 1s
  	3s  - .5s 		show .5s
   */
  labelOptionsForTime: function(minTime, maxTime) {
    var HOUR, MINUTE, duration, result;
    result = {};
    duration = maxTime - minTime;
    HOUR = 60 * 60;
    MINUTE = 60;
    if (duration < HOUR) {
      return result.showMins = true;
    }
  },
  labelSliderBar: function(minTime, maxTime) {
    var minutes, num, sliderBar, width, _i, _results;
    console.log({
      minTime: minTime,
      maxTime: maxTime
    });
    sliderBar = this.element.find('.slider-bar');
    width = sliderBar.width();
    minutes = Math.floor(this.duration / 60);
    _results = [];
    for (num = _i = 1; 1 <= minutes ? _i <= minutes : _i >= minutes; num = 1 <= minutes ? ++_i : --_i) {
      _results.push(this.sliderLabels.push({
        left: "" + (num * 60 / this.duration * 100) + "%",
        type: 'full',
        timeLabel: "" + num + "m"
      }));
    }
    return _results;
  }
});

module.exports = MVE_SliderControls;



},{"./mve_base":3,"./mve_plugins":6}],8:[function(require,module,exports){
var MVE_Storage, ls, mve;

mve = require('./mve_base');

ls = window.localStorage;

MVE_Storage = {
  getMovementsRaw: function(videoId) {
    var result;
    result = JSON.parse(ls.getItem(videoId));
    return result;
  },
  saveMovements: function(videoId, movements) {
    return ls.setItem(videoId, JSON.stringify(movements.map(this.filtered)));
  },
  filtered: function(m) {
    return {
      startTime: m.startTime,
      endTime: m.endTime,
      movementId: m.movementId,
      name: m.name
    };
  }
};

module.exports = MVE_Storage;



},{"./mve_base":3}],9:[function(require,module,exports){
var MVE_Plugin, MVE_TimeControls, evt, mve;

mve = require('./mve_base');

evt = require('./evt');

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
    allPlaybackRates = this.player.getAvailablePlaybackRates().reverse();
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
    var keyCode;
    keyCode = ev.keyCode;
    if (keyCode === evt.Keyboard.Space) {
      this.togglePlayPause();
      return mve.disableEvent(ev);
    } else if (keyCode === evt.Keyboard.ArrowLeft) {
      this.player.pauseVideo();
      this.player.seekTo(this.player.getCurrentTime() - this.SMALL_SEEK);
      return mve.disableEvent(ev);
    } else if (keyCode === evt.Keyboard.ArrowRight) {
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



},{"./evt":1,"./mve_base":3,"./mve_plugins":6}]},{},[2])