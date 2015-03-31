// constructor only stores fractions in their simplified form
// BUGBUG inputting decimal numbers as arguments is not accurate for some numbers such 0.555

function Fraction(numerator, denominator) {
    if (!denominator)
        denominator = 1;
    this.numerator = numerator;
    this.denominator = denominator;
    // convert decimals to fraction
    while(this.numerator % 1 != 0 || this.denominator % 1 != 0) {
        this.numerator *= 10;
        this.denominator *= 10;
    }
    // reduce fraction
    if (this.denominator != 1) {
        divisor = gcd(this.numerator, this.denominator);
        this.numerator = this.numerator / divisor;
        this.denominator = this.denominator / divisor;
    }
    // remove negative or move it to numerator 
    if (this.denominator < 0) {
        this.denominator *= -1;
        this.numerator *= -1;
    }
    Object.freeze(this); 
}

Fraction.prototype = {
    constructor: Fraction,

    toString: function() {
        if (this.numerator == 0)
            return "(0)";
        if (this.denominator == 1)
            return "(" + this.numerator + ")";
        return "(" + this.numerator + "/" + this.denominator + ")";
    },

    toDecimal: function() {
        return this.numerator / this.denominator;
    },

    equals: function(that) {
        if (!(this.numerator == that.numerator)) 
            return false;
        if (!(this.denominator == that.denominator))
            return false;
        return true;
    },

    greaterThan: function(that) {
        return this.toDecimal() > that.toDecimal();
    },

    lessThan: function(that) {
        return this.toDecimal() < that.toDecimal();
    },

    plus: function(that) {
        if (this.denominator == that.denominator)
            return new Fraction(this.numerator + that.numerator, this.denominator);
        return new Fraction(this.numerator * that.denominator + that.numerator * this.denominator,
                            this.denominator * that.denominator);
    }, 

    minus: function(that) {
        if (this.denominator == that.denominator)
            return new Fraction(this.numerator - that.numerator, this.denominator);
        return new Fraction(this.numerator * that.denominator - that.numerator * this.denominator,
                            this.denominator * that.denominator);
    },

    multiply: function(that) {
        return new Fraction(this.numerator * that.numerator, this.denominator * that.denominator);
    },

    divide: function(that) {
        return new Fraction(this.numerator * that.denominator, this.denominator * that.numerator);
    }

};

// returns Greatest Common Divisor using Euclid's algorithm
function gcd(p, q) {
    if (q == 0) return p;
    return gcd(q, p % q);
}

module.exports = Fraction;