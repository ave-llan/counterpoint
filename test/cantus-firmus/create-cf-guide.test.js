var test = require('tape')
var createCFguide = require('../../lib/cantus-firmus/create-cf-guide.js')

test('createCFguide', function (t) {
  var guide = createCFguide('C major')

  t.equal(guide.tonic(), 'C')
  t.deepEqual(guide.choices(), ['C'])

  t.end()
})
