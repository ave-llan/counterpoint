var Stack = require('../Stack.js');

var stack = new Stack();

for (var i = 0; i < 20; i++) {
    console.log("push(" + i + ")");
    stack.push(i);
    console.log("toString() = " + stack);
}

while (!stack.isEmpty()) {
    console.log("peek() = " + stack.peek());
    console.log(" pop() = " + stack.pop());
    console.log(String(stack));
}