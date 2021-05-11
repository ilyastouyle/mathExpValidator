# mathexpvalidator
## Mathematical Expression Validator 
### Dependencies: 
>mathtokenizer: ^1.0.8

### Library:

>**shunt**: shunting function that takes string input and returns either 0 (if mismatched parentheses) or an array of objects {type, value}, an implementation of the shunting-yard algorithm (with unary operator, and nested function support)

>**validate**: validating function that takes string input and returns an array:
[0 || 1, "Error or Success message"]
>**validate** can also take optional arguments such as an array **fuctions** of accepted function names, and an array of **variables**: **validate**(expression, __functions__(optional),__variables__(optional))**

### Examples:
To run these examples, just install the package in your directory:

	npm i mathexpvalidator

And add the example code to your js file and then run it

#### Example 1:

	const validator = require('mathexpvalidator');
	let output = validator.shunt("-sin(1/x)");
	/*
		output = [
		 token { type: 'number', value: '1' },
      	 token { type: 'variable', value: 'x' },
      	 token { type: 'operator', value: '/' },
      	 token { type: 'function', value: 'sin' },
      	 token { type: 'unary_operator', value: '-' }
    	]
	*/
	let status = validator.validate("-sin(1/x)");
	//status = [ 1, 'Valid expression' ]

#### Example 2:

	const validator = require('mathexpvalidator');
	let output = validator.shunt("(1+x)\*(x-");
	//output = 0 (because of mismatched parentheses)
	let status = validator.validate("(1+x)\*(x-");
	//status = [ 0, 'Mismatched parenthesis' ]

### Example 3: 

	const validator = require('mathexpvalidator');
	let output = validator.shunt("x-1+");
	/*
		output = [
      	 token { type: 'variable', value: 'x' },
      	 token { type: 'number', value: '1' },
		 token { type: 'operator', value: '-' },
		 token { type: 'operator', value: '+' }
    	]
	*/
	let status = validator.validate("x-1+");
	//status = [ 0, 'Insufficient operands' ]

### Example 4: __Using functions, variables optional arguments__
	const validator = require('mathexpvalidator');
	const func = ["cos", "cosh", "acos", "sin", "sinh", "asin"];
	const vari = ["x"];
	let status = validator.validate("cosh(x)", func, vari);
	//status = [1, 'Valid expression']

### Example 5: Using the same func and vari arguments from example 4 but with an added variable t in the expression
	const validator = require('mathexpvalidator');
	const func = ["cos", "cosh", "acos", "sin", "sinh", "asin"];
	const vari = ["x"];
	let status = validator.validate("cosh(x*t)", func, vari);
	//status = [0, 'Variable name not allowed']