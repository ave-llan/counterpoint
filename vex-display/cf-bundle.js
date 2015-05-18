(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CantusFirmus = require('./CantusFirmus.js');

// takes a CantusFirmus as argument

// subjective weighting of notes after intervals
// leaps larger than 4 get extra weight of square root of simple interval - 1.75
var INTERVAL_WEIGHTS = {4: 0.25, 5: 0.49, 6: 0.699, 8: 1.078};

function CFstats(cantus) {
    var cf = cantus.cf;
    this.cf = cf;
    this.sorted = sortNoteArray(cf);
    this.length = cf.length;
    this.highestNote = this.sorted[this.sorted.length - 1];
    this.lowestNote = this.sorted[0];
    this.range = this.lowestNote.intervalSize(this.highestNote);

    // build noteUsage AND noteWeights
    var noteUsage = {}, noteWeights = {};
    // count how many times each note is used
    this.sorted.forEach(function(pitch) {
        if (pitch.sciPitch in noteUsage) {
            noteUsage[pitch.sciPitch] += 1;
            noteWeights[pitch.sciPitch] += 1;
        }
        else {
            noteUsage[pitch.sciPitch] = 1;
            noteWeights[pitch.sciPitch] = 1;
        }
    });

    this.noteUsage = noteUsage;
    this.uniqueNotes = Object.keys(this.noteUsage).length;


    // Add extra weight to climax note if cf is already 8 notes long
    // instead of 1 extra weight is length/range for average not usage
    if (this.length >= 8) {
        noteWeights[this.highestNote.sciPitch] += this.length / this.range - 1;
        // if lowNote is lower than starting note, also give it extra weight
        if (this.lowestNote.isLower(this.cf[0]))
            noteWeights[this.lowestNote.sciPitch] += this.length / this.range - 1;
    }

    // add extra intervalWeight for notes after leaps of 4 or larger
    // also calculate interval usage
    var intervalUsage = {2: 0, 3:0, 4:0, 5:0, 6:0, 8:0};
    for (var i = 1; i < this.length; i++) {
        var intervalSize = this.cf[i].intervalSize(this.cf[i-1]);
        intervalUsage[intervalSize]++;
        if (intervalSize > 3) {
            noteWeights[this.cf[i].sciPitch] += INTERVAL_WEIGHTS[intervalSize];
        }
    }
    this.intervalUsage = intervalUsage;
    this.leaps = intervalUsage[4] + intervalUsage[5] + intervalUsage[6] + intervalUsage[8];

    // calculate mean for note weights
    var totalWeight = 0;
    for (var note in noteWeights)
        totalWeight += noteWeights[note];
    noteWeights.mean = totalWeight / this.range;  // use range to include notes that must be used but have not been used yet
    Object.defineProperty(noteWeights, "mean", {enumerable: false });
    // calculate variance and standard deviation for note weight
    var weightVariance = 0;
    for (var note in noteWeights)
        weightVariance += Math.pow(noteWeights[note] - noteWeights.mean, 2);
    // add unused notes to variance
    weightVariance += (this.range - this.uniqueNotes) * Math.pow(0 - noteWeights.mean, 2);
    noteWeights.variance = weightVariance;
    Object.defineProperty(noteWeights, "variance", {enumerable: false });
    noteWeights.stdDeviation = Math.sqrt(weightVariance);
    Object.defineProperty(noteWeights, "stdDeviation", {enumerable: false });
    this.noteWeights = noteWeights;

    // build timesNotesUsed array
    // timesNotesUsed[2] = 3 ...  Three unique notes have been used twice
    var timesNotesUsed = [];
    for (var note in this.noteUsage) {
        if (timesNotesUsed[this.noteUsage[note]])
            timesNotesUsed[this.noteUsage[note]] += 1;
        else
            timesNotesUsed[this.noteUsage[note]] = 1;
    }
    this.timesNotesUsed = timesNotesUsed;
    this.melodicOutlines = melodicOutlines(cantus);
    this.lastOutlineLength = this.melodicOutlines[this.melodicOutlines.length - 1].length;
    this.startOfLastOutline = this.melodicOutlines[this.melodicOutlines.length - 1][0];
    this.hasClimax = this.noteUsage[this.highestNote] == 1;

    // calculate last interval (return null if length <= 1)
    var lastInterval;
    if (this.length <= 1)
        lastInterval = null;
    else 
        lastInterval = this.cf[this.length - 1].intervalSize(this.cf[this.length - 2]);
    this.lastInterval = lastInterval;

    // determine previous direction
    var isAscending;
    if (this.length <= 1)
        isAscending = null;
    else
        isAscending = this.cf[this.length - 1].isHigher(this.cf[this.length - 2]);
    this.isAscending = isAscending;
    this.outlinedInterval = this.startOfLastOutline.interval(this.cf[this.length - 1]);
    this.outlinedIntervalSize = this.startOfLastOutline.intervalSize(this.cf[this.length - 1]);
}



// builds an array of arrays representing melodic outlines in cantus firmus
// argument is a CantusFirmus object
function melodicOutlines(cantus) {
    var cf = cantus.cf;
    // if only one note, return it as the only 'outline'
    if (cf.length == 1)
        return [cf];
    // first, find all pairs of notes that change direction
    var directionChanges = [0]; // all direction changes plus first and last notes
    var previousDirection = cf[0].isLower(cf[1]);
    for (var i = 2; i < cf.length; i++) {
        var direction = cf[i - 1].isLower(cf[i]);
        if (direction !== previousDirection) {
            // add i - 1 twice because it is both the end and the beginning of an outline
            directionChanges.push(i - 1, i - 1);
            previousDirection = direction;
        }
    }
    directionChanges.push(cf.length - 1); // add last note

    // now, build output arrays using directionChange indices
    var melodicOutlines = [];
    for (var i = 0; i < directionChanges.length; i += 2) {
        var outline = [];
        for (var j = directionChanges[i]; j <= directionChanges[i+1]; j++) {
            outline.push(cf[j]);
        }
        melodicOutlines.push(outline);
    }
    return melodicOutlines;
}

// helper function that returns a NEW sorted array of notes from low to high
function sortNoteArray(noteArray) {
    var sorted = noteArray.slice(0); // make a copy of array
    return sorted.sort(function noteCompare(a, b) {
        if (a.isLower(b))
            return -1;
        if (a.isHigher(b))
            return 1;
        return 0;
    });
}

module.exports = CFstats;
},{"./CantusFirmus.js":2}],2:[function(require,module,exports){
var Key = require('./Key.js');
var CFstats = require('./CFstats.js');

// cf is an array of Pitches 
// key is a Key or  a string representing mode name (if mode name, assume first pitch of cf is tonic) 
function CantusFirmus(cf, key) {
    this.cf = cf;
    if (!(key instanceof Key)) {
        if (typeof key != "string" || !(key.toLowerCase() in Key.MODES))
            throw new Error("Invalid key argument: " + key);
        key = new Key(this.cf[0], key);
    }
    this.key = key;
    this.length = this.cf.length;
}

// constants used to calculate nextNoteChoices
var MELODIC_INTERVALS = ['m2','M2','m3','M3','P4','P5','m6','M6','P8']; // consonant melodic intervals
var INTERVAL_CHOICES = [2, 3, 4, 5, 6, 8];
var LEAP_SIZE = 4;   // minimum interval defined as a leap
var INTERVALS_AFTER_LEAP = [2, 3];
var MAX_OUTLINE_LENGTH = 5;
var MAX_OUTLINED_INTERVAL = 8;

CantusFirmus.prototype = {
    constructor: CantusFirmus,

    toString: function() {
        return "CF: [" + this.cf + "]";
    },

    // returns a new CantusFirmus with the given note added to the end
    addNote: function(pitch) {
        var newCF = this.cf.slice(0); // make a copy of this array
        newCF.push(pitch);
        return new CantusFirmus(newCF, this.key);
    },

    // returns an array of possible next notes using basic horizontal rules
    // if there is only one note, add all intervals
    nextNoteChoices: function() {
        var noteChoices = [];
        var lastNote = this.cf[this.cf.length - 1];
        //  helper function to check all options 
        var formsValidInterval = function(pitch) {
            return MELODIC_INTERVALS.indexOf(lastNote.interval(pitch)) > -1;
        };

        // if only one note, add all possibilities
        if (this.cf.length == 1) {
            INTERVAL_CHOICES.forEach(function(interval) {
                var ascendingNote = this.key.intervalFromPitch(lastNote, interval);
                if (formsValidInterval(ascendingNote))
                    noteChoices.push(ascendingNote);
                var descendingNote = this.key.intervalFromPitch(lastNote, -interval);
                if (formsValidInterval(descendingNote))
                    noteChoices.push(descendingNote);
            }, this);
            return noteChoices.sort(noteCompare);
        }

        // if no stats have been computed, do it now
        if (!this.stats)
            this.stats = new CFstats(this);

        // blacklist notes should not be used
        var blackList = []; // an array of notes as strings in sciPitch 
        var inBlackList = function(pitch) {
            return blackList.indexOf(pitch.sciPitch) > -1;
        };
        var isValidNextNote = function(pitch) {
            return formsValidInterval(pitch) && !inBlackList(pitch);
        };

        // build black list
        // if last interval was 3 or 4, don't leap back to the same note
        if (this.length >= 2) { // avoids patterns such as 1 3 1 or 2 5 2
            if (this.stats.lastInterval == 3 || this.stats.lastInterval == 4)
                blackList.push(this.cf[this.length - 2].sciPitch);
        }
        // check for pattern of note groups of length 2 (such as 2 1 2 1)
        if (this.length >= 3) {
            if (this.cf[this.length - 3].equals(this.cf[this.length - 1]))
                blackList.push(this.cf[this.length - 2].sciPitch); // using this note would form pattern
        }
        // check for pattern of note groups of length 3 (such as 3 2 1 3 2 1)
        if (this.length >= 5) {
            if (this.cf[this.length - 5].equals(this.cf[this.length - 2])) {
                if (this.cf[this.length - 4].equals(this.cf[this.length - 1]))
                    blackList.push(this.cf[this.length - 3].sciPitch);
            }
        }

        var DIRECTION = 1;
        if (!this.stats.isAscending)
            DIRECTION *= -1; 

        // can change DIRECTION?             check for consonant outlined interval
        var canChangeDirection = MELODIC_INTERVALS.indexOf(this.stats.outlinedInterval) > -1;

        // if last interval was a leap, recover by changing direction
        if (this.stats.lastInterval >= LEAP_SIZE) {
            if (!canChangeDirection)
                return [];   // there are no possible routes from this cf, return empty array
            INTERVALS_AFTER_LEAP.forEach(function(interval) {
                var note = this.key.intervalFromPitch(lastNote, interval * -DIRECTION);
                if (isValidNextNote(note))
                    noteChoices.push(note);
            }, this);
            return noteChoices.sort(noteCompare);
        }
        
        // if no leaps and not first note, now find all possibilities
        if (canChangeDirection) {
            var intervalChoices = INTERVAL_CHOICES;
            // if last interval was 3, avoid forming triad
            if (this.stats.lastInterval == 3) {
                intervalChoices = [2, 4, 5, 6, 8];   // 3, 5, 6 form triads or patterns
            }
            intervalChoices.forEach(function(interval) {
                var note = this.key.intervalFromPitch(lastNote, interval * -DIRECTION);
                if (isValidNextNote(note))
                    noteChoices.push(note);
            }, this);
        }
        
        // can continue in same direction?   check outline length < 5
        var canContinueDirection = this.stats.lastOutlineLength < MAX_OUTLINE_LENGTH;
        if (canContinueDirection) {
            var intervalChoices = [2];                 // only moves by step if last interval was 3
            if (this.stats.lastInterval == 2) {
                if (this.stats.lastOutlineLength > 2)  // if already moving in same direction for > 2 notes
                    intervalChoices.push(3);           // no big leaps, only add 3
                else 
                    intervalChoices.push(3, 4, 5);   // else add 4 and 5 to possibilities 
            }
            intervalChoices.forEach(function(interval) {
                if (interval + this.stats.outlinedIntervalSize - 1 <= MAX_OUTLINED_INTERVAL) {
                    var note = this.key.intervalFromPitch(lastNote, interval * DIRECTION);
                    if (isValidNextNote(note))
                        noteChoices.push(note);
                }
            }, this);
        }
        return noteChoices.sort(noteCompare); // return sorted array of choices
    }
};

// helper function passed to note array sorter
function noteCompare(a, b) {
    if (a.isLower(b))
        return -1;
    if (a.isHigher(b))
        return 1;
    return 0;
}

module.exports = CantusFirmus;

},{"./CFstats.js":1,"./Key.js":3}],3:[function(require,module,exports){
var Pitch = require('./Pitch.js');

/***********************************************************************
* constructor arguments:
*     tonic: can be a Pitch (octave number does not matter), or a string 
*            representing a pitch class ('C', 'Bb')
*      mode: can be a string representing the name of a known mode 
*            ('major', 'dorian') or an array of intervals for a custom scale
* 
* Key.tonic = a String representing a pitch class ('C', 'Bb')
* Key.mode = a String representing the name of the mode ('major', 'custom scale')
* Key.modePattern = an Array with the interval pattern used for the scale
* Key.scaleDegrees = a Number representing the number of scale degrees in this scale
* Key.scale = an array of all pitch classes used in scale
* Key.leadingTone = a String representing the pitch class a m2 below tonic
* Key.letterAccidentals = object mapping letter names to letters with the appropriate accidental
* 
************************************************************************/

function Key(tonic, mode) {
    // parse tonic input to assign this.tonic
    if (tonic instanceof Pitch)
        this.tonic = tonic.pitchClass;
    else {
        var tonicName = /^([A-G])(b{1,2}|#{1,2})?/.exec(tonic);
        if (tonicName == null)
            throw new Error("Invalid tonic input to Key constructor: " + tonic);
        this.tonic = tonicName[0];
    }

    // parse mode input to assign this.mode and this.modePattern
    if (Array.isArray(mode)) {
        this.mode = "custom scale";
        this.modePattern = mode;
    }
    else {
        this.mode = mode.toLowerCase();
        if (!(this.mode in Key.MODES))
            throw new Error("Unknown mode name: " + mode);
        this.modePattern = Key.MODES[this.mode];
    }
    // determine number of scale degrees
    this.scaleDegrees = this.modePattern.length + 1;

    // build one cycle of the scale in an array in this.scale
    var scale = [this.tonic];
    this.modePattern.forEach(function(interval) {
        scale.push(new Pitch(scale[scale.length - 1]).plusInterval(interval).pitchClass);
    });
    this.scale = scale;

    // assign leading tone (the note a m2 below tonic)
    this.leadingTone = new Pitch(this.tonic).plusInterval('-m2').pitchClass;

    // letter to accidentals (builds a map of letter names that show the accidentals needed for each letter)
    var letterAccidentals = {};
    this.scale.forEach(function(pitch) {
        letterAccidentals[pitch[0]] = pitch;
    });
    this.letterAccidentals = letterAccidentals;
}

Key.prototype = {

    constructor: Key,

    toString: function() {
        return "Key of " + this.tonic + " " + this.mode + " [" + this.scale + "]";
    },

    // returns a Boolean if the given pitch is part of the key
    inKey: function(pitch) {
        return this.scale.indexOf(pitch.pitchClass) > -1;
    },

    // returns a Number (1-7) representing the scale degree of this pitch in key, or null if not in key
    scaleDegree: function(pitch) {
        if (!this.inKey(pitch))
            return null;
        return this.scale.indexOf(pitch.pitchClass) + 1;
    },

    // returns a String representing the pitch class 
    pitchAtScaleDegree: function(degree) {
        return this.scale[(degree - 1) % this.scaleDegrees];
    },

    // returns a new pitch with the appropriate accidental for the key
    addAccidental: function(pitch) {
        return new Pitch(this.letterAccidentals[pitch.letter] + String(pitch.octave));
    },

    // returns the Pitch the given interval size away from given pitch within scale
    intervalFromPitch: function(pitch, intervalSize) {
        return this.addAccidental(pitch.plusInterval(intervalSize));
    }
};

Key.MODES = {     // 1-2  2-3  3-4  4-5  5-6  6-7
        major:      ['M2','M2','m2','M2','M2','M2'],
        minor:      ['M2','m2','M2','M2','m2','M2'],
        dorian:     ['M2','m2','M2','M2','M2','m2'],
        phrygian:   ['m2','M2','M2','M2','m2','M2'],
        mixolydian: ['M2','M2','m2','M2','M2','m2'],
        lydian:     ['M2','M2','M2','m2','M2','M2'],
        hybridmajor:['M2','M2','m2','M2','m2','M2'],
        wholetone:  ['M2','M2','M2','M2','M2']             // need to test Key for scales without 7 scale degrees
    };

module.exports = Key;
},{"./Pitch.js":5}],4:[function(require,module,exports){
/************************************************************************
*  javascript adaptation of a Max Priority Queue from
*  Algorithms (4th edition) by Robert Sedgewick and Kevin Wayne
************************************************************************/

function MaxPQ(lessComparator) {
    var pq = [];                  // heap-ordered binary tree
    var N = 0;                    // number of items in priority queue
    // function(i, j) used to compare two keys.  Must answer the question, is i less than j?
    var isLess = lessComparator;

    // compare the items at indices i and j
    function less(i, j) {
        return isLess(pq[i], pq[j]);
    }
    // exchange two items in the priority queue
    function exch(i, j) {
        var t = pq[i];
        pq[i] = pq[j];
        pq[j] = t;
    }
    // moves item at index k up the priority queue to its appropriate place
    function swim(k) {
        while (k > 1 && less(Math.floor(k/2), k)) {
            exch(Math.floor(k/2), k);
            k = Math.floor(k/2);
        }
    }
    // moves item at index k down the priority queue to its appropriate place
    function sink(k) {
        while (2*k <= N) {
            var j = 2*k;
            if (j < N && less(j, j+1))  // choose the larger of k's children
                j++;
            if (!less(k, j))            // k is now in the correct position
                break;
            exch(k, j);
            k = j;
        }
    }

    this.isEmpty = function() {
        return N == 0;
    };

    this.size = function() {
        return N;
    };

    // inserts a key in its appropriate place in the queue
    this.insert = function(v) {
        N++;
        pq[N] = v;
        swim(N);
    };

    // deletes and returns the max key
    this.delMax = function() {
        exch(1, N);
        var max = pq.pop(N);
        N--;
        sink(1);
        return max;
    };
}

module.exports = MaxPQ;
},{}],5:[function(require,module,exports){
/***********************************************************************
*  Pitch is an immutable data type which represents a specific pitch. 
*  Pitch instances have the following properties:
*
*  Pitch.sciPitch      -- 'C4' 'C#3' 'Eb6' 'F##3' 'C0'
*  Pitch.pitchClass    -- 'C'  'C#'  'Eb'  'F##'  'C'
*  Pitch.letter        -- 'C'  'C'   'E'   'F'    'C'
*  Pitch.octave        --  4    3     6     3      0
*  Pitch.accidental    --  0    1    -1     2      0
*  Pitch.absolutePitch --  60   49    87    55     12
*
*  Required input format: a string in sciPitch format as above. 
*  n.b. ## = double sharp; bb = double flat
*  n.b. Letter name must be capitalized.
*  n.b. if no Octave Number is provided, the constructor assigns octave 4
*
************************************************************************/

// number of halfsteps each letter is from C
var HALFSTEPS_FROM_C = {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};

// order of note letter names in an octave cycle
var LETTER_ORDER = ['C', 'D', 'E','F','G','A','B'];

// Map of interval quality, given first size then number of half steps
// INTERVAL_QUALITY[intervalSize][semitonesTo] = quality
// P = perfect, m = minor, M = major, d = diminished, A = augmented
var INTERVAL_QUALITY = {
    '1': { '0': 'P', '1': 'A','11': 'd'}, // 11 is for diminished octaves when calculating from the simple interval.
    '2': { '0': 'd', '1': 'm', '2': 'M', '3': 'A'},
    '3': { '2': 'd', '3': 'm', '4': 'M', '5': 'A'},
    '4': { '4': 'd', '5': 'P', '6': 'A'},
    '5': { '6': 'd', '7': 'P', '8': 'A'},
    '6': { '7': 'd', '8': 'm', '9': 'M','10': 'A'},
    '7': { '9': 'd','10': 'm','11': 'M', '0': 'A'}, // A7 is 0 instead of 12 b/c interval uses mod 12
    '8': {'11': 'd','12': 'P','13': 'A'}
};

var PERFECT_INTERVALS   = [1, 4, 5, 8];
var IMPERFECT_INTERVALS = [2, 3, 6, 7];
var PERFECT_INTERVAL_RELATIONS   = {d: -1, P:  0, A: 1};
var IMPERFECT_INTERVAL_RELATIONS = {d: -2, m: -1, M: 0, A: 1};

var ACCIDENTAL_FROM_HALFSTEPS = {'-2': 'bb', '-1': 'b', '0':'', '1': '#', '2': '##'};

function Pitch(pitch) {
    var elements = /^([A-G])(b{1,2}|#{1,2})?(\d{1,2})?$/.exec(pitch);
    // [0]= scientific pitch, [1]= letter, [2]= accidentals, [3]= octaveNumber

    if (elements == null)
        throw new Error("Invalid input to Pitch constructor: " + pitch);
    // if no octave number is provided, arbitrarily assign 4 to octave number 
    if (!elements[3])
        elements[3] = 4;
    
    // calculate number of half steps using accidentals
    if (!elements[2]) 
        elements[2] = "";
    var halfSteps= elements[2].length;               // number of half steps equals number of accidentals
    if (halfSteps > 0 && elements[2][0] === "b")
        halfSteps*= -1;                              // flats

    this.sciPitch      = elements[0];
    this.letter        = elements[1];
    this.pitchClass    = elements[1] + elements[2];
    this.octave        = Number(elements[3]);
    this.accidental    = halfSteps;
    // a number representing absolute pitch. Also, could be used as a MIDI number with C4 equal to 60.
    this.absolutePitch = HALFSTEPS_FROM_C[this.letter] +   // start with number of half steps from C
                           (12 * (this.octave + 1)) +      // add 12 half steps per octave. Add one to octave num so C4 = 60        
                           this.accidental;                // add or subtract accidental
    Object.freeze(this); 
}

Pitch.prototype = {
    constructor: Pitch,

    toString: function() {
        return this.sciPitch;
    },

    // returns a boolean
    equals: function(that) {
        return this.sciPitch == that.sciPitch;
    },

    // returns a boolean, does this *sound* lower than that?
    isLower: function(that) {
        return this.absolutePitch < that.absolutePitch;
    },

    // returns a boolean, does this *sound* higher than that? 
    isHigher: function(that) {
        return this.absolutePitch > that.absolutePitch;
    },

    // returns a boolean indicating if two notes sound the same
    isEnharmonic: function(that) {
        return this.absolutePitch == that.absolutePitch;
    },

    // returns a number, the halfsteps between two Pitches
    semitonesTo: function(that) {
        return Math.abs(this.absolutePitch - that.absolutePitch);
    },

    // returns a number, the interval size between these two notes
    intervalSize: function(that) {
        // add 1 for 1-based numbering, multiply octave difference by 7 for seven notes per octave cycle
        return 1 + Math.abs(LETTER_ORDER.indexOf(this.letter) - LETTER_ORDER.indexOf(that.letter) + 7 * (this.octave - that.octave));
    },

    // returns a number, the simple interval size (1-7) between these two notes
    // n.b. contrary to standard practice, an octave is considered compound and reduced to 1
    simpleIntervalSize: function(that) {
        // subtract 1 to switch to 0-based numbering then add it back after removing 7 notes per octave
        return ((this.intervalSize(that) - 1) % 7) + 1;
    },

    // returns a string representing the interval between these two notes
    interval: function(that) {
        // for quality lookup, use simple interval and simplify semitonesTo to within an octave (%12).  Add full intervalSize back.
        return INTERVAL_QUALITY[this.simpleIntervalSize(that)][this.semitonesTo(that) % 12] + String(this.intervalSize(that));
    },

    // returns a string representing the interval between two notes reduced to less than an octave
    // n.b. contrary to standard practice, an octave is considered compound and reduced to 1
    simpleInterval: function(that) {
        return INTERVAL_QUALITY[this.simpleIntervalSize(that)][this.semitonesTo(that) % 12] + String(this.simpleIntervalSize(that));
    },

    // returns a new Pitch by adding a given interval
    // this function accepts positive or negative intervals, with or without quality
    // if quality is not provided, accidentals on Pitch will be ignored
    // argument interval examples: M2, -m10, P4, d7, -A5, 2, -5, 7
    plusInterval: function(interval) {
        // if perfect unison, return a copy of this pitch
        if (interval == "P1" || interval == "-P1")
            return new Pitch(this.sciPitch);

        // if requested interval was Augmented Unison, add or subtract an accidental
        if (interval == "A1")
            return new Pitch(this.letter + ACCIDENTAL_FROM_HALFSTEPS[this.accidental + 1] + String(this.octave));
        if (interval == "-A1")
            return new Pitch(this.letter + ACCIDENTAL_FROM_HALFSTEPS[this.accidental - 1] + String(this.octave));

        if (typeof interval == "number")
            String(interval);

        var elements = /(-)?([dmMAP])?(\d{1,2})$/.exec(interval);
        // [0]= interval, [1]= sign, [2]= quality, [3]= size
        if (elements == null)
            throw new Error("Invalid input to plusInterval: " + interval);

        // calculate new note using only size
        var sizeChange   = Number(elements[3]) - 1;      // change to zero-based from 1-based
        var octaveChange = Math.floor(sizeChange / 7);   // extract octaves from interval size
        var letterChange = sizeChange % 7;
        if (elements[1]) {                               // if sign is present, make sizeChange negative
            letterChange *= -1;
            octaveChange *= -1;
        }
        var letterIndex = LETTER_ORDER.indexOf(this.letter) + letterChange;

        // if the interval crossed over an octave cycle, extract before looking up letter
        if (letterIndex < 0) {
            letterIndex +=7;
            octaveChange -= 1;
        }
        if (letterIndex >= 7) {
            letterIndex -= 7;
            octaveChange += 1;
        }
        var newPitch = new Pitch(LETTER_ORDER[letterIndex] + String(this.octave + octaveChange));

        // if no quality was requested, return now
        if (!elements[2])
            return newPitch;

        // interval quality was given, so determine accidental(s) for new pitch
        var desiredQuality = elements[2];
        var currentQuality = this.interval(newPitch)[0];   // take first character of interval for quality
        if (PERFECT_INTERVALS.indexOf(this.simpleIntervalSize(newPitch)) > -1) 
            var halfstepAdjustment = PERFECT_INTERVAL_RELATIONS[desiredQuality] - PERFECT_INTERVAL_RELATIONS[currentQuality];
        else 
            var halfstepAdjustment = IMPERFECT_INTERVAL_RELATIONS[desiredQuality] - IMPERFECT_INTERVAL_RELATIONS[currentQuality];
        
        // Check for sign. If interval is descending, adding sharps will decrease interval size
        if (elements[1])    
            halfstepAdjustment *= -1;
        return new Pitch(newPitch.letter + ACCIDENTAL_FROM_HALFSTEPS[halfstepAdjustment] + String(newPitch.octave));
    }
};

module.exports = Pitch;
},{}],6:[function(require,module,exports){
// a LIFO stack

function Stack() {
    var N = 0;
    var first = null;

    function Node(item) {
        this.item = item;
        this.next = null;
    }

    this.isEmpty = function() {
        return N == 0;
    };

    this.size = function() {
        return N;
    };

    // adds item to the stack
    this.push = function(item) {
        var oldfirst = first;
        first = new Node(item);
        first.next = oldfirst;
        N++;
    };

    // removes and returns the last item added to stack
    this.pop = function() {
        if (this.isEmpty())
            throw new Error("Cannot pop item from empty stack.");
        var item = first.item;
        first = first.next;
        N--;
        return item;
    };

    // returns the last item added to stack without removing it
    this.peek = function() {
        if (this.isEmpty())
            throw new Error("Cannot peek item on empty stack.");
        return first.item;
    };

    // returns a string of items in LIFO order
    this.toString = function() {
        if (this.isEmpty())
            return "[empty stack]";
        var s = "" + first.item;
        var cur = first.next;
        while(cur !== null) {
            s += " " + cur.item;
            cur = cur.next;
        }
        return s;
    };
}

module.exports = Stack;
},{}],7:[function(require,module,exports){
// data type that supports randomly choosing from a collection of items with weights

function WeightedBag() {
    var N = 0;
    var totalWeight = 0;
    var items = [];
    var itemWeights = [];

    this.isEmpty = function() {
        return N == 0;
    };

    this.size = function() {
        return N;
    };

    this.toString = function() {
        if (this.isEmpty())
            return "[empty WeightedBag]";
        var s = "" + items[0] + "(" + itemWeights[0] + ")";
        for (var i = 1; i < N; i++)
            s += ", " + items[i] + "(" + (itemWeights[i]-itemWeights[i-1]) + ")";
        return s;
    }

    // adds item to bag with given weight
    this.add = function(item, weight) {
        totalWeight += weight;
        items.push(item);
        itemWeights.push(totalWeight);
        N++;
    };

    // returns an index of item selected randomly using weights
    function select() {
        return search(Math.random() * totalWeight);
    };

    // returns the index of smallest weight that is greater than or equal to selection
    function search(key) {
        var lo = 0;
        var hi = N - 1;
        while (hi != lo) {
            var mid = lo + Math.floor((hi - lo) / 2);
            if (key < itemWeights[mid])
                hi = mid;
            if (key >= itemWeights[mid])
                lo = mid + 1;
        }
        return hi;
    } 

    // pulls a random item out of the bag without removing it
    this.peek = function() {
        return items[select()];
    };

    // removes a random item from the bag and returns it
    this.remove = function() {
        var i = select();
        var item = items[i];        // save item
        items.splice(i, 1);         // remove item from items list
        var iWeight;
        if (i == 0)
            iWeight = itemWeights[i];
        else 
            iWeight = itemWeights[i] - itemWeights[i - 1];
        totalWeight -= iWeight;     // subtract this items weight from totalWeights
        for (var j = i + 1; j < N; j++)
            itemWeights[j] -= iWeight;
        itemWeights.splice(i, 1);   // remove item from itemWeights
        N--;
        return item;
    };
}

module.exports = WeightedBag;
},{}],8:[function(require,module,exports){
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
    2: 4,
    3: 4,
    4: 3,
    5: 4,
    6: 4,
    8: 1,
    '-2': 3,
    '-3': 1,
    '-4': 3,
    '-5': 1,
    '-6': 3,
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
    var cfs = new MaxPQ(cfRatingIsLess);  // stack with partially built Cantus Firmi
    cfs.insert(startCF);


    var stackPopNumber = 0;
    var cfsPulled = [];
    var candidateCFs = []; 
    console.log("   startCF = " + startCF);
    console.log("goalLength = " + goalLength);
    console.log("  maxRange = " + maxRange);
    var NUMBER_CF_TO_BUILD = 3;
    while(!cfs.isEmpty() && candidateCFs.length < NUMBER_CF_TO_BUILD) {
        var cf = cfs.delMax();                 // take the top option off the stack
        var lastNote = cf.cf[cf.length - 1];

        // bug checking ************
        cfsPulled.push(cf);
        console.log("\n" + stackPopNumber++);
        console.log(String(cf));
        console.log("priority score = " + calculatePriority(cf));
        // end bug checking ********

        // if this is the first note, add all possible choices and continue
        if (cf.length == 1) {
            var bag = new WeightedBag();
            for (var intervalName in INTERVAL_WEIGHT_AT_START) {
                var interval = Number(intervalName);
                if (goalLength < 10) {
                    if (interval == 8 || interval == -8)
                        continue;  // don't add octave because there is not room to complete it
                }
                var note = cf.key.intervalFromPitch(lastNote, interval);
                bag.add(note, INTERVAL_WEIGHT_AT_START[interval]);
            }
            var nextNoteStack = new Stack();
            // NOTE trying to only add one second note for more variety in results
            cfs.insert(cf.addNote(bag.remove()));
            continue;
        }

        cf.stats = new CFstats(cf);         // build and attach stats for this cf 

        // build helper functions for checking if note is possible
        var formsValidInterval = function(pitch) {
            return MELODIC_INTERVALS.indexOf(lastNote.interval(pitch)) > -1;
        };
        var maxNote = cf.key.intervalFromPitch(cf.stats.lowestNote,   maxRange);
        var minNote = cf.key.intervalFromPitch(cf.stats.highestNote, -maxRange);
        // if highest note is currently repeated, leave room for climax by raising minNote by a step
        if (cf.stats.noteUsage[cf.stats.highestNote.sciPitch] > 1) {
            minNote = cf.key.intervalFromPitch(minNote, 2);
            if (cf.length == goalLength - 1) // if this is the end, there is no climax so it won't work
                continue;
        }
        //console.log("maxNote: " + maxNote);
        //console.log("minNote: " + minNote);
        // function used to test if potential note is in range
        var inRange = function(pitch) {
            if (pitch.isLower(maxNote) && pitch.isHigher(minNote))
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
        if (goalLength - cf.length > 1) { // if not last note
            // subtract 1 because all notes need to be used 1 before end since last note is tonic
            if (goalLength - cf.length - 1 <= cf.stats.range - cf.stats.uniqueNotes) {
                if (goalLength - cf.length - 1 < cf.stats.range - cf.stats.uniqueNotes)
                    continue; // it is not possible to use all notes in range now
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
        } else if (cf.stats.range - cf.stats.uniqueNotes != 0) {
            continue; // skip this option if all notes not used for last note
        }

        var direction = 1;
        if (!cf.stats.isAscending)
            direction *= -1; 
        var nextNoteChoices = new Stack();
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
            while (!bag.isEmpty())
                nextNoteChoices.push(bag.remove());
        }
        else {
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
                //console.log("Bag of Direction Change Choices:\n" + bag);
                while (!bag.isEmpty())
                    directionChangeStack.push(bag.remove());
            }

            if (continueDirection) {
                var intervalChoices = [2];               // only moves by step if last interval was > 2
                if (cf.stats.lastInterval == 2) {
                    if (cf.stats.lastOutlineLength > 2)  // if already moving in same direction for > 2 notes
                        intervalChoices.push(3);         // no big leaps, only add 3
                    else 
                        intervalChoices.push(3, 4, 5);   // else add 4 and 5 to possibilities 
                }
                var bag = new WeightedBag();
                intervalChoices.forEach(function(interval) {
                    // new outlined interval must be within an octave (8)
                    if (interval + cf.stats.outlinedIntervalSize - 1 <= 8) {
                        var newNote = cf.key.intervalFromPitch(lastNote, interval * direction);
                        if (isValidNextNote(newNote))
                            bag.add(newNote, INTERVAL_WEIGHT_SAME_DIRECTION[interval]);
                    }
                });
                //console.log("Bag of Same Direction Choices:\n" + bag);
                while (!bag.isEmpty())
                    sameDirectionStack.push(bag.remove());
            }

            // flip a coin to see whether to change direcion first or continue first
            if (Math.random() < CONTINUE_DIRECTION_PROBABILITY) {
                while (!sameDirectionStack.isEmpty())
                    nextNoteChoices.push(sameDirectionStack.pop());
                while (!directionChangeStack.isEmpty())
                    nextNoteChoices.push(directionChangeStack.pop());
            }
            else {
                while (!directionChangeStack.isEmpty())
                    nextNoteChoices.push(directionChangeStack.pop());
                while (!sameDirectionStack.isEmpty())
                    nextNoteChoices.push(sameDirectionStack.pop());
            }
        }
        // check if next note is penultimate 
        if (cf.length == goalLength - 2) {
            // penultimate note must be scale degree 2
            var scaleDegree2 = cf.key.intervalFromPitch(cf.cf[0], 2);
            while (!nextNoteChoices.isEmpty()) {
                if (nextNoteChoices.pop().equals(scaleDegree2))
                    cfs.insert(cf.addNote(scaleDegree2));
            }
            continue;   // if not present, end search from this route
        }

        // check if next note is the last note
        if (cf.length == goalLength - 1) {
            // final note must be scale degree 1
            var scaleDegree1 = cf.cf[0];
            while (!nextNoteChoices.isEmpty()) {
                if (nextNoteChoices.pop().equals(scaleDegree1)) {
                    // log all cfs pulled for error checking **********
                    cfsPulled.forEach(function(cf, index) {
                        //console.log(index + ": " + cf);
                    });
                    // end error checking *****************************
                    candidateCFs.push(cf.addNote(scaleDegree1));            // cf is built!
                }
            }
            continue;  // if not present, end search from this route
        }
        var notesAdded = [];
        // add all possibilities to cfs stack
        while (!nextNoteChoices.isEmpty()) {
            var nextNote = nextNoteChoices.pop();
            notesAdded.push(nextNote);
            cfs.insert(cf.addNote(nextNote));
        }
        //console.log("NextNoteChoices: " + notesAdded);
        //console.log("      BlackList: " + blackList);
        //console.log("\n");
    }
    var NUMBER_SELECTIONS_TO_LOG = 10;
    if (NUMBER_SELECTIONS_TO_LOG > NUMBER_CF_TO_BUILD)
        NUMBER_SELECTIONS_TO_LOG = NUMBER_CF_TO_BUILD;
    console.log("\n\n*********************SELECTIONS*********************");
    for (var i = 0; i < NUMBER_SELECTIONS_TO_LOG; i++) {
        console.log("cf " + i + ": " + candidateCFs[i]);
        console.log("         priority = " + calculatePriority(candidateCFs[i]));
    }
    
    console.log("\n\n**************SORTED SELECTIONS*********************");
    candidateCFs.sort(sortByPriority);
    for (var i = 0; i < NUMBER_SELECTIONS_TO_LOG; i++) {
        console.log("cf " + i + ": " + candidateCFs[i]);
        console.log("         priority = " + calculatePriority(candidateCFs[i]));
    }
    return candidateCFs[0];
    // throw new Error("No CF was possible."); // if stack of possibilities is empty
}

// heuristic comparator function passed to MaxPQ to compare cfs
function cfRatingIsLess(a, b) {
    if (!a.priority)
        a.priority = calculatePriority(a);
    if (!b.priority)
        b.priority = calculatePriority(b);
    return a.priority < b.priority;
}

// heuristic used to decide how good (balanced) a cf is
function calculatePriority(cf) {
    if (!cf.stats)
        cf.stats = new CFstats(cf);

    //console.log("*** calculating Priority for " + cf);
    var score = cf.length;
    //console.log("set score equal to length: " + score);
    // penalty for high standard deviation of note weight
    if (cf.stats.noteWeights.stdDeviation > 1 && cf.length > 2)
        score -= (cf.stats.noteWeights.stdDeviation - 1) * cf.length;
    //console.log("stdDeviation of noteWeights = " + cf.stats.noteWeights.stdDeviation);
    //console.log("score = " + score);
    
    // penalty if seconds are not at least 54% of intervals
    if (cf.length > 3) {
        var desiredSeconds = (cf.length - 1) / 1.85;
        if (cf.stats.intervalUsage[2] < desiredSeconds)
            score -= desiredSeconds - cf.stats.intervalUsage[2];
        //console.log("desiredSeconds = " + desiredSeconds + " and actual seconds = " + cf.stats.intervalUsage[2]);
        //console.log("score = " + score);
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

    /*
    // directions should be relatively balanced
    if (cf.length > 6) {
        var directions = this.directionStats();
        var offBalance = Math.abs(directions.up - directions.down) - 2;
        score -= offBalance * (cfLength / 8);
    }
    */
    return score;
}

// highest priority first
function sortByPriority(a, b) {
    if (!a.priority)
        a.priority = calculatePriority(a);
    if (!b.priority)
        b.priority = calculatePriority(b);
    if (a.priority > b.priority)
        return -1;
    if (a.priority < b.priority)
        return 1;
  return 0;
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
},{"./CFstats.js":1,"./CantusFirmus.js":2,"./MaxPQ.js":4,"./Pitch.js":5,"./Stack.js":6,"./WeightedBag.js":7}],9:[function(require,module,exports){
var buildCF = require('../buildCF.js');

// returns a Vex.Flow.StaveNote whole note
function translateToVexNote(pitch) {
    var duration = "w" // all whole notes for now
    var keys = pitch.pitchClass.toLowerCase() + "/" + pitch.octave;
    var vexNote;
    if (pitch.accidental === 0) {
        vexNote = new Vex.Flow.StaveNote({ keys: [keys], duration: duration});
    }
    else {
        var pitchElements = /([A-G])(b{1,2}|#{1,2})/.exec(pitch.pitchClass);
        var accidental = pitchElements[2];
        vexNote = new Vex.Flow.StaveNote({ keys: [keys], duration: duration}).
            addAccidental(0, new Vex.Flow.Accidental(accidental));
    }
    return vexNote;
}

function displayVexflow(cf, canvas) {
    var clef = "treble";
    var canvasWidth = canvas.scrollWidth;
    var renderer = new Vex.Flow.Renderer(canvas,
    Vex.Flow.Renderer.Backends.CANVAS);

    var ctx = renderer.getContext();
    var stave = new Vex.Flow.Stave(10, 0, canvasWidth - 20);
    stave.addClef(clef).setContext(ctx).draw();
    var notes = [];
    for (var i = 0; i < cf.length; i++) {
        notes.push(translateToVexNote(cf.cf[i]));
    }
    var voice = new Vex.Flow.Voice({
        num_beats: cf.length,
        beat_value: 1,
        resolution: Vex.Flow.RESOLUTION
    });
    // Add notes to voice
    voice.addTickables(notes);
    // Format and justify the notes to 600 pixels
    var formatter = new Vex.Flow.Formatter().
    joinVoices([voice]).format([voice], canvasWidth - 60);
    // Render voice
    voice.draw(ctx, stave);
}

// select canvas
var canvas = document.body.getElementsByTagName("canvas")[0];
// check to see if canvas is bigger than window
if (canvas.scrollWidth > window.innerWidth) {
    console.log("updading canvas width");
    console.log("from " + canvas.width);
    canvas.width = window.innerWidth;
    console.log("to  " + canvas.width);
}

var cf = buildCF();
console.log("final cf: " + cf);
displayVexflow(cf, canvas);

console.log("canvas.width = " + canvas.width);
console.log("window.innerWidth = " + window.innerWidth);

},{"../buildCF.js":8}]},{},[9]);
