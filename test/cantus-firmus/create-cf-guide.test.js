var test = require('tape')
var createCFguide = require('../../lib/cantus-firmus/create-cf-guide.js')

test('createCFguide', function (t) {
  var guide = createCFguide('D minor', 6, 13)

  t.equal(guide.tonic(), 'D')
  t.deepEqual(guide.choices(), ['D'])

  guide.choose('D4')
  t.deepEqual(guide.choices().sort(),
    'E4 F4 G4 A4 Bb4 C4 Bb3 A3 G3'.split(' ').sort())

  guide.choose('E4')
  t.deepEqual(guide.choices().sort(),
    'G3 A3 C4 D4 F4 G4 A4'.split(' ').sort())

  guide.choose('F4')
  t.deepEqual(guide.choices().sort(),
    'A3 Bb3 C4 D4 E4 G4 A4'.split(' ').sort())

  guide.choose('C4')
  t.deepEqual(guide.choices().sort(),
    'D4 E4'.split(' ').sort())

  guide.choose('D4')
  t.deepEqual(guide.choices().sort(),
    'A3 Bb3 C4 E4 F4 G4 A4'.split(' ').sort())

  guide.choose('F4')
  t.deepEqual(guide.choices().sort(),
    'A3 Bb3 C4 E4 G4'.split(' ').sort())

  guide.choose('E4')
  t.deepEqual(guide.choices().sort(),
    'A3 C4 D4 F4 G4 A4'.split(' ').sort())

  guide.choose('G4')
  t.deepEqual(guide.choices().sort(),
    'Bb3 C4 D4 F4 A4'.split(' ').sort())

  guide.choose('Bb3')
  t.deepEqual(guide.choices().sort(),
    'C4 D4'.split(' ').sort())

  guide.choose('C4')
  t.deepEqual(guide.choices().sort(),
    'Bb3 D4 E4 F4 G4'.split(' ').sort())

  guide.choose('F4')
  t.deepEqual(guide.choices().sort(),
    'D4 E4'.split(' ').sort())

  guide.choose('E4')
  t.deepEqual(guide.choices().sort(),
    'C4 D4 F4 G4'.split(' ').sort())

  guide.choose('D4')
  t.deepEqual(guide.choices(), [])

  t.end()
})
