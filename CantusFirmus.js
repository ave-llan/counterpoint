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
                if (formsValidInterval(note))
                    noteChoices.push(note);
            }, this);
            return noteChoices.sort(noteCompare);
        }
        
        // if no leaps and not first note, now find all possibilities
        if (canChangeDirection) {
            var intervalChoices = INTERVAL_CHOICES;
            // if last interval was 3, only move a second if changing direction
            if (this.stats.lastInterval == 3) {
                intervalChoices = [2, 4, 8];   // 3, 5, 6 form triads or patterns
            }
            intervalChoices.forEach(function(interval) {
                var note = this.key.intervalFromPitch(lastNote, interval * -DIRECTION);
                if (formsValidInterval(note))
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
                    if (formsValidInterval(note))
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
