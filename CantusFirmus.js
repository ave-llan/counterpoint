var Pitch = require('./Pitch.js');
var Key = require('./Key.js');


// cf is an array of Pitches 
// key is a Key or  a string representing mode name (if mode name, assume first pitch of cf is tonic) 
function CantusFirmus(cf, key) {
    this.cf = cf;
    if (key instanceof Key)
        this.key = key;
    else {
        if (typeof key != "string" || !(key.toLowerCase() in Key.MODES))
            throw new Error("Invalid key argument: " + key);
        this.key = new Key(this.cf[0], key);
    }
    this.length = this.cf.length;
}

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
    }
};

module.exports = CantusFirmus;
