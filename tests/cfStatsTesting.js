var CFstats = require('../CFstats.js');
var CantusFirmus = require('../CantusFirmus.js');
var Pitch = require('../Pitch.js');

var cf = ['D4','E4','F4','C4','D4','F4','E4','G4','Bb3','C4','F4','E4','D4'];
cf.forEach(function(note, index) {
    cf[index] = new Pitch(note);
});

cantus = new CantusFirmus(cf, "minor");

cantus.stats = new CFstats(cantus);

// log all properties
console.log("All properties of cfStats");
for (var prop in cantus.stats)
    console.log(prop + ": " + cantus.stats[prop]);

console.log("\nNoteUsage:")
for (var note in cantus.stats.noteUsage)
    console.log(note + ": " + cantus.stats.noteUsage[note]);

console.log("\nmelodicOutlines:")
cantus.stats.melodicOutlines.forEach(function(outline, num) {
    var output = "" + num + ":";
    outline.forEach(function(pitch) {
        output += " " + pitch;
    });
    console.log(output);
});