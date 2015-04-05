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
    8: 1
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
    2: 6,
    3: 3,
    4: 2,
    5: 1,
};


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
    var goalLength = goalLength;
    var maxRange = maxRange;

    // build the CF
    var cfs = new Stack();  // stack with partially built Cantus Firmi
    cfs.push(startCF);

    while(!cfs.isEmpty()) {
        var cf = cfs.pop();                 // take the top option off the stack
        var lastNote = cf.cf[cf.length - 1];

        // if this is the first note, add all possible choices and continue
        if (cf.length == 1) {
            var bag = new WeightedBag();
            for (var intervalName in INTERVAL_WEIGHT_AT_START) {
                var interval = Number(intervalName);
                var upwardNote = cf.key.intervalFromPitch(lastNote, interval);
                var lowerNote = cf.key.intervalFromPitch(lastNote, -interval);
                bag.add(upwardNote, INTERVAL_WEIGHT_AT_START[interval]);
                bag.add(lowerNote, INTERVAL_WEIGHT_AT_START[interval]);
            }
            var nextNoteStack = new Stack();
            while (!bag.isEmpty())
                nextNoteStack.push(bag.remove());
            while (!nextNoteStack.isEmpty())
                cfs.push(cf.addNote(nextNoteStack.pop()));
            continue;
        }

        cf.stats = new CFstats(cf);         // build and attach stats for this cf 

        // build helper functions for checking if note is possible
        var formsValidInterval = function(pitch) {
            return MELODIC_INTERVALS.indexOf(lastNote.interval(pitch)) > -1;
        };
        var maxNote = cf.key.intervalFromPitch(cf.stats.lowestNote,   maxRange);
        var minNote = cf.key.intervalFromPitch(cf.stats.highestNote, -maxRange);
        // function used to test if potential note is in range
        var inRange = function(pitch) {
            if (pitch.isLower(maxNote) || pitch.isHigher(minNote))
                return true;
            if (pitch.equals(maxNote) || pitch.equals(minNote))
                return true;
            return false;
        };
        //  black list of notes that are ruled out for nextNote
        var blackList = []; // an array of notes as strings in sciPitch 
        var inBlackList = function(pitch) {
            return blackList.indexOf(pitch.sciPitch) > -1;
        };
        // combine all helper functions into one
        var isValidNextNote = function(pitch) {
            return formsValidInterval(pitch) && inRange(pitch) && !inBlackList(pitch);
        };

        // build black list
        // if last interval was 3 or 4, don't leap back to the same note
        if (cf.length >= 2) { // avoids patterns such as 1 3 1 or 2 5 2
            if (cf.stats.lastInterval == 3 || cf.stats.lastInterval == 4)
                blackList.push(cf.cf[cf.length - 2].sciPitch);
        }
        // check for pattern of note groups of length 2 (such as 2 1 2 1)
        if (cf.length >= 3) {
            if (cf.cf[cf.length - 3].equals(cf.cf[cf.length - 1]))
                blackList.push(cf.cf[cf.length - 2].sciPitch); // using this note would form pattern
        }
        // check for pattern of note groups of length 3 (such as 3 2 1 3 2 1)
        if (cf.length >= 5) {
            if (cf.cf[cf.length - 5].equals(cf.cf[cf.length - 2])) {
                if (cf.cf[cf.length - 4].equals(cf.cf[cf.length - 1]))
                    blackList.push(cf.cf[cf.length - 3].sciPitch);
            }
        }
        // make sure all notes within range are used -- if end is near, add all used notes
        if ((goalLength - 1) - cf.length == cf.stats.range - cf.stats.uniqueNotes) {
            Object.keys(cf.stats.noteUsage).forEach(function(noteName) {
                blackList.push(noteName);
            });
        } // don't use any note thrice until 3 notes used twice
        else if(cf.stats.timesNotesUsed[2] <= 3) {
            if (cf.stats.timesNotesUsed[2]) {
                for (var noteName in cf.stats.noteUsage) {
                    if (cf.stats.noteUsage[noteName] == 2)
                        blackList.push(noteName);
                }
            }
        }



        var direction = 1;
        if (cf.stats.isAscending)
            direction *= -1; 

        // can change direction?             check for consonant outlined interval
        var changeDirection = MELODIC_INTERVALS.indexOf(cf.stats.outlinedInterval) > -1;

        // if last interval was > 3, recover from leap
        if (cf.stats.lastInterval > 3) {
            if (!changeDirection)
                continue;   // there are no possible routes from this cf 
            var bag = new WeightedBag();
            for (var intervalName in INTERVAL_WEIGHT_AFTER_LEAP) {
                var interval = Number(intervalName);
                var newNote = cf.key.intervalFromPitch(lastNote, interval * -direction);
                if (isValidNextNote(newNote))
                    bag.add(newNote, INTERVAL_WEIGHT_AFTER_LEAP[interval]);
            }
            // put on new stack so first picked from bag will be last added to cfs stack
            var nextNoteStack = new Stack();
            while (!bag.isEmpty())
                nextNoteStack.push(bag.remove());
            while (!nextNoteStack.isEmpty())
                cfs.push(cf.addNote(nextNoteStack.pop()));
            continue;
        }

        // if no leaps and not first note, now find all possibilities
        var directionChangeStack = new Stack();
        var sameDirectionStack = new Stack();

        // can continue in same direction?   check outline length < 5
        var continueDirection = cf.stats.lastOutlineLength < MAX_OUTLINE_LENGTH;
        // can change direction?             check for consonant outlined interval
        var changeDirection = MELODIC_INTERVALS.indexOf(cf.stats.outlinedInterval) > -1;

        if (changeDirection) {
            // if last interval was 3 or 4 add notes to blackList that would from a triad
            if (cf.stats.lastInterval == 3) {
                blackList.push(cf.key.intervalFromPitch(lastNote, 5 * -direction).sciPitch);
                blackList.push(cf.key.intervalFromPitch(lastNote, 6 * -direction).sciPitch);
            }
            if (cf.stats.lastInterval == 4)
                blackList.push(cf.key.intervalFromPitch(lastNote, 6 * -direction).sciPitch);
            // try to add to directionChangeStack
            var bag = new WeightedBag();
            for (var intervalName in INTERVAL_WEIGHT_DIRECTION_CHANGE) {
                var interval = Number(intervalName);
                var newNote = cf.key.intervalFromPitch(lastNote, interval * -direction);
                if (isValidNextNote(newNote))
                    bag.add(newNote, INTERVAL_WEIGHT_DIRECTION_CHANGE[interval]);
            }
            // put on new stack so first picked from bag will be last added to cfs stack
            var directionChangeStack = new Stack();
            while (!bag.isEmpty())
                directionChangeStack.push(bag.remove());
        }

        if (continueDirection) {
            // try to add to sameDirectionStack 
        }

        // flip a coin to see whether to change direcion first or continue first
        // add possibilities to cfs stack


        // check if next note is penultimate 
        if (cf.length == goalLength - 2) {
            // check if scale degree 2 is in possibilities 
        }
        // check if next note is the last note
        if (cf.length == goalLength - 1) {
            // check if scale degree 1 is possible
        }

    }
    // throw new Error("No CF was possible."); // if stack of possibilities is empty
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

module.exports = buildCF;