var test = require('tape')
var CantusFirmus = require('../../lib/cantus-firmus/cantus-firmus.js')

test('CantusFirmus', function (t) {
  var cf = new CantusFirmus()
  t.true(cf instanceof CantusFirmus)
  t.end()
})
