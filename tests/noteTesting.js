var Note = require('../Note.js');

var pitch = process.argv[2];
var duration = process.argv[3].split("/");

if (duration.length == 1)
    duration[1] = 1;

var note = new Note(pitch, Number(duration[0]), Number(duration[1]));
console.log("note.pitch = " + note.pitch);
console.log("note.duration = " + note.duration);
console.log("" + note);