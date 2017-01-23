## Classes

<dl>
<dt><a href="#CantusFirmus">CantusFirmus</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#cfMachine">cfMachine</a> : <code>MusicMachine</code></dt>
<dd><p>A <a href="https://github.com/jrleszcz/music-machine/blob/master/api.md#MusicMachine">MusicMachine</a>
configured to create guides that generate Cantus Firmi</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#createCFguide">createCFguide([key], [maxRange], [maxLength])</a> ⇒ <code>GuidedMusicMachine</code></dt>
<dd><p>create a new GuidedMusicMachine configured with a Cantus Firmus grammar</p>
</dd>
<dt><a href="#foresightFilterGenerator">foresightFilterGenerator()</a></dt>
<dd><p>MusicMachine filter generator that filters out notes which
are OK in the moment but that preclude the creation of a valid CF.
For example, if maxRange is 8 and the cf goes down 8 from the first note,
there cannot be a climax as the cf must end on tonic again.</p>
</dd>
<dt><a href="#outlineFilter">outlineFilter()</a></dt>
<dd><p>MusicMachine filter that ensures valid melodic outlines (a group of notes that move in the same direction)</p>
</dd>
<dt><a href="#noLeapBackFilter">noLeapBackFilter()</a></dt>
<dd><p>MusicMachine filter that avoids leaping back to the same note after
leaving it via a leap (no 1 3 1)</p>
</dd>
<dt><a href="#patternFilter">patternFilter()</a></dt>
<dd><p>MusicMachine filter that avoids patterns of length 2 or 3
such as 1 2 1 2 or 1 2 3 1 2 3</p>
</dd>
<dt><a href="#prettyPrintCf">prettyPrintCf(cantusFirmus)</a> ⇒ <code>String</code></dt>
<dd><p>creates a simple tabular visualization of the cantus firmus</p>
</dd>
<dt><a href="#indexOfLastOutline">indexOfLastOutline(construction)</a> ⇒ <code>number</code></dt>
<dd><p>given an array of pitch strings, gives the index of the start of the last melodic outline
(the first index of a group of notes moving in the same direction)</p>
</dd>
<dt><a href="#sortPitches">sortPitches(pitches)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>helper function to sort an array of pitches from lowest to highest</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#PitchString">PitchString</a> : <code>string</code></dt>
<dd><p>a string consisting of a music Letter [A-G], optional accidental,
                                and optional octave number</p>
</dd>
<dt><a href="#KeyString">KeyString</a> : <code>string</code></dt>
<dd><p>a string consisting of a <a href="#PitchString">PitchString</a> and a mode name
                              seperated by whitespace</p>
</dd>
<dt><a href="#TreeNode">TreeNode</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="CantusFirmus"></a>

## CantusFirmus
**Kind**: global class  

* [CantusFirmus](#CantusFirmus)
    * [new CantusFirmus([key], [maxRange], [maxLength])](#new_CantusFirmus_new)
    * [.cf()](#CantusFirmus+cf) ⇒ <code>[Array.&lt;PitchString&gt;](#PitchString)</code>
    * [.addNote(pitch)](#CantusFirmus+addNote)
    * [.pop()](#CantusFirmus+pop) ⇒ <code>[PitchString](#PitchString)</code>
    * [.choices([nDeep])](#CantusFirmus+choices) ⇒ <code>[Array.&lt;PitchString&gt;](#PitchString)</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code>
    * [.isValid()](#CantusFirmus+isValid) ⇒ <code>boolean</code>
    * [.toString()](#CantusFirmus+toString) ⇒ <code>string</code>
    * [.print()](#CantusFirmus+print) ⇒ <code>string</code>
    * [.key()](#CantusFirmus+key) ⇒ <code>[KeyString](#KeyString)</code>

<a name="new_CantusFirmus_new"></a>

### new CantusFirmus([key], [maxRange], [maxLength])
create a CantusFirmus that follows the rules of species counterpoint


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [key] | <code>[KeyString](#KeyString)</code> | <code>&#x27;C major&#x27;</code> | the key of this cf |
| [maxRange] | <code>number</code> | <code>10</code> | the max range this machine will allow |
| [maxLength] | <code>number</code> | <code>16</code> | the maxLength of this machine |

<a name="CantusFirmus+cf"></a>

### cantusFirmus.cf() ⇒ <code>[Array.&lt;PitchString&gt;](#PitchString)</code>
get the current cantus firmus

**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Returns**: <code>[Array.&lt;PitchString&gt;](#PitchString)</code> - an array of pitch strings  
<a name="CantusFirmus+addNote"></a>

### cantusFirmus.addNote(pitch)
adds the given pitch to the cantus firmus

**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Throws**:

- throws an error if given pitch is not in the
     current set of [CantusFirmus#nextNoteChoices](CantusFirmus#nextNoteChoices)


| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>[PitchString](#PitchString)</code> | a pitch string in the current set of [CantusFirmus#nextNoteChoices](CantusFirmus#nextNoteChoices) |

<a name="CantusFirmus+pop"></a>

### cantusFirmus.pop() ⇒ <code>[PitchString](#PitchString)</code>
pop the last note choice off the cantus firmus

**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Returns**: <code>[PitchString](#PitchString)</code> - the last pitch string of the cantus firmus
submitted through [addNote](#CantusFirmus+addNote)  
**Throws**:

- throws an error if called when cantus firmus is empty

<a name="CantusFirmus+choices"></a>

### cantusFirmus.choices([nDeep]) ⇒ <code>[Array.&lt;PitchString&gt;](#PitchString)</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code>
returns an array of all possible next pitches, or an array of
nDeep [TreeNodes](#TreeNode).

**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Returns**: <code>[Array.&lt;PitchString&gt;](#PitchString)</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code> - if nDeep=1, an array of pitch strings, else
an array of nDeep [TreeNodes](TreeNodes)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [nDeep] | <code>number</code> | <code>1</code> | will search for nDeep possible choices |

<a name="CantusFirmus+isValid"></a>

### cantusFirmus.isValid() ⇒ <code>boolean</code>
is the current cantus firmus a complete and valid cantus firmus?

**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Returns**: <code>boolean</code> - is the current cantus firmus a complete and valid cantus firmus?  
<a name="CantusFirmus+toString"></a>

### cantusFirmus.toString() ⇒ <code>string</code>
**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Returns**: <code>string</code> - a space separated string with the pitches of this cantus firmus  
<a name="CantusFirmus+print"></a>

### cantusFirmus.print() ⇒ <code>string</code>
creates a simple tabular visualization of the cantus firmus

**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Returns**: <code>string</code> - a simple tabular visualization of the cantus firmus  
**See**: [prettyPrintCf](#prettyPrintCf)  
<a name="CantusFirmus+key"></a>

### cantusFirmus.key() ⇒ <code>[KeyString](#KeyString)</code>
**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Returns**: <code>[KeyString](#KeyString)</code> - the key of this cantus firmus  
<a name="cfMachine"></a>

## cfMachine : <code>MusicMachine</code>
A [MusicMachine](https://github.com/jrleszcz/music-machine/blob/master/api.md#MusicMachine)
configured to create guides that generate Cantus Firmi

**Kind**: global variable  
<a name="createCFguide"></a>

## createCFguide([key], [maxRange], [maxLength]) ⇒ <code>GuidedMusicMachine</code>
create a new GuidedMusicMachine configured with a Cantus Firmus grammar

**Kind**: global function  
**Returns**: <code>GuidedMusicMachine</code> - a new GuidedMusicMachine configured to create a cantus firmus  
**See**: [GuidedMusicMachine](https://github.com/jrleszcz/music-machine/blob/master/api.md#GuidedMusicMachine)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [key] | <code>[KeyString](#KeyString)</code> | <code>&#x27;C major&#x27;</code> | the key of this guide's construction |
| [maxRange] | <code>number</code> | <code>10</code> | the max range of this guide's construction |
| [maxLength] | <code>number</code> | <code>16</code> | the maxLength of this guide's construction |

<a name="foresightFilterGenerator"></a>

## foresightFilterGenerator()
MusicMachine filter generator that filters out notes which
are OK in the moment but that preclude the creation of a valid CF.
For example, if maxRange is 8 and the cf goes down 8 from the first note,
there cannot be a climax as the cf must end on tonic again.

**Kind**: global function  
<a name="outlineFilter"></a>

## outlineFilter()
MusicMachine filter that ensures valid melodic outlines (a group of notes that move in the same direction)

**Kind**: global function  
<a name="noLeapBackFilter"></a>

## noLeapBackFilter()
MusicMachine filter that avoids leaping back to the same note after
leaving it via a leap (no 1 3 1)

**Kind**: global function  
<a name="patternFilter"></a>

## patternFilter()
MusicMachine filter that avoids patterns of length 2 or 3
such as 1 2 1 2 or 1 2 3 1 2 3

**Kind**: global function  
<a name="prettyPrintCf"></a>

## prettyPrintCf(cantusFirmus) ⇒ <code>String</code>
creates a simple tabular visualization of the cantus firmus

**Kind**: global function  
**Returns**: <code>String</code> - a tabular representation of the cantus firmus  

| Param | Type | Description |
| --- | --- | --- |
| cantusFirmus | <code>[CantusFirmus](#CantusFirmus)</code> | the cantus firmus to visualize |

**Example**  
```js
var cf = new CantusFirmus('D minor', 6, 13)
'D4 E4 F4 C4 D4 F4 E4 G4 Bb3 C4 F4 E4 D4'.split(' ').forEach(cf.addNote)
prettyPrintCf(cf) =>

// G4                              o
// F4          o           o                   o
// E4      o                   o                   o
// D4  o               o                               o
// C4              o                       o
// Bb3                                 o
//     D4  E4  F4  C4  D4  F4  E4  G4  Bb3 C4  F4  E4  D4
```
<a name="indexOfLastOutline"></a>

## indexOfLastOutline(construction) ⇒ <code>number</code>
given an array of pitch strings, gives the index of the start of the last melodic outline
(the first index of a group of notes moving in the same direction)

**Kind**: global function  
**Returns**: <code>number</code> - the index of the last direction change or 0 if there is no direction change  

| Param | Type | Description |
| --- | --- | --- |
| construction | <code>[Array.&lt;PitchString&gt;](#PitchString)</code> | an array of pitches |

<a name="sortPitches"></a>

## sortPitches(pitches) ⇒ <code>Array.&lt;string&gt;</code>
helper function to sort an array of pitches from lowest to highest

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - a new clone of the provided pitch string
array sorted from low pitch to high pitch  

| Param | Type | Description |
| --- | --- | --- |
| pitches | <code>Array.&lt;string&gt;</code> | an array of pitch strings |

<a name="PitchString"></a>

## PitchString : <code>string</code>
a string consisting of a music Letter [A-G], optional accidental,
                                and optional octave number

**Kind**: global typedef  
**Example**  
```js
'C4'     // middle C on a piano, the fourth octave
'Eb3'    // Eb in octave 3
'F#'     // no octave number provided, a pitch class
'F##'    // F double sharp
'Dbb'    // D double flat
```
<a name="KeyString"></a>

## KeyString : <code>string</code>
a string consisting of a [PitchString](#PitchString) and a mode name
                              seperated by whitespace

**Kind**: global typedef  
**Example**  
```js
'Eb major'
'C minor'
'F# dorian'
```
<a name="TreeNode"></a>

## TreeNode : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| val | <code>[PitchString](#PitchString)</code> | a pitch string |
| next | <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code> | a list of TreeNodes this node links to |

