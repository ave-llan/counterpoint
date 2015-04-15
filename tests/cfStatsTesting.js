var CFstats = require('../CFstats.js');
var CantusFirmus = require('../CantusFirmus.js');
var Pitch = require('../Pitch.js');

var cf = ['D4','E4','F4','C4','D4','F4','E4','G4','Bb3','C4','F4','E4','D4'];
// var cf = ['D4', 'A4', 'G4', 'A4', 'Bb4', 'F4', 'G4', 'E4','D4'];
// var cf = ['D4', 'B4', 'A4','C#5','D5','F#4','G4','E4','D4'];
// var cf = ['D4', 'E4', 'F#4','G4','A4', 'D4', 'E4','D4'];
cf.forEach(function(note, index) {
    cf[index] = new Pitch(note);
});

cantus = new CantusFirmus(cf, "minor");

cantus.stats = new CFstats(cantus);

// log all properties
console.log("All properties of cfStats");
for (var prop in cantus.stats)
    console.log(prop + ": " + cantus.stats[prop]);

console.log("\nNoteUsage:");
for (var note in cantus.stats.noteUsage)
    console.log(note + ": " + cantus.stats.noteUsage[note]);

console.log("\nNoteWeights:");
for (var note in cantus.stats.noteWeights)
    console.log(note + ": " + cantus.stats.noteWeights[note]);
console.log("        noteWeights.mean = " + cantus.stats.noteWeights.mean);
console.log("noteWeights.stdDeviation = " + cantus.stats.noteWeights.stdDeviation);
console.log("    noteWeights.variance = " + cantus.stats.noteWeights.variance);
console.log("...standard deviations from the mean");
for (var note in cantus.stats.noteWeights)
    console.log(note + ": " + (Math.abs((cantus.stats.noteWeights.mean - cantus.stats.noteWeights[note])) / 
                cantus.stats.noteWeights.stdDeviation));

console.log("\nintervalUsage:");
for (var interval in cantus.stats.intervalUsage)
    console.log(interval + ": " + cantus.stats.intervalUsage[interval]);

console.log("\nmelodicOutlines:");
cantus.stats.melodicOutlines.forEach(function(outline, num) {
    var output = "" + num + ":";
    outline.forEach(function(pitch) {
        output += " " + pitch;
    });
    console.log(output);
});