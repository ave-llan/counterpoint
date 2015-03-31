var Fraction = require("../Fraction.js");

var a = process.argv[2].split("/");
var b = process.argv[3].split("/");

fraction1 = new Fraction(Number(a[0]), Number(a[1]));
fraction2 = new Fraction(Number(b[0]), Number(b[1]));
console.log(fraction1 + " = " + fraction1.toDecimal());
console.log(fraction2 + " = " + fraction2.toDecimal());
console.log(fraction1 + " = " + fraction2 + " = " + fraction1.equals(fraction2));
console.log(fraction1 + " > " + fraction2 + " = " + fraction1.greaterThan(fraction2));
console.log(fraction1 + " < " + fraction2 + " = " + fraction1.lessThan(fraction2));
console.log(fraction1 + " + " + fraction2 + " = " + fraction1.plus(fraction2));
console.log(fraction1 + " - " + fraction2 + " = " + fraction1.minus(fraction2));
console.log(fraction1 + " * " + fraction2 + " = " + fraction1.multiply(fraction2));
console.log(fraction1 + " / " + fraction2 + " = " + fraction1.divide(fraction2));