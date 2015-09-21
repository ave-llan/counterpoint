var test = require('tape')
var MusicMachine = require('music-machine')
var cfGrammar = require('../../../lib/cantus-firmus/grammar/cf-grammar.js')
var noLeapBackFilter = require('../../../lib/cantus-firmus/grammar/no-leap-back-filter.js')

test('noLeapBackFilter', function (t) {
  var machine = new MusicMachine(cfGrammar, 'Start')
  var guide = machine.createGuide()
  guide.choose(['C4', 'E4'])
  t.deepEqual(guide.choices().sort(),
    [ 'F4', 'D4', 'C4', 'E3', 'G3', 'A3', 'B3' ].sort())
  guide.addFilter(noLeapBackFilter)
  t.deepEqual(guide.choices().sort(),
    [ 'F4', 'D4', 'E3', 'G3', 'A3', 'B3' ].sort())

  // fresh guide
  guide = machine.createGuide('G minor')
  guide.choose('G4 A4 C5'.split(' '))
  t.deepEqual(guide.choices().sort(),
    [ 'A4', 'Bb4', 'C4', 'D5', 'Eb4', 'F4', 'G4' ].sort())
  guide.addFilter(noLeapBackFilter)
  t.deepEqual(guide.choices().sort(),
    [ 'Bb4', 'C4', 'D5', 'Eb4', 'F4', 'G4' ].sort())

  t.end()
})
