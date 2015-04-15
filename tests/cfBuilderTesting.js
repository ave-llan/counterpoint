var CantusFirmus = require('../CantusFirmus');
var Pitch = require('../Pitch.js');
var CFBuilder = require('../CFBuilder.js');

var cf = ['D4','E4','F4','C4','D4','F4','E4','G4','Bb3','C4','F4','E4','D4'];
var startcf = [];
cf.forEach(function(note, index) {
    cf[index] = new Pitch(note);
});

startcf.push(cf[0]);
var startcf = new CantusFirmus(startcf, "minor");
var currentBuilder = new CFBuilder(startcf, 13);

for (var i = 1; i < cf.length; i++) {
    console.log("curCF = " + currentBuilder);
    console.log("blackList = " + currentBuilder.blacklist(currentBuilder.cf));
    console.log("nextNoteChoices = " + currentBuilder.nextNoteChoices(currentBuilder.cf));
    currentBuilder.addNote(cf[i]);
}

