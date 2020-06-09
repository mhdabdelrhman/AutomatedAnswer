import generateId from './utils'

export class Chain {
	constructor() {
		this.id = generateId();
		this.text = "";
		this.replies = [];
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
var tree = new Chain();
export default tree;