var MusicMachine = require('music-machine')
var cfGrammar = require('./grammar/cf-grammar.js')

// filters
var patternFilter = require('./grammar/pattern-filter.js')
var maxRangeFilter = MusicMachine.filter.maxRange
var maxLengthFilter = MusicMachine.filter.maxLength
var allowedIntervalQualities = MusicMachine.filter.allowedIntervalQualities

/**
 * create a new MusicMachine configured to generate Cantus Firmus guides
 * @param {number} [maxRange=10] - the max range this machine will allow
 * @param {number} [maxLength=16] - the maxLength of this machine
 * @returns {MusicMachine} a new MusicMachine
 *
 * @see [MusicMachine]{@link https://github.com/jrleszcz/music-machine/blob/master/api.md#musicmachine}
 */
var createCFmachine = function (maxRange, maxLength) {
  var cfMachine = new MusicMachine(cfGrammar, 'Start')

  var filters = [
    maxRangeFilter(maxRange || 10),             // restrict range
    maxLengthFilter(maxLength || 16),           // restrict length
    allowedIntervalQualities('M', 'm', 'P'),    // restrict interval quality
    patternFilter                               // avoids patterns like C4 D4 C4 D4
  ]
  filters.forEach(cfMachine.addFilter)

  return cfMachine
}

module.exports = createCFmachine
