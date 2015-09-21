Interactively generate interesting and well-balanced counterpoint following the strict rules of species counterpoint.  See a live example [here](http://johnleszczynski.com).

### What is Species Counterpoint?
[Species counterpoint](http://en.wikipedia.org/wiki/Counterpoint#Species_counterpoint) is a time-honored method for learning how to write two or more lines of music that work well together. Infamous for its many rules, species counterpoint applies restrictions on both the horizontal and vertical dimensions of music — meaning that each line must be balanced and harmonious not only by itself left to right, but also up and down between all the lines at any given moment. The result is a kind of musical sudoku puzzle in which every decision resonates out in multiple directions.

## Example
In this example we will build this cantus firmus in G major:
```
   [ 'G4', 'E5', 'D5', 'F#5','G5', 'B4', 'C5', 'A4', 'G4' ]
G5                            o
F#5                     o
E5          o
D5                o
C5                                        o
B4                                  o
A4                                              o
G4    o                                               o

      Do    La    Sol   Ti    Do    Mi    Fa    Re    Do
      1     6     5     7     1     3     4     2     1
```

Install the npm module.
```
npm install counterpoint
```

To generate a cantus firmus in G major:

```js
var CantusFirmus = require('counterpoint').CantusFirmus

var cantus = new CantusFirmus('G major')
```

See the next note choices. At the beginning we have to start with G, but after that it gets more interesting.
```js
cantus.choices()    => ['G']
cantus.addNote('G4')

cantus.choices()    => [ 'A4', 'B4', 'C5', 'D5', 'E5', 'G5',
                         'F#4', 'E4', 'G3', 'B3', 'C4', 'D4' ]

cantus.addNote('E5')
cantus.choices()    => [ 'D5', 'C5' ]  // choices are limited after a leap

cantus.addNote('D5')
cantus.choices()    => [ 'E5', 'F#5', 'G5', 'A5', 'B5',
                         'C5', 'B4', 'G4', 'A4' ]
cantus.addNote('F#5')
```

See what you've built so far:
```js
cantus.cf()         => [ 'G4', 'E5', 'D5', 'F#5' ]
```

The choices are filtered for standard cantus firmus rules: no choices are given that would extend the range beyond a 10th, augmented and diminsihed intervals are avoided, dissonant melodic outlines are avoided, and more.
```js

cantus.choices()    => [ 'G5', 'E5', 'F#4', 'A4', 'B4' ]

cantus.addNote('G5')
cantus.choices()    => [ 'A5', 'B5', 'F#5', 'E5', 'G4', 'B4', 'C5', 'D5' ]

cantus.addNote('B4')
```

You can also look ahead more than one note by giving `cantus.choices()` a number indicating the depth to search. If given a depth, it choices return an array of nDeep TreeNodes each with a `val` pointing to a pitch and `next` pointing to an array of more TreeNodes.
```js
cantus.choices()     => [ 'C5', 'D5' ]
cantus.choices(2)    =>
[
  {
    val: 'C5',
    next: [
      { val: 'D5',  next: [] },
      { val: 'E5',  next: [] },
      { val: 'G5',  next: [] },
      { val: 'B4',  next: [] },
      { val: 'A4',  next: [] },  // I will pick this path -> C5, A4
      { val: 'E4',  next: [] },
      { val: 'G4',  next: [] }
    ]
  },
  {
    val: 'D5',
    next: [
      { val: 'E5',  next: [] },
      { val: 'C5',  next: [] },
      { val: 'F#4', next: [] },
      { val: 'G4',  next: [] },
      { val: 'A4',  next: [] }
    ]
  }
]

cantus.addNote('C5')
cantus.addNote('A4')

cantus.choices()     => [ 'B4', 'D5', 'E5', 'F#5', 'A5', 'G4' ]
cantus.addNote('G4')
```

We have worked our way back to the starting tonic and can now check if this is a valid cantus firmus. It will be checked to make sure there is a unique climax note (G5 in our case) along with other standard checks.
```js
cantus.isValid()    => true
cantus.cf()         =>
   [ 'G4', 'E5', 'D5', 'F#5','G5', 'B4', 'C5', 'A4', 'G4' ]
```

## Docs
[View the api documentation here.](api.md)

## Development

Clone the git repository and install development dependencies:
```
git clone https://github.com/jrleszcz/computational-counterpoint.git
cd computational-counterpoint
npm install
```

To run eslint and tape tests:
```
npm test
```

To generate api documentation for [api.md](api.md):
```
npm run docs
```
