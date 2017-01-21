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
  t.equal(cf.key(), 'D minor')

  var notes = 'D4 E4 F4 C4 D4 F4 E4 G4 Bb3 C4 F4 E4 D4'
  notes.split(' ').forEach(cf.addNote)
  t.deepEqual(cf.cf(),
    notes.split(' '))
  t.deepEqual(cf.choices(), [])
  t.equal(cf.toString(), notes)
  t.true(cf.isValid())
  t.deepEqual(cf.choices(4), [])

  cf = new CantusFirmus('C major', 10, 16)
  'C4 G4 F4 D5 C5 G4 A4 B4 C5'.split(' ').forEach(cf.addNote)
  t.false(cf.isValid())
  t.equal(cf.key(), 'C major')

  t.end()
})
