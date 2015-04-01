var Key   = require('../Key.js');
var Pitch = require('../Pitch.js');

var tonic = process.argv[2];
var mode = process.argv[3];

var key = new Key(tonic, mode);

console.log(Object.keys(Key.MODES));


console.log("     ToString: " + key);
console.log("      .tonic = " + key.tonic);
console.log("       .mode = " + key.mode);
console.log(".modePattern = " + key.modePattern);
console.log(".scaleDegrees= " + key.scaleDegrees);
console.log("      .scale = " + key.scale);
console.log(".leadingTone = " + key.leadingTone);
console.log(".letterAccidentals = " + key.letterAccidentals);
for (letter in key.letterAccidentals)
    console.log(letter + " -> " + key.letterAccidentals[letter]);

console.log("checking pitchAtScaleDegree:");
for (var i = 1; i < 16; i++)
    console.log("  " + i + ": " + key.pitchAtScaleDegree(i));

console.log("checking if white keys are in scale:")
var C_Major = new Key("C", "major");
C_Major.scale.forEach(function(note) {
    console.log(note + "        .inKey = " + key.inKey(new Pitch(note)));
    console.log(note + "  .scaleDegree = " + key.scaleDegree(new Pitch(note)));
    console.log(note + ".addAccidental = " + key.addAccidental(new Pitch(note)));
})

// test .intervalFromPitch
key.scale.forEach(function(note) {
    var currentNote = new Pitch(note);
    for (var i = 1; i <= 10; i++) {
        console.log(currentNote + " - " + i + " : " + key.intervalFromPitch(currentNote, -i));
    }
})

console.log("\nTesting input using a Pitch and Array in constructor");
var key = new Key(new Pitch(key.tonic + "4"), key.modePattern);

console.log("     ToString: " + key);
console.log("      .tonic = " + key.tonic);
console.log("       .mode = " + key.mode);
console.log(".modePattern = " + key.modePattern);
console.log(".scaleDegrees= " + key.scaleDegrees);
console.log("      .scale = " + key.scale);
console.log(".leadingTone = " + key.leadingTone);
console.log(".letterAccidentals = " + key.letterAccidentals);

