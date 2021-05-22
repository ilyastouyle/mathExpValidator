const validator = require('./index');

test("\"(-x+)\" should be invalid", () => {
	expect(validator.validate("(-x+)")[0]).toBe(0);
})

test("\"(-x+2)\" should be valid", () => {
	expect(validator.validate("(-x+2)")[0]).toBe(1);
})

test("\"(-x)-\" should be invalid", () => {
		expect(validator.validate("(-x)-")[0]).toBe(0);
})

test("\"sin(1/x)\" should be valid", () => {
	expect(validator.validate("sin(1/x)")[0]).toBe(1);
})

test("\"sin(1/x-)\" should be invalid", () => {
	expect(validator.validate("sin(1/x-)")[0]).toBe(0);
})

test("\"-\" should be invalid", () => {
	expect(validator.validate("-")[0]).toBe(0);
})

test("\"(\" should be invalid", () => {
	expect(validator.validate("(")[0]).toBe(0);
})	

test("\".\" should be invalid", () => {
	expect(validator.validate(".")[0]).toBe(0);
})

test("\"()\" should be invalid", () => {
	expect(validator.validate("()")[0]).toBe(0);
})

test("\"cos(x)\" should be valid", () => {
	expect(validator.validate("cos(x)")[0]).toBe(1);
})

test("\"( - x + 2 )\" should be valid", () => {
	expect(validator.validate("( - x + 2 )")[0]).toBe(1);
})

test("\"x\" should be valid", () => {
	expect(validator.validate("x")[0]).toBe(1);
})

test("\"x^2\" should be valid", () => {
	expect(validator.validate("x^2")[0]).toBe(1);
})

test("\"cos(t)\" should be invalid", () => {
	expect(validator.validate("cos(t)", ["cos", "sin"], ["x"])[0]).toBe(0);
})

//Added "t" as recognizable variable
test("\"cos(t)\" should be valid", () => {
	expect(validator.validate("cos(t)", ["cos", "sin"], ["x", "t"])[0]).toBe(1);
})

//Unrecognized "cas" function
test("\"cas(t)\" should be invalid", () => {
	expect(validator.validate("cas(t)", ["cos", "sin"], ["x", "t"])[0]).toBe(0);
})

//Added "cas" function as recognizable
test("\"cas(x*t)\" should be valid, added \"cas\" function as recognizable", () => {
	expect(validator.validate("cas(x*t)", ["cas", "cos", "sin"], ["x", "t"])[0]).toBe(1);
})

test("\"exp(2x)\" should be valid", () => {
	expect(validator.validate("exp(2x)", ["cos", "exp", "sin"], ["x"])[0]).toBe(1);
})

test("\"exp(cosh(2x))\" should be invalid", () => {
	expect(validator.validate("exp(cosh(2x))", ["cos", "exp", "sin"], ["x"])[0]).toBe(0);
})

//Added support for "cosh"
test("\"exp(cosh(2x))\" should be valid, with added support for \"cosh\"", () => {
	expect(validator.validate("exp(cosh(2x))", ["cos", "cosh", "exp", "sin"], ["x"])[0]).toBe(1);
})

//Mismatched delimiters
test("\"sin(x}\" should be invalid", () => {
	expect(validator.validate("sin(x}")[0]).toBe(0);
})

test("\"2*(sin(x)+1}\" should be invalid", () => {
	expect(validator.validate("2*(sin(x)+1}")[0]).toBe(0);
})

test("\"2*{sin(x)+1}\" should be valid", () => {
	expect(validator.validate("2*{sin(x)+1}")[0]).toBe(1);
})

test("\"2*[sin{x}+1]]\" should be invalid", () => {
	expect(validator.validate("2*[sin{x}+1]]")[0]).toBe(0);
})

