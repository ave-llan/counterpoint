var deepcopy = require('deepcopy')

/*
 * Cantus Firumus rules apply in both upwards and downwards directions so
 * define grammar in only one direction here, and then add reverse
 * below by flipping 'Up'/'Down' and positive numbers to negative
 */
var upOnly = {

  // designed to be an infinite phrase
  UpPhrase: ['UpLeap DownStepPhrase UpPhrase',
             'UpStepPhrase DownPhrase'],

  // all choices must be prepared for a potential down leap in downphrase
  UpStepPhrase: ['Up2Phrase',
                 'Up3Phrase',
                 'UpLeapForwardPhrase'],

  // after 2, can reverse direction or continue up 2 or 3
  Up2Phrase: ['2',
              '2 Up2Phrase',
              '2 Up3Phrase'],

  // after 3, can reverse direction or continue up 2
  Up3Phrase: ['3',
              '3 Up2Phrase'],

  // up leap must be recovered with down step
  // prepare for a potential downard leap by adding another UpPhrase
  UpLeapForwardPhrase: ['2 UpLeapForward DownStepPhrase UpPhrase'],

  // allowed up leaps after already moving a second up
  UpLeapForward: ['4', '5'],

  // allowed leaps at the beginning or after a direciton change
  UpLeap: ['4', '5', '6', '8']
}

// build the grammar by creating down versions of all symbols in 'upOnly'
var cfGrammar = {
  Start: ['UpPhrase', 'DownPhrase']
}

for (var def in upOnly) {
  // add up phrase as is
  cfGrammar[def] = deepcopy(upOnly[def])

  // reverse down/up and make positive numbers negative
  var downDef = deepcopy(upOnly[def]).map(function (definition) {
    return definition.split(' ').map(function (symbol) {
      if (symbol.indexOf('Down') > -1) {
        return symbol.replace('Down', 'Up')
      } else if (symbol.indexOf('Up') > -1) {
        return symbol.replace('Up', 'Down')
      } else if (!isNaN(symbol)) {
        return '-' + symbol        // make positive number negatie
      } else {
        return symbol
      }
    }).join(' ')
  })

  cfGrammar[def.replace('Up', 'Down')] = downDef
}

module.exports = cfGrammar
