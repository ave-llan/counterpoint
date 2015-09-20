var indexOfLastOutline = require('../../utils/index-of-last-outline.js')
var isHigher = require('nmusic').isHigher
var intervalSize = require('nmusic').intervalSize
var intervalQuality = require('nmusic').intervalQuality

var MAX_OUTLINE_LENGTH = 5            // no more than 5 notes in a single direction
var dissonantIntervalSizes = [7]      // interval sizes not allowed
var dissonantQualities = ['A', 'd']   // qualities not allowed

// helper function that checks if this interval is not allowed
var formsBadInterval = function (note1, note2) {
  return (dissonantIntervalSizes.indexOf(intervalSize(note1, note2)) !== -1) ||
         (dissonantQualities.indexOf(intervalQuality(note1, note2)) !== -1)
}

/**
 * MusicMachine filter that ensures valid melodic outlines (a group of notes that move in the same direction)
 */
var outlineFilter = function (choices, construction) {
  var outline = construction.slice(indexOfLastOutline(construction))
  if (outline.length < 3) return choices // no restrictions until on outline's 4th note choices
  var firstNote = outline[0]
  var lastNote = outline[outline.length - 1]
  var sameDirection = isHigher(lastNote, firstNote)

  // if MAX_OUTLINE_LENGTH, filter out choices that continue in the same direction
  if (outline.length >= MAX_OUTLINE_LENGTH) {
    choices = choices.filter(function (choice) {
      return sameDirection !== isHigher(choice, lastNote)
    })
  }

  // if outlined interval is dissonant, must not change direction now
  if (formsBadInterval(firstNote, lastNote)) {
    choices = choices.filter(function (choice) {
      return sameDirection === isHigher(choice, lastNote)
    })
  }

  // if adding next note will make this MAX_OUTLINE_LENGTH, do not create dissonant outline
  if (outline.length === MAX_OUTLINE_LENGTH - 1) {
    choices = choices.filter(function (choice) {
      return !formsBadInterval(firstNote, choice)
    })
  }

  return choices
}

module.exports = outlineFilter
