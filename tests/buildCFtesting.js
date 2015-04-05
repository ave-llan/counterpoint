var buildCF = require('../buildCF.js');
var CantusFirmus = require('../CantusFirmus.js');
var Pitch = require('../Pitch.js');

console.log("Trying to build a CF with no arguments");
var cf = buildCF();

var cf = ['D4','B4','A4','B4'];
cf.forEach(function(note, index) {
    cf[index] = new Pitch(note);
});

cantus = new CantusFirmus(cf, "major");

console.log("\n\n");
var goalLength = 9;
var cf = buildCF(cantus);