var WeightedBag = require('../WeightedBag.js');

var wb = new WeightedBag();

console.log("Test empty bag isEmpty = " + wb.isEmpty());
console.log(String(wb));

wb.add("Bananas", .5);
console.log("Added Bananas, isEmpty = " + wb.isEmpty());
console.log(String(wb));

wb.add("Apples", .24);
wb.add("Pears", .24);
wb.add("Avocado", .02);

console.log(String(wb));

var tally = {
    Bananas: 0,
    Apples: 0,
    Pears: 0,
    Avocado: 0
};



var tests = 100000;
for (var i = 0; i < tests; i++)
    tally[wb.peek()]++;
for (var fruit in tally)
    console.log(fruit + " " + tally[fruit]/tests);
console.log(String(wb));

console.log("Removed: " + wb.remove());
console.log(String(wb));
console.log("Removed: " + wb.remove());
console.log(String(wb));
console.log("Removed: " + wb.remove());
console.log(String(wb));
console.log("Removed: " + wb.remove());
console.log(String(wb));

