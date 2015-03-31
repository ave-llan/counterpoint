var Duration = require("./Duration.js");

var a = process.argv[2].split("/");
var b = process.argv[3].split("/");

duration1 = new Duration(Number(a[0]), Number(a[1]));
duration2 = new Duration(Number(b[0]), Number(b[1]));
console.log(duration1 + " = " + duration1.toDecimal());
console.log(duration2 + " = " + duration2.toDecimal());
console.log(duration1 + " = " + duration2 + " = " + duration1.equals(duration2));
console.log(duration1 + " > " + duration2 + " = " + duration1.greaterThan(duration2));
console.log(duration1 + " < " + duration2 + " = " + duration1.lessThan(duration2));
console.log(duration1 + " + " + duration2 + " = " + duration1.plus(duration2));
console.log(duration1 + " - " + duration2 + " = " + duration1.minus(duration2));
console.log(duration1 + " * " + duration2 + " = " + duration1.multiply(duration2));
console.log(duration1 + " / " + duration2 + " = " + duration1.divide(duration2));