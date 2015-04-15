/************************************************************************
*  javascript adaptation of a Max Priority Queue from
*  Algorithms (4th edition) by Robert Sedgewick and Kevin Wayne
************************************************************************/

function MaxPQ(lessComparator) {
    var pq = [];                  // heap-ordered binary tree
    var N = 0;                    // number of items in priority queue
    // function(i, j) used to compare two keys.  Must answer the question, is i less than j?
    var isLess = lessComparator;

    // compare the items at indices i and j
    function less(i, j) {
        return isLess(pq[i], pq[j]);
    }
    // exchange two items in the priority queue
    function exch(i, j) {
        var t = pq[i];
        pq[i] = pq[j];
        pq[j] = t;
    }
    // moves item at index k up the priority queue to its appropriate place
    function swim(k) {
        while (k > 1 && less(Math.floor(k/2), k)) {
            exch(Math.floor(k/2), k);
            k = Math.floor(k/2);
        }
    }
    // moves item at index k down the priority queue to its appropriate place
    function sink(k) {
        while (2*k <= N) {
            var j = 2*k;
            if (j < N && less(j, j+1))  // choose the larger of k's children
                j++;
            if (!less(k, j))            // k is now in the correct position
                break;
            exch(k, j);
            k = j;
        }
    }

    this.isEmpty = function() {
        return N == 0;
    };

    this.size = function() {
        return N;
    };

    // inserts a key in its appropriate place in the queue
    this.insert = function(v) {
        N++;
        pq[N] = v;
        swim(N);
    };

    // deletes and returns the max key
    this.delMax = function() {
        exch(1, N);
        var max = pq.pop(N);
        N--;
        sink(1);
        return max;
    };
}

module.exports = MaxPQ;