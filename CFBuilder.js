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

    // returns an array of possible next notes sorted low to high after applying blacklist
    nextNoteChoices: function(cf) {
        if (!cf.stats)
            cf.stats = new CFstats(cf);
        var cfChoices = cf.nextNoteChoices();
        var blacklist = this.blacklist(cf);
        var inRange = inRangeChecker(cf.stats.lowestNote, cf.stats.highestNote);
        var filteredChoices = [];
        cfChoices.forEach(function(note) {
            if (inRange(note)) {
                if (blacklist.indexOf(note) == -1)
                    filteredChoices.push(note);
            }
        })
        return filteredChoices;
    },

    // returns an array of notes that should can not be used because of patterns or overuse
    blacklist: function(cf) {
        // if only one note, there is no blacklist
        if (cf.length == 1)
            return [];
        if (!cf.stats)
            cf.stats = new CFstats(cf);
        var blackList = [];
        // check for pattern of note groups of length 2 (such as 2 1 2 1)
        if (cf.length >= 3) {
            if (cf.cf[cf.length - 3].equals(cf.cf[cf.length - 1]))
                blackList.push(cf.cf[cf.length - 2]); // using this note would form pattern
        }
        // check for pattern of note groups of length 3 (such as 3 2 1 3 2 1)
        if (cf.length >= 5) {
            if (cf.cf[cf.length - 5].equals(cf.cf[cf.length - 2])) {
                if (cf.cf[cf.length - 4].equals(cf.cf[cf.length - 1]))
                    blackList.push(cf.cf[cf.length - 3]);
            }
        }
        // if end is near, add all used notes to make sure all notes within range are used, 
        if (this.goalLength - cf.length > 1) { // if not last note
            // subtract 1 because all notes need to be used 1 before end since last note is tonic
            if (this.goalLength - cf.length - 1 <= cf.stats.range - cf.stats.uniqueNotes) {
                Object.keys(cf.stats.noteUsage).forEach(function(noteName) {
                    blackList.push(new Pitch(noteName));
                });
            } // don't use any note thrice until 3 notes used twice
            else if(cf.stats.timesNotesUsed[2] <= 3) {
                if (cf.stats.timesNotesUsed[2]) {
                    for (var noteName in cf.stats.noteUsage) {
                        if (cf.stats.noteUsage[noteName] == 2)
                            blackList.push(new Pitch(noteName));
                    }
                }
            }
        }
        return blackList;
    },

    // builds a cf from the current cf;
    buildCF: function() {
        // use priority queue with increasing weight of 'penalties' as it approaches the end
        // penalties for too many or too few leaps, note unbalance, too many too few seconds, direction balance
    },


    // attaches heuristic score to a cf  Score = length + h()*weight(distance from end)
    // attachHeuristic: function() {},


    // builds a cf with upper and lower 'superlines'
    // buildCompoundLine: function() {},

    // adds the given pitch to the current cf
    addNote: function(pitch) {
        this.cf = this.cf.addNote(pitch);
    }
}

// returns a function that returns true if a note lies within the given range
function inRangeChecker(minNote, maxNote) {
    var inRange = function(pitch) {
        if (pitch.isLower(maxNote) && pitch.isHigher(minNote))
            return true;
        if (pitch.equals(maxNote) || pitch.equals(minNote))
            return true;
        return false;
    };
    return inRange;
}

module.exports = CFBuilder;