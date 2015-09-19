## Classes
<dl>
<dt><a href="#CantusFirmus">CantusFirmus</a></dt>
<dd></dd>
</dl>
## Functions
<dl>
<dt><a href="#createCFguide">createCFguide(key, [maxRange], [maxLength])</a> ⇒ <code>MusicMachine</code></dt>
<dd><p>create a new GuidedMusicMachine configured with a Cantus Firmus grammar</p>
</dd>
<dt><a href="#createCFmachine">createCFmachine([maxRange], [maxLength])</a> ⇒ <code>MusicMachine</code></dt>
<dd><p>create a new MusicMachine configured to generate Cantus Firmus guides</p>
</dd>
<dt><a href="#patternFilter">patternFilter()</a></dt>
<dd><p>MusicMachine filter that avoids patterns of length 2 or 3
such as 1 2 1 2 or 1 2 3 1 2 3</p>
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
  * [new CantusFirmus(key, [maxRange], [maxLength])](#new_CantusFirmus_new)
  * [.cf()](#CantusFirmus+cf) ⇒ <code>Array.&lt;string&gt;</code>
  * [.nextNoteChoices([nDeep])](#CantusFirmus+nextNoteChoices) ⇒ <code>Array.&lt;string&gt;</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code>

<a name="new_CantusFirmus_new"></a>
### new CantusFirmus(key, [maxRange], [maxLength])
create a CantusFirmus that follows the rules of species counterpoint


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>[KeyString](#KeyString)</code> |  | the key of this cf |
| [maxRange] | <code>number</code> | <code>10</code> | the max range this machine will allow |
| [maxLength] | <code>number</code> | <code>16</code> | the maxLength of this machine |

<a name="CantusFirmus+cf"></a>
### cantusFirmus.cf() ⇒ <code>Array.&lt;string&gt;</code>
the current cf

**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - an array of pitch strings  
<a name="CantusFirmus+nextNoteChoices"></a>
### cantusFirmus.nextNoteChoices([nDeep]) ⇒ <code>Array.&lt;string&gt;</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code>
returns an array of all possible next pitches, or an array of
nDeep [TreeNodes](#TreeNode).

**Kind**: instance method of <code>[CantusFirmus](#CantusFirmus)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> &#124; <code>[Array.&lt;TreeNode&gt;](#TreeNode)</code> - if nDeep=1, an array of pitch strings, else
an array of nDeep [TreeNodes](TreeNodes)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [nDeep] | <code>number</code> | <code>1</code> | will search for nDeep possible choices |

<a name="createCFguide"></a>
## createCFguide(key, [maxRange], [maxLength]) ⇒ <code>MusicMachine</code>
create a new GuidedMusicMachine configured with a Cantus Firmus grammar

**Kind**: global function  
**Returns**: <code>MusicMachine</code> - a new MusicMachine  
**See**: [MusicMachine](https://github.com/jrleszcz/music-machine/blob/master/api.md#musicmachine)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>[KeyString](#KeyString)</code> |  | the key of this cf |
| [maxRange] | <code>number</code> | <code>10</code> | the max range this machine will allow |
| [maxLength] | <code>number</code> | <code>16</code> | the maxLength of this machine |

<a name="createCFmachine"></a>
## createCFmachine([maxRange], [maxLength]) ⇒ <code>MusicMachine</code>
create a new MusicMachine configured to generate Cantus Firmus guides

**Kind**: global function  
**Returns**: <code>MusicMachine</code> - a new MusicMachine  
**See**: [MusicMachine](https://github.com/jrleszcz/music-machine/blob/master/api.md#musicmachine)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [maxRange] | <code>number</code> | <code>10</code> | the max range this machine will allow |
| [maxLength] | <code>number</code> | <code>16</code> | the maxLength of this machine |

<a name="patternFilter"></a>
## patternFilter()
MusicMachine filter that avoids patterns of length 2 or 3
such as 1 2 1 2 or 1 2 3 1 2 3

**Kind**: global function  
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

