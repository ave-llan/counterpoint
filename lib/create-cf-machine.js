var MusicMachine = require('music-machine')
var cfGrammar = require('./grammar/cf-grammar.js')

/**
 * create a new MusicMachine configured to generate Cantus Firmus guides
 * @returns {MusicMachine} a new MusicMachine
 *
 * @see [MusicMachine]{@link https://github.com/jrleszcz/music-machine/blob/master/api.md#musicmachine}
 */
var createCFmachine = function () {
  var cfMachine = new MusicMachine(cfGrammar, 'Start')

  // restrict range to a 10th
  cfMachine.addFilter(MusicMachine.filter.maxRange(10))

  // restrict length to 16 notes
  cfMachine.addFilter(MusicMachine.filter.maxLength(10))

  // only allow Major, minor, and Perfect intervals
  cfMachine.addFilter(MusicMachine.filter.allowedIntervalQualities('M', 'm', 'P'))

  return cfMachine
}

module.exports = createCFmachine
