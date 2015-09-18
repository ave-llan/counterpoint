var Pitch = require('./Pitch.js');
var Duration = require ('./Duration.js');

function Note(pitch, duration) {
    if (!pitch || pitch === "rest")
        pitch = "rest";
    else if (typeof pitch == "string")
        pitch = new Pitch(pitch);
    if (typeof duration == "number") {
        if (arguments.length == 3)
            duration = new Duration(arguments[1], arguments[2]);
        else
            duration = new Duration(arguments[1]);
    }
    this.pitch = pitch;
    this.duration = duration;
    Object.freeze(this); 
}

Note.prototype = {
    constructor: Note,

    toString: function() {
        return "{" + this.pitch + " " + this.duration + "}";
    },

    // returns a boolean
    equals: function(that) {
        return this.pitch.equals(that.pitch) && this.duration.equals(that.duration);
    }
};

module.exports = Note;