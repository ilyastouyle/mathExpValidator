let tokenizer = require('mathtokenizer');

function precedence(token){
	if(token.type == "unary_operator"){
		return 2;
	}
	else{
		if(token.value == '+' || token.value == '-'){
			return 1;
		}
		else{
			return 3;
		}
	}
}

function delim_type(delimiter){
	switch(delimiter){
		case '(':
		case ')':
			return 0;
			break;
		case '{':
		case '}':
			return 1;
			break;
		case '[':
		case ']':
			return 2;
			break;
		default:
			return 3;
			break;
	}
}

let Validator = {
	//SHUNTING-YARD implementation
	shunt: function shunt(expression){
		let tokens = tokenizer.tokenize(expression);
		let operators = [];
		let output = [];
		for(let i = 0; i < tokens.length; i++){
			let token = tokens[i];
			switch(token.type){
				case "separator":
					return 0;
				case "number":
				case "variable":
					output.push(token);
					break;
				case "function":
					operators.push(token);
					break;
				case "operator":
				case "unary_operator":
					let last_op = operators[operators.length - 1];
					while(
						last_op != undefined 
								&&
						(last_op.type == "operator" || last_op.type == "unary_operator")
								&&
						last_op.type != "ldelimiter"
								&&
						(precedence(last_op) > precedence(token)
								||
						((precedence(last_op) == precedence(token)) && (token.value != '^')))
						)
					{
						output.push(operators.pop());
						last_op = operators[operators.length - 1];
					}
					operators.push(token);
					break;
				case "ldelimiter":
					operators.push(token);
					break;
				case "rdelimiter":
					if(tokens[i-1] != undefined){
						if(tokens[i-1].type == "ldelimiter"){
							return 0; //empty content delimiters (matched or mismatched)
						}
						else{
							let j = operators.length - 1;
							//popping operators at the top of the stack until reaching a matching left delimiter or else j reaches -1
							while(
								j >= 0 
									&& 
								((operators[j].type != "ldelimiter")
									|| 
								(delim_type(operators[j].value) != delim_type(token.value)))
							){
									output.push(operators.pop());
									j--;
							}
							if(j == -1){ //if no left matching delimiter found
								return 0;
							}
							else{
								operators.pop();
								if(operators[operators.length - 1] != undefined){
									if(operators[operators.length - 1].type == "function"){
										output.push(operators.pop());
									}
								}
							}
						}
					}
					else{
						return 0;
					}
					break;
			}
		}
		//After reading all the tokens we clear out the operator stack 
		for(let i = operators.length - 1; i >= 0; i--){
			//If there are any delimiters left, there is a mismatched delimiter error 
			if(operators[i].type == "ldelimiter" || operators[i].type == "rdelimiter"){
				return 0;
			}
			else{
				output.push(operators.pop());
			}
		}
		return output;
	},
	//Validating the output produced by the shunting-yard function
	//If provided, functions and variables arguments are for accepted function and variable names
	validate: function validate(expression, functions, variables){
		let output = this.shunt(expression);
		if(output == 0){
			return [0, "Mismatched delimiters"];
		}
		if(variables != undefined){
			let t = false;
			output.forEach((element) => {
				if(element.type == "variable" && !variables.includes(element.value)){
					t = true;
				}
			});
			if(t) return [0, "Variable name not allowed"];
		}
		if(output != 0){
			while(output.length > 1){
				let i = 0;
				while((output[i].type == "variable" || output[i].type == "number") && i <= output.length){
					i++;
				}
				if(output[i].type == "function" || output[i].type == "unary_operator"){
					if(output[i - 1] != undefined){
						if(output[i - 1].type == "variable" || output[i - 1].type == "number"){
							if(output[i].type == "function" && functions != undefined){
								if(functions.includes(output[i].value.toLowerCase())){
									output.splice(i, 1);	
								}
								else{
									return [0, "Function name not recognized"];
								}
							}
							else{
								output.splice(i, 1);
							}
						}
						else{
							return (output[i].type == "function") ? [0, "Function parameter error"] : [0, "Insufficient operands"];
						}
					}
					else{
						return (output[i].type == "function") ? [0, "Function parameter error"] : [0, "Insufficient operands"];
					}
				}
				else if(output[i].type == "operator"){
					if(output[i - 2] != undefined && output[i - 1] != undefined){
						if((output[i - 2].type == "number" || output[i - 2].type == "variable") && (output[i - 1].type == "number" || output[i - 1].type == "variable")){
							output.splice(i - 1, 2);
						}
						else{
							return [0, "Insufficient operands"];
						}
					}
					else{
						return [0, "Insufficient operands"];
					}
				}
			}
			return ((output[0].type == "number" || output[0].type == "variable") ? [1, "Valid expression"] : [0, "Insufficient operands"]);
		}
	}
}
module.exports = Validator;