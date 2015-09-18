// a LIFO stack

function Stack() {
    var N = 0;
    var first = null;

    function Node(item) {
        this.item = item;
        this.next = null;
    }

    this.isEmpty = function() {
        return N == 0;
    };

    this.size = function() {
        return N;
    };

    // adds item to the stack
    this.push = function(item) {
        var oldfirst = first;
        first = new Node(item);
        first.next = oldfirst;
        N++;
    };

    // removes and returns the last item added to stack
    this.pop = function() {
        if (this.isEmpty())
            throw new Error("Cannot pop item from empty stack.");
        var item = first.item;
        first = first.next;
        N--;
        return item;
    };

    // returns the last item added to stack without removing it
    this.peek = function() {
        if (this.isEmpty())
            throw new Error("Cannot peek item on empty stack.");
        return first.item;
    };

    // returns a string of items in LIFO order
    this.toString = function() {
        if (this.isEmpty())
            return "[empty stack]";
        var s = "" + first.item;
        var cur = first.next;
        while(cur !== null) {
            s += " " + cur.item;
            cur = cur.next;
        }
        return s;
    };
}

module.exports = Stack;