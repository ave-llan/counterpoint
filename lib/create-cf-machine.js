var MusicMachine = require('music-machine')
var cfGrammar = require('./grammar/cf-grammar.js')

/**
 * create a new MusicMachine configured to generate Cantus Firmus guides
 * @param {number} [maxRange=10] - the max range this machine will allow
 * @param {number} [maxLength=16] - the maxLength of this machine
 * @returns {MusicMachine} a new MusicMachine
 *
 * @see [MusicMachine]{@link https://github.com/jrleszcz/music-machine/blob/master/api.md#musicmachine}
 */
var createCFmachine = function (maxRange, maxLength) {
  maxRange = maxRange || 10
  maxLength = maxLength || 16

  var cfMachine = new MusicMachine(cfGrammar, 'Start')

  // restrict range to a 10th
  cfMachine.addFilter(MusicMachine.filter.maxRange(maxRange))

  // restrict length to 16 notes
  cfMachine.addFilter(MusicMachine.filter.maxLength(maxLength))

  // only allow Major, minor, and Perfect intervals
  cfMachine.addFilter(MusicMachine.filter.allowedIntervalQualities('M', 'm', 'P'))

  return cfMachine
}

module.exports = createCFmachine
