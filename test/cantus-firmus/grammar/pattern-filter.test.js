var test = require('tape')
var MusicMachine = require('music-machine')
var cfGrammar = require('../../../lib/cantus-firmus/grammar/cf-grammar.js')
var patternFilter = require('../../../lib/cantus-firmus/grammar/pattern-filter.js')

test('patternFilter', function (t) {
  var machine = new MusicMachine(cfGrammar, 'Start')
  var guide = machine.createGuide()
  guide.choose(['C4', 'D4', 'C4'])
  t.deepEqual(guide.choices().sort(),
    [ 'D4', 'E4', 'F4', 'G4', 'A4', 'C5', 'A3', 'B3', 'F3', 'G3' ].sort())
  guide.addFilter(patternFilter)
  t.deepEqual(guide.choices().sort(),
    [ 'E4', 'F4', 'G4', 'A4', 'C5', 'A3', 'B3', 'F3', 'G3' ].sort())

  // refresh guide to remove filter
  guide = machine.createGuide()
  guide.choose(['C4', 'D4', 'E4', 'C4', 'D4'])
  t.deepEqual(guide.choices().sort(),
    [ 'E4', 'F4', 'G4', 'A4', 'C4', 'B3', 'D3', 'F3', 'G3', 'A3' ].sort())
  guide.addFilter(patternFilter)
  t.deepEqual(guide.choices().sort(),
    [ 'F4', 'G4', 'A4', 'C4', 'B3', 'D3', 'F3', 'G3', 'A3' ].sort())
  t.end()
})
