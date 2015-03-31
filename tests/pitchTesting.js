var Pitch = require('../Pitch.js');

note1 = new Pitch(process.argv[2]);
note2 = new Pitch(process.argv[3]);

// takes two pitches from the command line and does unit testing

console.log("Input 1 = " + process.argv[2]);
logPitchElements(note1);

console.log("\nInput 2 = " + process.argv[3]);
logPitchElements(note2);

console.log("\n...comparing pitches...");
comparePitches(note1, note2);

function logPitchElements(pitch) {
    console.log("  sciPitch: " + pitch.sciPitch);
    console.log("    letter: " + pitch.letter);
    console.log("pitchClass: " + pitch.pitchClass);
    console.log("octave num: " + pitch.octave);
    console.log("accidental: " + pitch.accidental);
    console.log(" abs Pitch: " + pitch.absolutePitch);
    console.log("toString check " + pitch);
}

function comparePitches(pitch1, pitch2) {
    console.log("            " + pitch1 + ".equals(" + pitch2 +") = " + pitch1.equals(pitch2));
    console.log("           " + pitch1 + ".isLower(" + pitch2 +") = " + pitch1.isLower(pitch2));
    console.log("          " + pitch1 + ".isHigher(" + pitch2 +") = " + pitch1.isHigher(pitch2));
    console.log("      " + pitch1 + ".isEnharmonic(" + pitch2 +") = " + pitch1.isEnharmonic(pitch2));
    console.log("       " + pitch1 + ".semitonesTo(" + pitch2 +") = " + pitch1.semitonesTo(pitch2));
    console.log("      " + pitch1 + ".intervalSize(" + pitch2 +") = " + pitch1.intervalSize(pitch2));
    console.log("" + pitch1 + ".simpleIntervalSize(" + pitch2 +") = " + pitch1.simpleIntervalSize(pitch2));
    console.log("          " + pitch1 + ".interval(" + pitch2 +") = " + pitch1.interval(pitch2));
    console.log("    " + pitch1 + ".simpleInterval(" + pitch2 +") = " + pitch1.simpleInterval(pitch2));
}