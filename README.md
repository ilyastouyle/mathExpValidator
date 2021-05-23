## Mathematical Expression Validator 
### Dependencies: 
	mathtokenizer: ^1.1.0

### Install 
	npm i mathexpvalidator --save

### Description

While working on a math animation web app, I eventually had to validate mathematical input.  
A neat trick I used to resort to, when I needed to validate math expressions, was using the `Eval()` function, with a try, catch block.  
I quickly ran into many issues, namely that many invalid math expressions didn't return an error when using `Eval()`.  
For example `()`, or `[]` would be considered false positives (i.e: would not be caught as an error) using the aforementioned "trick".  
And, expressions like `sin(1/x)` when evaluated at `x = 0`, would be considered false negatives (i.e: would be caught as an error).   
And there is also the issue of variable names.   
I for example used to set `x` and `t` in the expressions to 0, and then use `Eval()`.  
But what if the expression has other variables with other names? What to do about the fact that at 0 it would return an error such as in `sin(1/x)` but wouldn't return an error when `x` is set to 1?
i.e: the issue of singularities.  
So, I decided to give up on the `Eval()` trick and write my own expression validator. And for that I also wrote my own [mathematical expression tokenizer](https://github.com/ilyastouyle/mathTokenizer).  
The expression validator uses the mathematical expression **tokenizer** and then uses my implementation of the **Shunting-Yard algorithm** (__Reverse Polish Notation__) and then a **validating** fuction.  

### Library:

#### Shunting function
	
`shunt`: shunting function that takes `string` input and returns either `0` (if mismatched parentheses) or an array of objects `{type, value}`, an implementation of the shunting-yard algorithm (with unary operator, and nested function support)  

```js
	shunt(exp //mathematical expression) 
```
#### Validation function

`validate`: validating function that takes `string` input and returns an array of two entries. The first being 0 or 1, and the second being a success or error message.     
`validate` can also take optional arguments such as an array `fuctions[]` of accepted function names, and an array of `variables[]`:  

```js
	validate(expression, functions[] /*optional*/, variables[] /*optional*/)
```
### Usage and examples:
To run these examples, just install the package in your directory:

	npm i mathexpvalidator --save

And add the example code to your js file and then run it

#### Example 1:
```js
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
```
#### Example 2:
```js
	const validator = require('mathexpvalidator');
	let output = validator.shunt("(1+x)\*(x-");
	//output = 0 (because of mismatched parentheses)
	let status = validator.validate("(1+x)\*(x-");
	//status = [ 0, 'Mismatched parenthesis' ]
```
### Example 3: 
```js
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
```
### Example 4: __Using functions, variables optional arguments__
```js
	const validator = require('mathexpvalidator');
	const func = ["cos", "cosh", "acos", "sin", "sinh", "asin"];
	const vari = ["x"];
	let status = validator.validate("cosh(x)", func, vari);
	//status = [1, 'Valid expression']
```
### Example 5: Using the same func and vari arguments from example 4 but with an added variable t in the expression
```js
	const validator = require('mathexpvalidator');
	const func = ["cos", "cosh", "acos", "sin", "sinh", "asin"];
	const vari = ["x"];
	let status = validator.validate("cosh(x*t)", func, vari);
	//status = [0, 'Variable name not allowed']
```