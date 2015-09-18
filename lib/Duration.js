var Fraction = require("./Fraction.js");

// 1 = quarter note
// 2 = half note
// 3 = dotted half note
// 4 = whole note
// 1/2 = eighth note
// 1/4 = sixteenth note
// length can be a whole Number or a Fraction
// this.tieTo takes another duration and creates a link between them
function Duration(numerator, denominator) {
    if (!denominator)
        denominator = 1;
    Fraction.call(this, numerator, denominator);
}

Duration.prototype = Object.create(Fraction.prototype);

module.exports = Duration;