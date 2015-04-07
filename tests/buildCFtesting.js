var buildCF = require('../buildCF.js');
var CantusFirmus = require('../CantusFirmus.js');
var Pitch = require('../Pitch.js');
var CFstats = require('../CFstats.js');

console.log("Trying to build a CF with no arguments");
var cf = buildCF();
console.log("FINAL CF: ");
console.log(String(cf));
console.log("cf stats");
cf.stats = new CFstats(cf);
for (var prop in cf.stats)
    console.log(prop + ": " + cf.stats[prop]);
/*
var cf = ['D4','B4','A4','B4'];
cf.forEach(function(note, index) {
    cf[index] = new Pitch(note);
});

cantus = new CantusFirmus(cf, "major");

console.log("\n\n");
var goalLength = 9;
var cf = buildCF(cantus);
console.log("FINAL CF: ");
console.log(String(cf));
*/