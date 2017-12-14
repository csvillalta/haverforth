// See the following on using objects as key/value dictionaries
// https://stackoverflow.com/questions/1208222/how-to-do-associative-array-hashing-in-javascript
var NOT_DEFINING_FUNCTION = 1; // flag to make the process function either execute commands in the terminal or add commands to a temporary function definition
var temp_function_definition = []; // will hold user function definitions (i.e. everything between : and ;) until the function is added to the user_words dictionary

var user_words = {}; // holds user functions
var words = { 
				"+" : function (stack) {
				    var first = stack.pop();
			        var second = stack.pop();
			        stack.push(first+second);
				},
				"-" : function(stack) {
					var first = stack.pop();
					var second = stack.pop();
					stack.push(second-first);
				},
				"*" : function(stack) {
					var first = stack.pop();
					var second = stack.pop();
					stack.push(first*second);
				},
				"/" : function (stack) {
				    var first = stack.pop();
			        var second = stack.pop();
			        if (first != 0) {
			        	stack.push(second/first);
			        }
				},
				">" : function(stack) {
					var first = stack.pop();
					var second = stack.pop();
					if (first > second) {
						stack.push(-1);
					} else {
						stack.push(0);
					}
				},
				"<" : function(stack) {
					var first = stack.pop();
					var second = stack.pop();
					if (first < second) {
						stack.push(-1);
					} else {
						stack.push(0);
					}
				},
				"=" : function(stack) {
					var first = stack.pop();
					var second = stack.pop();
					if (first === second) {
						stack.push(-1);
					} else {
						stack.push(0);
					}
				},
				"dup" : function(stack) {
					var top = stack.pop();
					stack.push(top);
					stack.push(top);
				},
				"nip" : function(stack) {
					var first = stack.pop();
					stack.pop();
					stack.push(first);
				},
				"swap" : function(stack) {
					var first = stack.pop();
					var second = stack.pop();
					stack.push(first);
					stack.push(second);
				},
				"over" : function(stack) {
					var first = stack.pop();
					var second = stack.pop();
					stack.push(second);
					stack.push(first);
					stack.push(second);
				},
		 };

class Stack {
	constructor() {
		this.repr = [];
	}
	pop() {
		return this.repr.pop();
	}
	push(element) {
		this.repr.push(element);
	}
	clear() {
		this.repr.length = 0;
	}
	length() {
		return this.repr.length;
	}
	contentsIntoString(delimiter) {
		return this.repr.slice().join(delimiter);
	}
}
// Referenced: https://scotch.io/bar-talk/4-javascript-design-patterns-you-should-know
class ObservableStack extends Stack {
	constructor() {
		super();
		this.observers = [];
	}
	push(element) { 
		Stack.prototype.push.call(this, element);
		this.notifyObservers();
	}
	clear() {
		Stack.prototype.clear.call(this);
		this.notifyObservers();
	}
	registerObserver(observer) {
		this.observers.push(observer);
	}
	notifyObservers() {
		for (var i = 0; i < this.observers.length; i++) {
			this.observers[i](this.repr); // simply passes the stack representation over
		}
	}
}

// this function is no longer relevant, but was used to play around with modifying the DOM
// function formatUserFunctionDef(user_function_array) {
// 	var formatted_user_function = "";
// 	for (var i = 1, len = user_function_array.length; i < len; i++) {
// 		formatted_user_function = formatted_user_function + user_function_array[i] + " ";
// 	};
// 	return user_function_array[0] + ": " + formatted_user_function;
// }

// creates buttons for user defined functions in the div labelled user-defined-funcs
function createUserFunctionButton(user_function_array, stack, terminal) {
	var name = user_function_array[0];
	$("#user-defined-funcs").append('<input type="button"' + 'value='+name+' id='+ name +'>').end(); // creates the button
  	$("#"+name).click(function(){ process(stack, name, terminal);}).end(); // adds button handler
}

// function emptyStack(stack) {
//     stack.empty();
// }

/**
 * Print a string out to the terminal, and update its scroll to the
 * bottom of the screen. You should call this so the screen is
 * properly scrolled.
 * @param {Terminal} terminal - The `terminal` object to write to
 * @param {string}   msg      - The message to print to the terminal
 */
function print(terminal, msg) {
    terminal.print(msg);
    $("#terminal").scrollTop($('#terminal')[0].scrollHeight + 40);
}

/** 
 * Sync up the HTML with the stack in memory
 * @param {Array[Number]} The stack to render
 */
function renderStack(stack) {
    $("#thestack").empty();
    stack.slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });
};

/** 
 * Process a user input, update the stack accordingly, write a
 * response out to some terminal.
 * @param {Array[Number]} stack - The stack to work on
 * @param {string} input - The string the user typed
 * @param {Terminal} terminal - The terminal object
 */
function process(stack, input, terminal) {
    input_array = input.trim().split(/ +/);
    for (var i = 0, len = input_array.length; i < len; i++) {
	    if (NOT_DEFINING_FUNCTION) {
		    // The user typed a number
		    if (input_array[i] === ":") {
		    	NOT_DEFINING_FUNCTION = 0;
		    } else if (!(isNaN(Number(input_array[i])))) {
		        print(terminal,"pushing " + Number(input_array[i]));
		        stack.push(Number(input_array[i]));
		    } else if (input_array[i] === ".s") {
		        print(terminal, " <" + stack.length() + "> " + stack.contentsIntoString(" "));
		    } else if (input_array[i] in words) {
		    	words[input_array[i]](stack);
		    } else if (input_array[i] in user_words) {
		    	var temp = input_array[i];
		    	for (var j = 0, len2 = user_words[temp].length; j < len2; j++) {
		    		process(stack, user_words[temp][j], terminal);
		    	};
		    } else {
		        print(terminal, ":-( Unrecognized input");
		    }
		} else {
			if (input_array[i] === ";") {
				NOT_DEFINING_FUNCTION = 1;
				//$("#user-defined-funcs").append("<tr><td>" + formatUserFunctionDef(temp_function_definition) + "</td></tr>");
				if(!($('#'+temp_function_definition[0]).length)) { // if our button has been made already, no need to make it again
					createUserFunctionButton(temp_function_definition, stack, terminal);
				}
				user_words[temp_function_definition[0]] = temp_function_definition.slice(1, temp_function_definition.length);
				temp_function_definition.length = 0; // reset our array to prepare for other function definitions
			} else {
				temp_function_definition.push(input_array[i]);
			}
		}
	}
};

function runRepl(terminal, stack) {
    terminal.input("Type a forth command:", function(line) {
        print(terminal, "User typed in: " + line);
        process(stack, line, terminal);
        runRepl(terminal, stack);
    });
};

// Whenever the page is finished loading, call this function. 
// See: https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {
    var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);
    
    // Find the "terminal" object and change it to add the HTML that
    // represents the terminal to the end of it.
    $("#terminal").append(terminal.html);

    var stack = new ObservableStack();
    stack.registerObserver(renderStack)

    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");
    $("#reset").click(function() {
    	stack.clear();
    })

    runRepl(terminal, stack);
});
