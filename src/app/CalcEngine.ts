
import { CalculationData } from './CalculationData';
import { DataStore } from './DataStore';
import { MathJs } from './MathJs';

export class CalcEngine {

	constructor(private readonly dataStore: DataStore) {
	}

	public evaluate(input: string): CalculationData {
		console.log("CalcEngine.evaluate: " + input);

		input = input.trim();

		var data = new CalculationData();
		data.input = input;

		//validation
		if (input == null || input === "") { //should not happen
			data.errorMessage = "Empty input";
			return data;
		}

		//comment
		const isComment = this.isComment(input);
		if (isComment) {
			data.isComment = true;
			return data;
		}

		//command
		var isCommand = this.processCommand(data);
		if (isCommand) {
			return data;
		}

		//evaluate math
		MathJs.eval(data, this.dataStore.scope);

		console.log(data);
		if (this.isFunctionFromMathJsOutput(data.result)) {
			//function store
			if (this.isFunctionDefinition(input)) {
				data.result = "Function is defined successfully";
				var fun = input.split(/=(.+)/);
				var key = fun[0];
				var val = fun[1];

				var keyVal = this.dataStore.functions.find(m => m.key === key);
				if (keyVal === undefined) {
					this.dataStore.functions.push({ key: fun[0], value: fun[1] });
				} else {
					keyVal.value = val;
				}
			}
			// function assignment
			else {
				data.errorMessage='Unexpected function usage'
			}
		}

		console.info(this.dataStore.scope);
		return data;
	}

	private hasAssignment(input: string): boolean {

		if (input == null)
			return false;

		var position = input.indexOf("=");

		if (position < 0) return false;

		if (position >= 1) {
			var ch = input.charAt(position - 1);
			if (ch == "=" || ch == ">" || ch == "<" || ch == "!")
				return false;
		}

		if (position < input.length - 1) {
			var ch = input.charAt(position + 1);
			if (ch == "=")
				return false;
		}

		return true;
	}

	//output of math.eval must be used as input
	private isFunctionFromMathJsOutput(input: string): boolean {

		if (input == null)
			return false;

		console.log(input);
		var isFunc = input.startsWith("function ");

		return isFunc;
	}


	private isFunctionDefinition(input: string): boolean {

		if (input == null)
			return false;

		if (!this.hasAssignment(input))
			return false;

		var fun = input.split(/=(.+)/);
		var key: string = fun[0];
		var val: string = fun[1];

		if (!key.includes("(") || !key.includes(")"))
			return false;

		return true;
	}

	private isComment(input: string): boolean {

		if (input == null)
			return false;

		var isComment = input.startsWith("#");

		return isComment;
	}

	//returned true: it was a command
	private processCommand(output: CalculationData): boolean {

		var command: string = null;

		var input = output.input.trim().toLowerCase();
		var params = input.split(" ").filter(m => m != null && m != "");
		command = params.shift();

		console.log("CalcEngine.processCommand");
		console.log("command: " + command);
		console.log("params: " + params);

		var ret: boolean = true;
		if (command == "clear" || command == "clr") {
			output.input = null;
			this.dataStore.htmlHistory = "";

			if (params.includes("all") || params.includes("-all")) {
				this.dataStore.reset();
			}
		}
		else {
			ret = false;
		}

		return ret;
	}

}
