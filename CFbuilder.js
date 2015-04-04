var CantusFirmus = require('./CantusFirmus.js');
var Pitch = require('./Pitch.js');
var Stack = require('./Stack.js');

// default choices to be used if not provided to constructor
var defaultTonics = ["G4", "F4", "A4"];
var defaultModes = ["major", "minor", "dorian", "mixolydian"];
var defaultMinLength = 8;
var defaultMaxLength = 16;
var defaultMaxRange = 10;

function buildCF(startCF, goalLength, maxRange) {
    if (!startCF) {
        var tonic = new Pitch(defaultTonics[uniformRandom(defaultTonics.length)]);
        var mode = defaultModes[uniformRandom(defaultModes.length)];
        startCF = new CantusFirmus([tonic], mode);
    }
    if (!goalLength)
        goalLength = uniformRandom(defaultMinLength, defaultMaxLength + 1); 
    if (!maxRange)
        maxRange = defaultMaxRange
    var cf = startCF;
    var goalLength = goalLength;
    var maxRange = maxRange;
}




// helper function that returns an object of note names


// helper function that returns an integer between [a,b) (b exclusive)
// if b is not provided, returns an integer between 0 and a
function uniformRandom(a, b) {
    if (!b) {
        b = a;
        a = 0;
    }
    return a + Math.floor(Math.random() * (b - a));
}

module.exports = CFbuilder;