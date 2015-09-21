var test = require('tape')
var cfMachine = require('../../lib/cantus-firmus/cf-machine.js')
var MusicMachine = require('music-machine')

test('createCFmachine', function (t) {
  t.true(cfMachine instanceof MusicMachine)

  var guide = cfMachine.createGuide()
  t.deepEqual(guide.choices(),
   [ 'C' ])
  guide.choose('C4')
  t.deepEqual(guide.choices().sort(),
   [ 'D4', 'E4', 'F4', 'G4', 'A4', 'C5',
     'B3', 'A3', 'C3', 'E3', 'F3', 'G3' ].sort())

  ;['D4', 'E4', 'C4', 'D4'].forEach(guide.choose)
  // E4 should not be present because of C D E C D E pattern
  t.deepEqual(guide.choices().sort(),
   [ 'F4', 'G4', 'A4',
     'C4', 'B3', 'A3', 'D3', 'F3', 'G3' ].sort())

  guide.choose('C4')
  // D4 should not be present because of C D C D pattern
  t.deepEqual(guide.choices().sort(),
   [ 'A3', 'A4', 'B3', 'C5', 'E4', 'F3', 'F4', 'G3', 'G4' ].sort())

  guide.choose('B3')
  // F4 should not be present because of Augmented interval
  t.deepEqual(guide.choices().sort(),
   [ 'A3', 'B4', 'C4', 'D4', 'E4', 'G3', 'G4' ].sort())

  guide.choose('D4')
  // B3 should not be present because of leap back to the same note
  t.deepEqual(guide.choices().sort(),
   [ 'A3', 'C4', 'D3', 'E4', 'F3', 'G3' ].sort())

  t.end()
})
