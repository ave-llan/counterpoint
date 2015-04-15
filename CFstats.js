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