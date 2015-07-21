Generate interesting and well-balanced counterpoint following the strict rules of species counterpoint.

### What is Species Counterpoint?
[Species counterpoint](http://en.wikipedia.org/wiki/Counterpoint#Species_counterpoint) is a time-honored method for learning how to write two or more lines of music that work well together. Infamous for its many rules, species counterpoint applies restrictions on both the horizontal and vertical dimensions of music — meaning that each line must be balanced and harmonious not only by itself left to right, but also up and down between all the lines at any given moment. The result is a kind of musical sudoku puzzle in which every decision resonates out in multiple directions.

### Basic Usage

To generate a cantus firmus using default values, call `buildCF()`:

```
var buildCF = require('../buildCF.js');
console.log(buildCF());
>>> CF: [G4,D5,C5,Bb4,A4,Bb4,F4,A4,G4,Eb5,C5,D5,C5,A4,G4]
```

### Music Library

#### Pitch
Pitch is an immutable data type which represents a specific pitch.

Pass the Pitch constructor a string representing a pitch to create a new Pitch:
`a = new Pitch('Bb4')`

The string is in scientific pitch notation: a capital letter + optional accidental (b or #) + optional octave number (defaults to 4 if not provided). Must match the regular expression `[A-G](b{1,2}|#{1,2})?(\d{1,2})?`.

C4 is [middle C](https://en.wikipedia.org/wiki/C_(musical_note)#Middle_C).

