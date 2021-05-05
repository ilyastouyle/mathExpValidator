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