var Pitch = require('../Pitch.js');

pitch = new Pitch(process.argv[2]);

for (var i = -10; i < 0; i++)
    console.log(pitch + " - " + (-i) + " = " + pitch.plusInterval(i));

for (var i = 1; i <= 10; i++)
    console.log(pitch + " + " + i + " = " + pitch.plusInterval(i));

var intervalTests = ['P1', 'A1', 'm2', 'M2', 'm3', 'M3', 'd4', 'P4', 'A4', 'd5', 'P5', 'A5', 
    'm6', 'M6', 'A6', 'd7', 'm7', 'M7', 'd8','P8', 'A8'];
console.log();
intervalTests.forEach(function(interval) {
    console.log(pitch + " - " + interval + " = " + pitch.plusInterval('-' + interval));
    console.log(pitch + " + " + interval + " = " + pitch.plusInterval(interval));
    console.log();
});
