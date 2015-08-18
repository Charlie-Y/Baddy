(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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

},{}]},{},[1]);
