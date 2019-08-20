declare var require: any;
var mathjs = require('./math.js');

import { CalculationData } from "./CalculationData";

export class MathJs {

	public static eval(data: CalculationData, scope: any) {
		try {
			//console.log("MathJs.eval: " + data.input);
			var res = mathjs.eval(data.input, scope);
			//console.log(res);
			data.result = res.toString();

		} catch (e) {
			data.errorMessage = e.message;
			console.error("MathJs.eval Exception: " + data.errorMessage);
		}
	}

	public static evalStr(input: string, scope: any): string {
		var data = new CalculationData();
		data.input = input;
		MathJs.eval(data, scope);
		return data.result;
	}
}
