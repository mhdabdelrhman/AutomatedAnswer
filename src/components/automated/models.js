import { generateId } from './utils'

export class Chain {
	constructor() {
		this.id = generateId();
		this.text = "";
		this.replies = [];
		this.dialogs = [];
	}
}

export class Reply {
	constructor() {
		this.id = generateId();
		this.text = "";
		this.next = new Chain();
		this.selected = null;
	}
}

export class Dialog {
	constructor() {
		this.id = generateId();
		this.text = "";
		this.type = "";
	}
}

export var tree = new Chain();