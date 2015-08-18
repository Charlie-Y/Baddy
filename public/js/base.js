(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var baddy, disableEvent;

baddy = {};

baddy.mustachePath = 'mustache/';

baddy.mustacheFor = function(fileNameNoExt) {
  return this.mustachePath + fileNameNoExt + '.mustache';
};

disableEvent = function(ev) {
  ev.preventDefault();
  return ev.stopPropagation();
};

baddy.disableEvent = disableEvent;

baddy.timeInMinsSeconds = function(timeInSeconds) {
  var mins, seconds;
  mins = Math.floor(timeInSeconds / 60);
  seconds = timeInSeconds % 60;
  seconds = Math.round(seconds * 100) / 100;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return mins + " : " + seconds;
};

baddy.timeInHoursMinsSeconds = function(timeInSeconds) {
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

baddy.min = function(array) {
  return Math.min.apply(Math, array);
};

baddy.max = function(array) {
  return Math.max.apply(Math, array);
};

baddy.DeadPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

module.exports = baddy;

},{}]},{},[1]);
