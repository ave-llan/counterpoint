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
<dt><a href="#outlineFilter">outlineFilter()</a></dt>
<dd><p>MusicMachine filter that ensires valid melodic outlines (a group of notes that move in the same direction)</p>
</dd>
<dt><a href="#patternFilter">patternFilter()</a></dt>
<dd><p>MusicMachine filter that avoids patterns of length 2 or 3
such as 1 2 1 2 or 1 2 3 1 2 3</p>
</dd>
<dt><a href="#indexOfLastOutline">indexOfLastOutline(construction)</a> ⇒ <code>number</code></dt>
<dd><p>given an array of pitch strings, gives the index of the start of the last melodic outline
(the first index of a group of notes moving in the same direction)</p>
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
  * [.nextNoteChoices([nDeep])](#CantusFirmus+nextNoteChoices) ⇒ <code>[Array.&lt;PitchString&gt;](#PitchString)</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code>

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
     current set of [nextNoteChoices](#CantusFirmus+nextNoteChoices)


| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>[PitchString](#PitchString)</code> | a pitch string in the current set of [nextNoteChoices](#CantusFirmus+nextNoteChoices) |

<a name="CantusFirmus+pop"></a>
### cantusFirmus.pop() ⇒ <code>[PitchString](#PitchString)</code>
pop the last note choice off the cantus firmus

**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Returns**: <code>[PitchString](#PitchString)</code> - the last pitch string of the cantus firmus
submitted through [addNote](#CantusFirmus+addNote)  
**Throws**:

- throws an error if called when cantus firmus is empty

<a name="CantusFirmus+nextNoteChoices"></a>
### cantusFirmus.nextNoteChoices([nDeep]) ⇒ <code>[Array.&lt;PitchString&gt;](#PitchString)</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code>
returns an array of all possible next pitches, or an array of
nDeep [TreeNodes](#TreeNode).

**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Returns**: <code>[Array.&lt;PitchString&gt;](#PitchString)</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code> - if nDeep=1, an array of pitch strings, else
an array of nDeep [TreeNodes](TreeNodes)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [nDeep] | <code>number</code> | <code>1</code> | will search for nDeep possible choices |

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

<a name="outlineFilter"></a>
## outlineFilter()
MusicMachine filter that ensires valid melodic outlines (a group of notes that move in the same direction)

**Kind**: global function  
<a name="patternFilter"></a>
## patternFilter()
MusicMachine filter that avoids patterns of length 2 or 3
such as 1 2 1 2 or 1 2 3 1 2 3

**Kind**: global function  
<a name="indexOfLastOutline"></a>
## indexOfLastOutline(construction) ⇒ <code>number</code>
given an array of pitch strings, gives the index of the start of the last melodic outline
(the first index of a group of notes moving in the same direction)

**Kind**: global function  
**Returns**: <code>number</code> - the index of the last direction change or 0 if there is no direction change  

| Param | Type | Description |
| --- | --- | --- |
| construction | <code>[Array.&lt;PitchString&gt;](#PitchString)</code> | an array of pitches |

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

