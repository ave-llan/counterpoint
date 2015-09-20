var MusicMachine = require('music-machine')
var cfGrammar = require('./grammar/cf-grammar.js')

// filters to be applied to the machine
var filters = [
  // immediate repetition of 2-group or 3-group patterns  (C4 D4 C4 D4 || C4 D4 E4 C4 D4 E4)
  require('./grammar/pattern-filter.js'),

  // restrict interval quality to Major, minor, or Perfect
  MusicMachine.filter.allowedIntervalQualities('M', 'm', 'P')
]

/**
 * A [MusicMachine]{@link https://github.com/jrleszcz/music-machine/blob/master/api.md#MusicMachine}
 * configured to create guides that generate Cantus Firmi
 *
 * @type {MusicMachine}
 */
var cfMachine = new MusicMachine(cfGrammar, 'Start')

// apply all filters
filters.forEach(cfMachine.addFilter)

module.exports = cfMachine
