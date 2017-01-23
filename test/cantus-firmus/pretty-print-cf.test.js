var test = require('tape')
  , CantusFirmus = require('../../lib/cantus-firmus/cantus-firmus.js')
  , prettyPrint = require('../../lib/cantus-firmus/pretty-print-cf.js')

test('createCFmachine', function (t) {
  var cf = new CantusFirmus('D minor')
  t.equal(prettyPrint(cf), '')
  t.equal(cf.print(), '')

  cf.addNote('D4')
  var visualization = [
  'D4  o  ',
  '    D4 '
  ]
  t.equal(prettyPrint(cf), visualization.join('\n'))
  t.equal(cf.print(), visualization.join('\n'))
  cf.addNote('A4')
  visualization = [
    'A4      o  ',
    'G4         ',
    'F4         ',
    'E4         ',
    'D4  o      ',
    '    D4  A4 '
  ]
  cf.pop()

  var notes = 'E4 F4 C4 D4 F4 E4 G4 Bb3 C4 F4 E4 D4'
  notes.split(' ').forEach(cf.addNote)
  visualization = [
    'G4                              o                      ',
    'F4          o           o                   o          ',
    'E4      o                   o                   o      ',
    'D4  o               o                               o  ',
    'C4              o                       o              ',
    'Bb3                                 o                  ',
    '    D4  E4  F4  C4  D4  F4  E4  G4  Bb3 C4  F4  E4  D4 '
  ]
  t.equal(prettyPrint(cf), visualization.join('\n'))
  t.equal(cf.print(), visualization.join('\n'))
  t.end()
})
