var test = require('tape')
var createCFmachine = require('../lib/create-cf-machine.js')
var MusicMachine = require('music-machine')

test('cfMachine', function (t) {
  var cfMachine = createCFmachine()

  t.true(cfMachine instanceof MusicMachine)

  t.end()
})
