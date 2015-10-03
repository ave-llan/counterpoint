var cfMachine = require('./cf-machine.js')
var MusicMachine = require('music-machine')
var maxRangeFilter = MusicMachine.filter.maxRange
var maxLengthFilter = MusicMachine.filter.maxLength
var foresightFilter = require('./grammar/foresight-filter-generator.js')

/**
 * create a new GuidedMusicMachine configured with a Cantus Firmus grammar
 * @param {KeyString} [key='C major'] - the key of this guide's construction
 * @param {number} [maxRange=10] - the max range of this guide's construction
 * @param {number} [maxLength=16] - the maxLength of this guide's construction
 * @returns {GuidedMusicMachine} a new GuidedMusicMachine configured to create a cantus firmus
 *
 * @see [GuidedMusicMachine]{@link https://github.com/jrleszcz/music-machine/blob/master/api.md#GuidedMusicMachine}
 */
var createCFguide = function (key, maxRange, maxLength) {
  var guide = cfMachine.createGuide(key || 'C major')

  // define and add configurable filters
  var filters = [
    maxRangeFilter(maxRange || 10),             // restrict range
    maxLengthFilter(maxLength || 16),           // restrict length
    foresightFilter(maxRange || 10)             // restrict notes that would preclude a climax
  ]
  filters.forEach(guide.addFilter)

  return guide
}

module.exports = createCFguide
