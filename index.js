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

let Validator = {
	//SHUNTING-YARD implementation
	shunt: function shunt(expression){
		let tokens = tokenizer.tokenize(expression);
		let operators = [];
		let output = [];
		for(let i = 0; i < tokens.length; i++){
			let token = tokens[i];
			switch(token.type){
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
						last_op.type != "lparenthesis"
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
				case "lparenthesis":
					operators.push(token);
					break;
				case "rparenthesis":
					let j = operators.length - 1;
					while(j >= 0 && (operators[j].type != "lparenthesis")){
						output.push(operators.pop());
						j--;
					}
					if(j == -1){
						return 0;
					}
					if(operators[j].type == "lparenthesis"){
						operators.pop();
						if(operators[operators.length - 1] != undefined){
							if(operators[operators.length - 1].type == "function"){
								output.push(operators.pop());
							}
						}
					}
					break;
			}
		}
		for(let i = operators.length - 1; i >= 0; i--){
			if(operators[i].type == "lparenthesis" || operators[i].type == "rparenthesis"){
				return 0;
			}
			else{
				output.push(operators.pop());
			}
		}
		return output;
	},
	//Validating the output produced by the shunting-yard function
	validate: function validate(expression){
		let output = this.shunt(expression);
		if(output == 0){
			return [0, "Mismatched parenthesis"];
		}
		else{
			while(output.length > 1){
				let i = 0;
				while((output[i].type == "variable" || output[i].type == "number") && i <= output.length){
					i++;
				}
				if(output[i].type == "function" || output[i].type == "unary_operator"){
					if(output[i - 1] != undefined){
						if(output[i - 1].type == "variable" || output[i - 1].type == "number"){
							output.splice(i, 1);
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
			return [1, "Valid expression"];
		}
	}
}
module.exports = Validator;