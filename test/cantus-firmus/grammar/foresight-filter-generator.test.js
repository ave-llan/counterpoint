var test = require('tape')
var MusicMachine = require('music-machine')
var cfGrammar = require('../../../lib/cantus-firmus/grammar/cf-grammar.js')
var foresightFilter = require('../../../lib/cantus-firmus/grammar/foresight-filter-generator.js')

test('foresightFilterGenerator', function (t) {
  var machine = new MusicMachine(cfGrammar, 'Start')

  // guide to test outline length limit
  var guide = machine.createGuide('C major')
  guide.choose('C4'.split(' '))

  t.deepEqual(guide.choices().sort(),
    [ 'A3', 'A4', 'B3', 'C3', 'C5', 'D4', 'E3', 'E4', 'F3', 'F4', 'G3', 'G4' ].sort())

  guide.addFilter(MusicMachine.filter.maxRange(6))
  t.deepEqual(guide.choices().sort(),
    [ 'A3', 'A4', 'B3', 'D4', 'E3', 'E4', 'F3', 'F4', 'G3', 'G4' ].sort())

  guide.addFilter(foresightFilter(6))

  // should have no E3 because this will preclude having a climax
  t.deepEqual(guide.choices().sort(),
    [ 'A3', 'A4', 'B3', 'D4', 'E4', 'F3', 'F4', 'G3', 'G4' ].sort())

  t.end()
})
