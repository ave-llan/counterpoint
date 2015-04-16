var CantusFirmus = require('./CantusFirmus.js');
var CFstats = require('./CFstats.js');
var Pitch = require('./Pitch.js');
var Stack = require('./Stack.js');
var WeightedBag = require('./WeightedBag.js');
var MaxPQ = require('./MaxPQ.js');

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

    // subjective heuristic used to decide how good (balanced) a cf is
    calculatePriority: function(cf) {
        if (!cf.stats)
            cf.stats = new CFstats(cf);

        // base score is length so further along cfs will be given priority
        var score = cf.length;

        // penalty for high standard deviation of note weight
        if (cf.stats.noteWeights.stdDeviation > 1 && cf.length > 2)
            score -= (cf.stats.noteWeights.stdDeviation - 1) * cf.length;

        // penalty if seconds are not at least 54% of intervals
        if (cf.length > 3) {
            var desiredSeconds = (cf.length - 1) / 1.85;
            if (cf.stats.intervalUsage[2] < desiredSeconds)
                score -= desiredSeconds - cf.stats.intervalUsage[2];
        }
        // subtract 1 point for each octave leap after the first
        if (cf.stats.intervalUsage[8] > 1)
            score -= cf.stats.intervalUsage[8] - 1;

        // penalty for too many or too few leaps
        if (cf.stats.leaps > 4)        // -1 for each extra leap
            score -= cf.stats.leaps - 4;
        else if (cf.length >= 5) {
            var deduction = (cf.stats.leaps - cf.length / 4) * 2; // 2-4 leaps for cf of 8-16 length * 2 for more weight
            if (deduction < 0) // no bonus added if this number is positive
                score += deduction;
        }

        // make sure all notes within range are used -- if end is near, subtract points for unused notes
        // subtract 1 because all notes need to be used 1 before end since last note is tonic
        if (this.goalLength - cf.length - 1 < cf.stats.range - cf.stats.uniqueNotes) {
            var missingNotes = (cf.stats.range - cf.stats.uniqueNotes) - (this.goalLength - cf.length - 1);
            score -= missingNotes * this.goalLength // subtract the whole goalLength for each note that will not be able to be used
        } 

        /*
        CONSIDER ADDING THESE FACTORS:
        // directions should be relatively balanced
        if (cf.length > 6) {
            var directions = this.directionStats();
            var offBalance = Math.abs(directions.up - directions.down) - 2;
            score -= offBalance * (cfLength / 8);
        }
    
        // don't use any note thrice until at least 3 notes are used twice
        if(cf.stats.timesNotesUsed[2] <= 3) {
            if (cf.stats.timesNotesUsed[2]) {
                for (var noteName in cf.stats.noteUsage) {
                    if (cf.stats.noteUsage[noteName] == 2)
                        blackList.push(noteName);
                }
            }
        } 
        */
        return score;
    },

    // returns a full cf built starting from the current cf
    buildCF: function() {
        if (this.cf.length == this.goalLength)
            return this.cf;
        this.cf.stats = new CFstats(this.cf);
        this.cf.priority = this.calculatePriority(this.cf);
        var cfPriorityQueue = new MaxPQ(cfRatingIsLess);     // MaxPQ that will hold partially built CFs
        cfPriorityQueue.insert(this.cf);                     // add the starting CF
        while(!cfPriorityQueue.isEmpty()) {
            var cf = cfPriorityQueue.delMax();               // pull top cf off the stack
            var lastNote = cf.cf[cf.length - 1];             // the last note of cf, defined for convenience

            // create inRange function by finding max and min notes
            var maxNote = cf.key.intervalFromPitch(cf.stats.lowestNote,   this.maxRange);
            var minNote = cf.key.intervalFromPitch(cf.stats.highestNote, -this.maxRange);
            // if highest note is currently repeated, leave room for climax by raising minNote by a step
            if (cf.stats.noteUsage[cf.stats.highestNote.sciPitch] > 1) {
                minNote = cf.key.intervalFromPitch(minNote, 2);
                if (cf.length == this.goalLength - 1) // if this is the end, there is no climax so it won't work
                    continue;
            }
            var isInRange = inRangeChecker(minNote, maxNote);

            // if only one note, randomly pull a second note from weighted bag and only add it
            // only adding one note here results in more variety 
            if (cf.length == 1) {
                var weightedBag = new WeightedBag();
                for (var intervalName in INTERVAL_WEIGHT_AT_START) {
                    var interval = Number(intervalName);
                    if (this.goalLength < 10) {
                        if (interval == 8 || interval == -8)
                            continue; // don't add octave because there is not room to complete it
                    }
                    var note = cf.key.intervalFromPitch(lastNote, interval);
                    if (isInRange(note))
                        weightedBag.add(note, INTERVAL_WEIGHT_AT_START[interval]); 
                }
                var newCF = cf.addNote(weightedBag.remove());
                newCF.priority = this.calculatePriority(newCF);
                cfPriorityQueue.insert(newCF);
                continue;
            }

            var nextNoteChoices = cf.nextNoteChoices();

            // check if next note is the last note
            if (cf.length == this.goalLength - 1) {
                // final note must be scale degree 1
                var scaleDegree1 = cf.cf[0];
                while (nextNoteChoices.length > 0) {
                    if (nextNoteChoices.pop().equals(scaleDegree1)) {
                        return cf.addNote(scaleDegree1);            // CF IS BUILT! 
                    }
                }
                continue;  // if not present, end search from this route
            }

            // check if next note is penultimate 
            if (cf.length == this.goalLength - 2) {
                // penultimate note must be scale degree 2
                var scaleDegree2 = cf.key.intervalFromPitch(cf.cf[0], 2);
                while (nextNoteChoices.length > 0) {
                    if (nextNoteChoices.pop().equals(scaleDegree2)) {
                        var newCF = cf.addNote(scaleDegree2);
                        newCF.priority = this.calculatePriority(newCF);
                        cfPriorityQueue.insert(newCF);
                        break;
                    }
                }
                continue;   // if not present, end search from this route
            }

            // else add all notes that are within range to queue
            while (nextNoteChoices.length > 0) {
                var note = nextNoteChoices.pop();
                if (isInRange(note)) {
                    var newCF = cf.addNote(note);
                    newCF.priority = this.calculatePriority(newCF);
                    cfPriorityQueue.insert(newCF);
                }
            }
        }
    },

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

// heuristic comparator function passed to MaxPQ to compare cfs
function cfRatingIsLess(a, b) {
    return a.priority < b.priority;
}

// helper function that returns an integer between [a,b) (b exclusive)
// if b is not provided, returns an integer between [0,a) 
function uniformRandom(a, b) {
    if (!b) {
        b = a;
        a = 0;
    }
    return a + Math.floor(Math.random() * (b - a));
}

module.exports = CFBuilder;