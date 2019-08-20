
import { DataStore } from './DataStore';
import { MathJs } from './MathJs';
import { CalculationData } from './CalculationData';

import { Type } from '@angular/compiler/src/output/output_ast';
import { TypeProvider } from '@angular/core/src/di/provider';


export class DataStoreManager {

	constructor(private readonly dataStore: DataStore) {
	}

	public save() {

		this.updateVariables();

		var json = JSON.stringify(this.dataStore, ['functions', 'inputHistory', 'htmlHistory', 'variables', 'key', 'value']);
		localStorage.setItem("dataStore", json);

		// console.log("DataStoreManager.save");
		// console.log("dataStore:");
		// console.log(this.dataStore);
		// console.log("json:");
		// console.log(json);
	}

	public load() {
		var json = localStorage.getItem("dataStore");

		var obj: DataStore = JSON.parse(json);

		if (obj == null)
			return;

		if (obj.inputHistory != null)
			this.dataStore.inputHistory = obj.inputHistory;
		if (obj.functions != null)
			this.dataStore.functions = obj.functions;
		if (obj.htmlHistory != null)
			this.dataStore.htmlHistory = obj.htmlHistory;
		if (obj.variables != null)
			this.dataStore.variables = obj.variables;

		this.applyFunctionsToScope();
		this.applyVariablesToScope();

		// console.log("DataStoreManager.load");
		// console.log("loaded obj:");
		// console.log(obj);
		// console.log("dataStore:");
		// console.log(this.dataStore);


	}


	private applyVariablesToScope() {
		for (let entry of this.dataStore.variables) {
			var str = entry.key + "=" + entry.value;
			MathJs.evalStr(str, this.dataStore.scope);
		}
	}

	private applyFunctionsToScope() {
		for (let entry of this.dataStore.functions) {
			var str = entry.key + "=" + entry.value;
			MathJs.evalStr(str, this.dataStore.scope);
		}
	}

	//update variables from scope
	private updateVariables() {
		var keys = Object.keys(this.dataStore.scope).filter(m => typeof this.dataStore.scope[m] !== "function");
		this.dataStore.variables = [];
		keys.forEach(m => this.dataStore.variables.push({ key: m, value: MathJs.evalStr(m, this.dataStore.scope).toString() }));
	}

}
