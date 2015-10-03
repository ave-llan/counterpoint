var test = require('tape')
var CantusFirmus = require('../../lib/cantus-firmus/cantus-firmus.js')

test('CantusFirmus', function (t) {
  var cf = new CantusFirmus('D minor', 6, 13)

  t.true(cf instanceof CantusFirmus)
  t.deepEqual(cf.cf(), [])
  t.throws(function () {
    cf.pop()
  }, Error)
  t.deepEqual(cf.choices(), ['D'])
  t.false(cf.isValid())

  'D4 E4 F4 C4 D4 F4 E4 G4 Bb3 C4 F4 E4 D4'.split(' ').forEach(cf.addNote)
  t.deepEqual(cf.cf(),
    'D4 E4 F4 C4 D4 F4 E4 G4 Bb3 C4 F4 E4 D4'.split(' '))
  t.deepEqual(cf.choices(), [])
  t.true(cf.isValid())
  t.deepEqual(cf.choices(4), [])

  cf = new CantusFirmus('C major', 10, 16)
  'C4 G4 F4 D5 C5 G4 A4 B4 C5'.split(' ').forEach(cf.addNote)
  t.false(cf.isValid())

  t.end()
})
