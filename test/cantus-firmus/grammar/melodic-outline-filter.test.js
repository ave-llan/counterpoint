var test = require('tape')
var MusicMachine = require('music-machine')
var cfGrammar = require('../../../lib/cantus-firmus/grammar/cf-grammar.js')
var melodicOutlineFilter = require('../../../lib/cantus-firmus/grammar/melodic-outline-filter.js')

test('melodicOutlineFilter', function (t) {
  var machine = new MusicMachine(cfGrammar, 'Start')

  // guide to test outline length limit
  var guide = machine.createGuide()
  guide.choose('C4 D4 E4 F4 G4'.split(' '))
  t.deepEqual(guide.choices().sort(),
    [ 'A4', 'B4', 'F4', 'E4', 'G3', 'B3', 'C4', 'D4' ].sort())
  guide.addFilter(melodicOutlineFilter)
  t.deepEqual(guide.choices().sort(),
    [ 'F4', 'E4', 'G3', 'B3', 'C4', 'D4' ].sort())

  // guide to test dissonant interval limit
  guide = machine.createGuide()
  guide.choose('C4 B3 D4 E4 F4'.split(' '))
  t.deepEqual(guide.choices().sort(),
    [ 'G4', 'A4', 'E4', 'D4', 'F3', 'A3', 'B3', 'C4' ].sort())
  guide.addFilter(melodicOutlineFilter)
  t.deepEqual(guide.choices().sort(),
    [ 'G4' ].sort())

  // guide to test dissonant interval limit with 3 notes
  guide = machine.createGuide('F lydian')
  guide.choose('F4 G4 B4'.split(' '))
  t.deepEqual(guide.choices().sort(),
    [ 'C5', 'A4', 'G4', 'B3', 'D4', 'E4', 'F4' ].sort())
  guide.addFilter(melodicOutlineFilter)
  t.deepEqual(guide.choices().sort(),
    [ 'C5' ].sort())

  t.end()
})
