var CantusFirmus = require('./CantusFirmus.js');
var Pitch = require('./Pitch.js');

// default choices to be used if not provided to constructor
var defaultTonics = ["G4", "F4", "A4"];
var defaultModes = ["major", "minor", "dorian", "mixolydian"];
var defaultMinLength = 8;
var defaultMaxLength = 16;
var defaultMaxRange = 10;

function CFbuilder(startCF, goalLength, maxRange) {
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

    // add starting stats object
    // TODO analyze startingCF if longer than 1 note to build cfStats
}


function CFstats(cf) {
    this.cf = cf;
    this.sorted = sortNoteArray(cf);
    this.length = cf.length;
    this.highestNote = this.sorted[this.sorted.length - 1];
    this.lowestNote = this.sorted[0];
    this.range = this.lowestNote.intervalSize(this.highestNote);

    // build notes object
    var notes = {};
    this.sorted.forEach(function(pitch) {
        if (pitch.sciPitch in notes)
            notes[pitch.sciPitch] += 1;
        else
            notes[pitch.sciPitch] = 1;
    });

    this.notes = notes;
    this.uniqueNotes = Object.keys(this.notes).length;

    // build timesNotesUsed array
    // timesNotesUsed[2] = 3 ...  Three unique notes have been used twice
    var timesNotesUsed = [];
    for (var note in this.notes) {
        if (timesNotesUsed[this.notes[note]])
            timesNotesUsed[this.notes[note]] += 1;
        else
            timesNotesUsed[this.notes[note]] = 1;
    }
    this.timesNotesUsed = timesNotesUsed;
}

CFstats.prototype = {
    constructor: CFstats,
};


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