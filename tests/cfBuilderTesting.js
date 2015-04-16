var CantusFirmus = require('../CantusFirmus');
var Pitch = require('../Pitch.js');
var CFBuilder = require('../CFBuilder.js');


var builder = new CFBuilder();
console.log("CF goal length = " + builder.goalLength);
console.log("       CF mode = " + builder.cf.key.mode);
console.log("       CF tonic: " + builder.cf.cf[0]);
var cf = builder.buildCF();
console.log(String(cf));