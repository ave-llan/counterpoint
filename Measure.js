var Note = require('./Note.js');
var Duration = require("./Duration.js");

function Measure(beats, beatUnit) {
    this.beats = beats;
    this.beatUnit = beatUnit;
    this.capacity = new Duration(4 * beats, beatPulse); //beats * (4/beatPulse)
    this.length = new Duration(0);
}

Measure.prototype = {
    constructor: Measure,

    toString: function() {
    },

    timeSignature: function() {
        return this.beats + "/" + this.beatUnit;
    },

    spaceRemaining: function() {
        return this.capacity.minus(this.length);
    }

    addNote: function(note) {
        if (note.duration.greaterThan(this.spaceRemaining()))
            throw new Error("Not enough space in measure for " + note +". Remaining Space = " + this.spaceRemaining());
        
    }
}

module.exports = Measure;