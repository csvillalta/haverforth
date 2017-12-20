# HaverForth in JavaScript

**An interactive FORTH calculator implemented in JavaScript.**

Adapted from https://github.com/kmicinski/haverforth

**Part 7 and 8 of lab 7E are in the file named lab_7E_reflections.MD. Part 13 of the final is in the file named final_project_reflections.MD.**

**My additions for part 12 of the final project were:**
- a row of buttons for the predefined functions
- the ability to delete user-defined functions using "del" which also deletes the associated button
- the ability to see all available commands by typing "h"
- colored terminal outputs for errors and "h"

**Usage**

Once you have launched index.html. You can begin entering commands in the terminal.
You have the option to enter commands line by line:
```
1
2
+
```
or by entering all the commands in one line:
```
1 2 +
```
We can also define our own functions using the following format: 
```
: [function name] <function body> ;
```
For example I define the function double:
```
: double 2 * ;
```
If I wanted to delete double I would type:
```
del double
```
