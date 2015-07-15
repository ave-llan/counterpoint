Generate interesting and well-balanced counterpoint following the strict rules of species counterpoint.

### What is Species Counterpoint?
[Species counterpoint](http://en.wikipedia.org/wiki/Counterpoint#Species_counterpoint) is a time-honored method for learning how to write two or more lines of music that work well together. Infamous for its many rules, species counterpoint applies restrictions on both the horizontal and vertical dimensions of music — meaning that each line must be balanced and harmonious not only by itself left to right, but also up and down between all the lines at any given moment. The result is a kind of musical sudoku puzzle in which every decision resonates out in multiple directions.

### Set up

To generate a cantus firmus using default values, call `buildCF()`:

```
var buildCF = require('../buildCF.js');
console.log(buildCF());
>>> CF: [G4,D5,C5,Bb4,A4,Bb4,F4,A4,G4,Eb5,C5,D5,C5,A4,G4]
```