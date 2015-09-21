var intervalSize = require('nmusic').intervalSize

/**
 * MusicMachine filter that avoids leaping back to the same note after
 * leaving it via a leap (no 1 3 1)
 */
var noLeapBackFilter = function (choices, construction) {
  // as the grammar is defined, this can only happen with thirds so check for it directly
  var N = construction.length
  if (N < 2 || intervalSize(construction[N - 2], construction[N - 1]) !== 3) {
    return choices   // filter does not apply
  }
  var previousNote = construction[N - 2]
  return choices.filter(function (choice) {
    return choice !== previousNote
  })
}

module.exports = noLeapBackFilter
