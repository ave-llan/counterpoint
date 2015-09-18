// data type that supports randomly choosing from a collection of items with weights

function WeightedBag() {
    var N = 0;
    var totalWeight = 0;
    var items = [];
    var itemWeights = [];

    this.isEmpty = function() {
        return N == 0;
    };

    this.size = function() {
        return N;
    };

    this.toString = function() {
        if (this.isEmpty())
            return "[empty WeightedBag]";
        var s = "" + items[0] + "(" + itemWeights[0] + ")";
        for (var i = 1; i < N; i++)
            s += ", " + items[i] + "(" + (itemWeights[i]-itemWeights[i-1]) + ")";
        return s;
    }

    // adds item to bag with given weight
    this.add = function(item, weight) {
        totalWeight += weight;
        items.push(item);
        itemWeights.push(totalWeight);
        N++;
    };

    // returns an index of item selected randomly using weights
    function select() {
        return search(Math.random() * totalWeight);
    };

    // returns the index of smallest weight that is greater than or equal to selection
    function search(key) {
        var lo = 0;
        var hi = N - 1;
        while (hi != lo) {
            var mid = lo + Math.floor((hi - lo) / 2);
            if (key < itemWeights[mid])
                hi = mid;
            if (key >= itemWeights[mid])
                lo = mid + 1;
        }
        return hi;
    } 

    // pulls a random item out of the bag without removing it
    this.peek = function() {
        return items[select()];
    };

    // removes a random item from the bag and returns it
    this.remove = function() {
        var i = select();
        var item = items[i];        // save item
        items.splice(i, 1);         // remove item from items list
        var iWeight;
        if (i == 0)
            iWeight = itemWeights[i];
        else 
            iWeight = itemWeights[i] - itemWeights[i - 1];
        totalWeight -= iWeight;     // subtract this items weight from totalWeights
        for (var j = i + 1; j < N; j++)
            itemWeights[j] -= iWeight;
        itemWeights.splice(i, 1);   // remove item from itemWeights
        N--;
        return item;
    };
}

module.exports = WeightedBag;