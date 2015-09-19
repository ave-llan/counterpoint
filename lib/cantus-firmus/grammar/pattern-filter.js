/**
 * MusicMachine filter that avoids patterns of length 2 or 3
 * such as 1 2 1 2 or 1 2 3 1 2 3
 */
var patternFilter = function (choices, construction) {
  var len = construction.length
  if (len > 2) {    // long enough for 2 note pattern
    var blacklist = [] // notes that would form a pattern
    if (construction[len - 3] === construction[len - 1]) {
      // 1 _ 1  matches, add penultimate note to blacklist
      blacklist.push(construction[len - 2])
    }
    if (len > 4) {  // long enough for 3 note pattern
      if (construction[len - 5] === construction[len - 2]) {
        // 1 _ _ 1 _ matches
        if (construction[len - 4] === construction[len - 1]) {
          // 1 2 _ 1 2 matches, add third to last note to blacklist
          blacklist.push(construction[len - 3])
        }
      }
    }
    if (blacklist.length > 0) {
      choices = choices.filter(function (note) {
        return blacklist.indexOf(note) === -1
      })
    }
  }
  return choices
}

module.exports = patternFilter
