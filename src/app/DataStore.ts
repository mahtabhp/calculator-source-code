
export class DataStore {

	public scope: any;

	public functions: { key: string, value: string }[];

	public inputHistory: string[];

	public htmlHistory: string;

	public variables: { key: string, value: string }[];

	constructor() {
		this.reset();
	}

	public reset() {
		this.scope = {};
		this.inputHistory = [];
		this.htmlHistory = "";
		this.functions = [];
		this.variables = [];
	}




}
