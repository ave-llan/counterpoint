var CantusFirmus = require('./CantusFirmus.js');
var CFstats = require('./CFstats.js');
var Pitch = require('./Pitch.js');
var Stack = require('./Stack.js');
var WeightedBag = require('./WeightedBag.js');

// default choices to be used if not provided to constructor
var defaultTonics = ["G4", "F4", "A4"];
var defaultModes = ["major", "minor", "dorian", "mixolydian"];
var defaultMinLength = 8;
var defaultMaxLength = 16;
var defaultMaxRange = 10;

var MELODIC_INTERVALS = ['m2','M2','m3','M3','P4','P5','m6','M6','P8']; // consonant melodic intervals
var MAX_OUTLINE_LENGTH = 5; // max number of notes in a single direction in a row
var MAX_OUTLINE_SIZE = 8;   // largest size notes can move in a single direction
var INTERVALS_AFTER_DIRECTION_CHANGE = [2,3,4,5,6,8];
var INTERVAL_WEIGHT_AT_START = {
    2: 3,
    3: 3,
    4: 3,
    5: 3,
    6: 3,
    8: 1,
    '-2': 2,
    '-3': 1,
    '-4': 2,
    '-5': 1,
    '-6': 2,
    '-8': 0.5
};
var INTERVAL_WEIGHT_AFTER_LEAP = {
    2: 2,
    3: 1
};
var INTERVAL_WEIGHT_DIRECTION_CHANGE = {
    2: 2,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    8: 1
};
var INTERVAL_WEIGHT_SAME_DIRECTION = {
    2: 7,
    3: 3,
    4: 1,
    5: 1,
};
// probability of continuing in the same direction when there is a choice
var CONTINUE_DIRECTION_PROBABILITY = 0.65;


function CFBuilder(startCF, goalLength, maxRange) {
    if (!startCF) {
        var tonic = new Pitch(defaultTonics[uniformRandom(defaultTonics.length)]);
        var mode = defaultModes[uniformRandom(defaultModes.length)];
        startCF = new CantusFirmus([tonic], mode);
    }
    if (!goalLength)
        goalLength = uniformRandom(defaultMinLength, defaultMaxLength + 1); 
    if (!maxRange)
        maxRange = defaultMaxRange
    this.cf = startCF;
    this.goalLength = goalLength;
    this.maxRange = maxRange;
}

CFBuilder.prototype = {
    constructor: CFBuilder,

    toString: function() {
        return "CFBuilder current cf: " + this.cf;
    },

    // returns an array of possible next notes sorted low to high
    nextNoteChoices: function() {
        // if stats not already calculated for this cf, do it now
        if (!this.cf.stats)
            this.cf.stats = new CFstats(this.cf);
        
    },

    // builds a cf from the current cf;
    buildCF: function() {

    },

    // adds the given pitch to the current cf
    addNote: function(pitch) {
        this.cf = this.cf.addNote(pitch);
    }
}

module.exports = CFBuilder;