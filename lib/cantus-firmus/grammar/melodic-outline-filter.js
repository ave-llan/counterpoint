var indexOfLastOutline = require('../../utils/index-of-last-outline.js')
var isHigher = require('nmusic').isHigher
var intervalSize = require('nmusic').intervalSize
var intervalQuality = require('nmusic').intervalQuality

var MAX_OUTLINE_LENGTH = 5            // no more than 5 notes in a single direction
var dissonantIntervalSizes = [7]      // interval sizes not allowed
var dissonantQualities = ['A', 'd']   // qualities not allowed

/**
 * MusicMachine filter that ensires valid melodic outlines (a group of notes that move in the same direction)
 */
var outlineFilter = function (choices, construction) {
  var outline = construction.slice(indexOfLastOutline(construction))
  if (outline.length <= 3) return choices // no restrictions until on outline's 4th note choices

  var firstNote = construction[0]
  var lastNote = construction[construction.length - 1]
  var isAscending = isHigher(lastNote, firstNote)

  // if MAX_OUTLINE_LENGTH, filter out choices that continue in the same direction
  if (outline.length >= MAX_OUTLINE_LENGTH) {
    choices = choices.filter(function (note) {
      return isAscending !== isHigher(note, lastNote)
    })
  }

  // if outlined interval is dissonant, must not change direction now
  if (dissonantIntervalSizes.indexOf(intervalSize(firstNote, lastNote)) !== -1 ||
      dissonantQualities.indexOf(intervalQuality(firstNote, lastNote)) !== -1) {
    choices = choices.filter(function (note) {
      return isAscending === isHigher(note, lastNote)
    })
  }

  return choices
}

module.exports = outlineFilter
