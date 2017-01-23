var nmusic = require('nmusic')
  , Key = nmusic.Key
  , isHigher = nmusic.isHigher
/**
 * creates a simple tabular visualization of the cantus firmus
 * @param {CantusFirmus} - the cantus firmus to visualize
 * @returns {String} a tabular representation of the cantus firmus
 *
 * @example
 * var cf = new CantusFirmus('D minor', 6, 13)
 * 'D4 E4 F4 C4 D4 F4 E4 G4 Bb3 C4 F4 E4 D4'.split(' ').forEach(cf.addNote)
 * prettyPrintCf(cf) =>
 *
 * G4                              o
 * F4          o           o                   o
 * E4      o                   o                   o
 * D4  o               o                               o
 * C4              o                       o
 * Bb3                                 o
 *     D4  E4  F4  C4  D4  F4  E4  G4  Bb3 C4  F4  E4  D4
 */
function prettyPrintCf(cantusFirmus) {
  var key = Key(...cantusFirmus.key().split(' '))
    , cf = cantusFirmus.cf()
    , lowPitch = cf.reduce((a, b) => isHigher(a, b) ? b : a)
    , highPitch = cf.reduce((a, b) => isHigher(a, b) ? a : b)
    , range = key.range(lowPitch, highPitch).map(pitch => pitch.toString()).reverse()
    , pitchStringMaxLength = range.reduce((longest, pitchString) => Math.max(longest, pitchString.length), 0)
    , columnWidth = Math.max(3, pitchStringMaxLength)
    , pad = pitchString => paddedString(pitchString, columnWidth)
    , seperator = ' '

  return [
    ...range.map(function (pitch) {
      return [pitch, ...cf.map(p => p == pitch ? 'o' : '')]
    }),
    ['', ...cf] // not names in footer
  ]
  .map(row => row.map(pad).join(seperator))
  .join('\n')
}

function paddedString(s, width) {
  if (s.length >= width)
    return s
  return s + ' '.repeat(width - s.length)
}

module.exports = prettyPrintCf
