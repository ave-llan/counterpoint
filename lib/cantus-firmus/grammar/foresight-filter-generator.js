var isHigher = require('nmusic').isHigher
var intervalSize = require('nmusic').intervalSize
var sortPitches = require('nmusic').sortPitches

/**
 * MusicMachine filter generator that filters out notes which
 * are OK in the moment but that preclude the creation of a valid CF.
 * For example, if maxRange is 8 and the cf goes down 8 from the first note,
 * there cannot be a climax as the cf must end on tonic again.
 */
var foresightFilterGenerator = function (maxRange, maxLength) {
  return function (choices, construction) {
    if (construction.length === 0) return choices // no need to check
    var firstNote = construction[0]
    var usedNotes = sortPitches(construction)
    // only need to check for low note if no notes are higher than the first note
    if (!isHigher(usedNotes[usedNotes.length - 1], firstNote)) {
      choices = choices.filter(function (pitch) {
        return isHigher(pitch, firstNote) ||
               intervalSize(pitch, firstNote) <= maxRange - 1
      })
    }

    // TODO add filter that checks if notes at end can lead to a valid cf

    return choices
  }
}

module.exports = foresightFilterGenerator
