var isHigher = require('nmusic').isHigher

/**
 * given an array of pitch strings, gives the index of the start of the last melodic outline
 * (the first index of a group of notes moving in the same direction)
 * @param {PitchString[]} construction - an array of pitches
 * @returns {number} the index of the last direction change or 0 if there is no direction change
 */
var indexOfLastOutline = function (construction) {
  if (construction.length < 3) return 0 // there must be at least 3 notes to have a direction change

  // working backwards, find the first note change
  // (avoid corner case where last notes of construction are the same)
  var i = construction.length - 2
  while ((i > 0) && (construction[i] === construction[i + 1])) {
    i--
  }
  var previousDirection = isHigher(construction[i], construction[i + 1])
  while ((i > 0) &&
         (previousDirection === isHigher(construction[i - 1], construction[i]) ||
          construction[i - 1] === construction[i])) {
    i--
  }
  return i
}

module.exports = indexOfLastOutline
