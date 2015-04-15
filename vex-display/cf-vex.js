var buildCF = require('../buildCF.js');

// returns a Vex.Flow.StaveNote whole note
function translateToVexNote(pitch) {
    var duration = "w" // all whole notes for now
    var keys = pitch.pitchClass.toLowerCase() + "/" + pitch.octave;
    var vexNote;
    if (pitch.accidental === 0) {
        vexNote = new Vex.Flow.StaveNote({ keys: [keys], duration: duration});
    }
    else {
        var pitchElements = /([A-G])(b{1,2}|#{1,2})/.exec(pitch.pitchClass);
        var accidental = pitchElements[2];
        vexNote = new Vex.Flow.StaveNote({ keys: [keys], duration: duration}).
            addAccidental(0, new Vex.Flow.Accidental(accidental));
    }
    return vexNote;
}

function displayVexflow(cf) {
    var clef = "treble";
    var canvas = document.body.getElementsByTagName("canvas")[0];
    var canvasWidth = canvas.scrollWidth; 
    var renderer = new Vex.Flow.Renderer(canvas,
    Vex.Flow.Renderer.Backends.CANVAS);

    var ctx = renderer.getContext();
    var stave = new Vex.Flow.Stave(10, 0, canvasWidth - 20);
    stave.addClef(clef).setContext(ctx).draw();
    var notes = [];
    for (var i = 0; i < cf.length; i++) {
        notes.push(translateToVexNote(cf.cf[i]));
    }
    var voice = new Vex.Flow.Voice({
        num_beats: cf.length,
        beat_value: 1,
        resolution: Vex.Flow.RESOLUTION
    });
    // Add notes to voice
    voice.addTickables(notes);
    // Format and justify the notes to 600 pixels
    var formatter = new Vex.Flow.Formatter().
    joinVoices([voice]).format([voice], canvasWidth - 60);
    // Render voice
    voice.draw(ctx, stave);
}

var cf = buildCF();
console.log("final cf: " + cf);
displayVexflow(cf);