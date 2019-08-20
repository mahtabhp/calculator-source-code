import { Component, HostListener, OnInit, NgModule } from '@angular/core';
import { CalculationData } from './CalculationData';
import { CalcEngine } from './CalcEngine';
import { DataStore } from './DataStore';
import { InputHistoryManager } from './InputHistoryManager';
import { DataStoreManager } from './DataStoreManager';


@Component({
	// tslint:disable-next-line:indent
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

	newline: HTMLTextAreaElement;
	private readonly calcEngine: CalcEngine;
	readonly dataStore: DataStore;
	private readonly inputHistoryManager: InputHistoryManager;
	private readonly dataStoreManager: DataStoreManager;

	constructor() {

		this.dataStore = new DataStore();
		this.dataStoreManager = new DataStoreManager(this.dataStore);
		this.dataStoreManager.load();

		this.calcEngine = new CalcEngine(this.dataStore);
		this.inputHistoryManager = new InputHistoryManager(this.dataStore);

		//console.log("AppComponent constructor end");
	}

	ngOnInit() {
		this.newline = <HTMLTextAreaElement>document.getElementById('id-newline');
		//console.log("ngOnInit end");
	}

	@HostListener('document:keydown', ['$event'])
	private handleKeyboardEvent(event: KeyboardEvent) {
		//console.log("key pressed: " + event.keyCode);

		//handle focus
		let validKeyFoucus = event.key != null && event.key.length === 1;
		validKeyFoucus = validKeyFoucus ||
			event.key === 'ArrowUp' ||
			event.key === 'ArrowDown' ||
			event.keyCode === 13 ||
			event.keyCode === 10 ||
			event.key === 'Backspace';

		if (validKeyFoucus) {
			this.newline.focus();
		}


		//handle control keys
		if (event.keyCode === 13 || event.keyCode === 10) { //enter
			event.preventDefault();
			this.processEnter();
		}
		else if (event.key === 'ArrowUp') { //up
			event.preventDefault();
			this.processUpDown(true);
		}
		else if (event.key === 'ArrowDown') { //down
			event.preventDefault();
			this.processUpDown(false);
		}
	}


	private setNewlineValue(input: string) {
		this.newline.value = input;
	}

	private getNewlineValue(): string {
		return this.newline.value;
	}


	private processEnter() {
		//console.log("Enter pressed");
		var input = this.getNewlineValue();

		var output = this.processInput(input);
		this.addHistory(output);
		this.inputHistoryManager.addInputHistory(input);

		this.setNewlineValue("");

		this.dataStoreManager.save();
	}

	private processUpDown(isUp: boolean) {
		//console.log("UpDown pressed: " + isUp);

		var temp = this.inputHistoryManager.getInputHistory(isUp);
		if (temp != null) {
			this.setNewlineValue(temp);
		}
	}

	private addHistory(rec: string) {
		//console.log("history: " + rec);

		//validate
		if (rec == null || rec.trim() == "")
			return;

		//
		this.dataStore.htmlHistory += "<div>" + rec + "</div>";
	}

	private processInput(input: string) {
		//console.log("processInput: " + input);

		//validation
		if (input == null || input.trim() == "") {
			return "<pre class='class-history-record'>></pre>";
		}

		var result = this.calcEngine.evaluate(input);

		//console.log(this.dataStore.scope);
		//console.log(result);

		var output = null;

		if (result.input == null)
			output = null;
		else if (result.errorMessage != null)
			output = "<pre class='class-history-record'>> " + result.input + "<pre class='class-history-output-error'>" + result.errorMessage + "</pre></pre>";
		else if (result.result != null)
			output = "<pre class='class-history-record'>> " + result.input + "<pre class='class-history-output'>" + result.result + "</pre></pre>";
		else
			output = "<pre class='class-history-record " + (result.isComment ? "class-history-comment" : "") + "'>> " + result.input + "</pre>";

		return output;
	}

}
