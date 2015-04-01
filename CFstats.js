var CantusFirmus = require('./CantusFirmus.js');

// takes a CantusFirmus as argument

function CFstats(cantus) {
    var cf = cantus.cf;
    this.cf = cf;
    this.sorted = sortNoteArray(cf);
    this.length = cf.length;
    this.highestNote = this.sorted[this.sorted.length - 1];
    this.lowestNote = this.sorted[0];
    this.range = this.lowestNote.intervalSize(this.highestNote);

    // build notes object
    var noteUsage = {};
    this.sorted.forEach(function(pitch) {
        if (pitch.sciPitch in noteUsage)
            noteUsage[pitch.sciPitch] += 1;
        else
            noteUsage[pitch.sciPitch] = 1;
    });

    this.noteUsage = noteUsage;
    this.uniqueNotes = Object.keys(this.noteUsage).length;

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