var Pitch = require('./Pitch.js');

MODES = {     // 1-2  2-3  3-4  4-5  5-6  6-7
    major:      ['M2','M2','m2','M2','M2','M2'],
    minor:      ['M2','m2','M2','M2','m2','M2'],
    dorian:     ['M2','m2','M2','M2','M2','m2'],
    phrygian:   ['m2','M2','M2','M2','m2','M2'],
    mixolydian: ['M2','M2','m2','M2','M2','m2'],
    lydian:     ['M2','M2','M2','m2','M2','M2'],
    hybridmajor:['M2','M2','m2','M2','m2','M2'],
    wholetone:  ['M2','M2','M2','M2','M2']             // need to test Key for scales without 7 scale degrees
};

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
        if (!(this.mode in MODES))
            throw new Error("Unknown mode name: " + mode);
        this.modePattern = MODES[this.mode];
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

module.exports = Key;