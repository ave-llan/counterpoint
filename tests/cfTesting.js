var CantusFirmus = require('../CantusFirmus');
var Pitch = require('../Pitch.js');

var cf = ['D4','E4','F4','C4','D4','F4','E4','G4','Bb3','C4','F4','E4','D4'];
cf.forEach(function(note, index) {
    cf[index] = new Pitch(note);
});

cantus = new CantusFirmus(cf, "minor");
console.log(".toString() = " + cantus);
console.log("this.cf = " + cantus.cf);
console.log("this.key = " + cantus.key);
console.log("this.length = " + cantus.length);
console.log("this.addNote(D5) = " + cantus.addNote(new Pitch("D5")));
