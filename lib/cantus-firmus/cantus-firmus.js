var createCFguide = require('./create-cf-machine.js')

/**
 * @typedef {string} PitchString - a string consisting of a music Letter [A-G], optional accidental,
 *                                 and optional octave number
 * @example
 * 'C4'     // middle C on a piano, the fourth octave
 * 'Eb3'    // Eb in octave 3
 * 'F#'     // no octave number provided, a pitch class
 * 'F##'    // F double sharp
 * 'Dbb'    // D double flat
 */

/**
 * @typedef {string} KeyString - a string consisting of a {@link PitchString} and a mode name
 *                               seperated by whitespace
 * @example
 * 'Eb major'
 * 'C minor'
 * 'F# dorian'
 */

/**
 * create a CantusFirmus that provides next note choices
 *
 * @constructor
 * @param {KeyString} key - the key of this cf
 * @param {number} [maxRange=10] - the max range this machine will allow
 * @param {number} [maxLength=16] - the maxLength of this machine
 * @returns {MusicMachine} a new MusicMachine
 *
 * @see [MusicMachine]{@link https://github.com/jrleszcz/music-machine/blob/master/api.md#musicmachine}
 */
var CantusFirmus = function (key, maxRange, maxLength) {
  var guide = createCFguide(key, maxRange || 10, maxLength || 16)

  /**
   * the current cf
   * @returns {string[]} an array of pitch strings
   */
  this.cf = function () {
    return guide.construction()
  }

  this.nextNoteChoices = function () {
    return guide.choices()
  }

  this.addNote = function (pitch) {
    guide.choose(pitch)
  }
}

module.exports = CantusFirmus
