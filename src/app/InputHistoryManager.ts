import { DataStore } from './DataStore';

export class InputHistoryManager {

	private maxInputHistory: number = 20;
	private currentInputHistoryIndex: number;

	constructor(private readonly dataStore: DataStore) {
		this.currentInputHistoryIndex = -1;
	}

	public addInputHistory(input: string) {

		//validate
		if (input == null || input.trim() == "") {
			return;
		}

		//
		this.dataStore.inputHistory.unshift(input);

		while (this.dataStore.inputHistory.length > this.maxInputHistory)
			this.dataStore.inputHistory.pop();

		this.currentInputHistoryIndex = -1;
	}

	public getInputHistory(isUp: boolean): string {

		if (this.dataStore.inputHistory.length == 0)
			return null;

		var output: string = null;

		if (isUp) {
			if (this.currentInputHistoryIndex >= this.dataStore.inputHistory.length - 1)
				return null;
			this.currentInputHistoryIndex++;
			output = this.dataStore.inputHistory[this.currentInputHistoryIndex];
		}
		else {
			if (this.currentInputHistoryIndex <= 0)
				return null;
			this.currentInputHistoryIndex--;
			output = this.dataStore.inputHistory[this.currentInputHistoryIndex];
		}

		return output;
	}
}
