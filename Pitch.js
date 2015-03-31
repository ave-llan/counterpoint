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