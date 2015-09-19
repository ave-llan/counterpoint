var createCFmachine = require('./create-cf-machine.js')

/**
 * create a new GuidedMusicMachine configured with a Cantus Firmus grammar
 * @param {KeyString} key - the key of this cf
 * @param {number} [maxRange=10] - the max range this machine will allow
 * @param {number} [maxLength=16] - the maxLength of this machine
 * @returns {MusicMachine} a new MusicMachine
 *
 * @see [MusicMachine]{@link https://github.com/jrleszcz/music-machine/blob/master/api.md#musicmachine}
 */
var createCFguide = function (key, maxRange, maxLength) {
  var machine = createCFmachine(maxRange || 10,
                               maxLength || 16)
  return machine.createGuide(key)
}

module.exports = createCFguide
