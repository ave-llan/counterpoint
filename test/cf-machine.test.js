var test = require('tape')
var createCFmachine = require('../lib/create-cf-machine.js')
var MusicMachine = require('music-machine')

test('cfMachine', function (t) {
  var cfMachine = createCFmachine()

  t.true(cfMachine instanceof MusicMachine)

  var defaultGuide = cfMachine.createGuide()
  t.deepEqual(defaultGuide.choices(),
   [ 'C' ])
  defaultGuide.choose('C4')
  t.deepEqual(defaultGuide.choices().sort(),
   [ 'D4', 'E4', 'F4', 'G4', 'A4', 'C5',
     'B3', 'A3', 'C3', 'E3', 'F3', 'G3' ].sort())

  var cfMachine_range5 = createCFmachine(5)
  var guide_range5 = cfMachine_range5.createGuide()
  t.deepEqual(guide_range5.choices(),
   [ 'C' ])
  guide_range5.choose('C4')
  t.deepEqual(guide_range5.choices().sort(),
   [ 'D4', 'E4', 'F4', 'G4',
     'B3', 'A3', 'F3', 'G3' ].sort())

  t.end()
})
