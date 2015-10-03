var createCFguide = require('./create-cf-guide.js')
var Pitch = require('nmusic').Pitch
var intervalSize = require('nmusic').intervalSize
var sortPitches = require('../utils/sort-pitches.js')

var MIN_CF_LENGTH = 8     // minimum length of a cantus firmus
var MAX_CF_LENGTH = 16    // maximum length of a cantus firmus

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
 * create a CantusFirmus that follows the rules of species counterpoint
 *
 * @constructor
 *
 * @param {KeyString} [key='C major'] - the key of this cf
 * @param {number} [maxRange=10] - the max range this machine will allow
 * @param {number} [maxLength=16] - the maxLength of this machine
 */
var CantusFirmus = function (key, maxRange, maxLength) {
  key = key || 'C major'        // key of the cf
  maxRange = maxRange || 10     // max range of cf
  maxLength = maxLength || 16   // max length of cf

  var guide = createCFguide(key, maxRange, maxLength)

  /**
   * get the current cantus firmus
   * @returns {PitchString[]} an array of pitch strings
   */
  this.cf = function () {
    return guide.construction()
  }

  /**
   * adds the given pitch to the cantus firmus
   * @param {PitchString} pitch - a pitch string in the current set of {@link CantusFirmus#nextNoteChoices}
   * @throws throws an error if given pitch is not in the
   *      current set of {@link CantusFirmus#nextNoteChoices}
   */
  this.addNote = function (pitch) {
    guide.choose(pitch)
  }

  /**
   * pop the last note choice off the cantus firmus
   * @throws throws an error if called when cantus firmus is empty
   * @returns {PitchString} the last pitch string of the cantus firmus
   * submitted through {@link CantusFirmus#addNote}
   */
  this.pop = function () {
    return guide.pop()
  }

  /**
   * @typedef {object} TreeNode
   * @property {PitchString} val - a pitch string
   * @property {TreeNode[]} next - a list of TreeNodes this node links to
   */

  /**
   * returns an array of all possible next pitches, or an array of
   * nDeep [TreeNodes]{@link TreeNode}.
   *
   * @param {number} [nDeep=1] - will search for nDeep possible choices
   * @returns {PitchString[]|TreeNode[]} if nDeep=1, an array of pitch strings, else
   * an array of nDeep {@link TreeNodes}
   */
  this.choices = function (nDeep) {
    return guide.choices(nDeep || 1)
  }

  /**
   * is the current cantus firmus a complete and valid cantus firmus?
   * @returns {boolean} is the current cantus firmus a complete and valid cantus firmus?
   */
  this.isValid = function () {
    var cf = this.cf()

    // is it long enough
    if (cf.length < MIN_CF_LENGTH || cf.length > MAX_CF_LENGTH) {
      return false
    }

    // is last note tonic?
    if (Pitch(cf[cf.length - 1]).pitchClass() !== guide.tonic()) {
      return false
    } else if (Pitch(cf[0]).pitchClass() === guide.tonic()) {
      // if first note is tonic, last note should end in the same octave
      // if first note is not tonic, this is probably a first species counterpoint
      if (cf[0] !== cf[cf.length - 1]) {
        return false
      }
    }

    // is the penultimate note scale degree 2 or possible 7?
    if (intervalSize(cf[cf.length - 2], cf[cf.length - 1]) !== 2) {
      return false
    }

    // is there a unique climax (highest note is not repeated)?
    var sorted = sortPitches(cf)
    if (sorted[sorted.length - 1] === sorted[sorted.length - 2]) {
      return false
    }

    return true
  }
}

module.exports = CantusFirmus
