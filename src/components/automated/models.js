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


export class SearchService {
	constructor(chain, searchText) {
		this.searchText = searchText;
		this.chain = chain;
		this.results = [];
		this.search();
	};

	search() {
		this.results = [];
		if (!this.chain || !this.searchText)
			return;

		if (this.isTextMatchSearch(this.chain.id) || this.isTextMatchSearch(this.chain.text))
			this.results.push([]);

		for (let i = 0; i < this.chain.replies.length; i++) {
			this.searchRecursive([{ replies: this.chain.replies, reply: this.chain.replies[i] }]);
		}
	};

	searchRecursive(arry) {
		let obj = arry[arry.length - 1];
		if (this.isMatchSearch(obj.reply)) {
			this.results.push(arry);
		}

		for (let i = 0; i < obj.reply.next.replies.length; i++) {
			var ary = [...arry];
			ary.push({ replies: obj.reply.next.replies, reply: obj.reply.next.replies[i] });
			this.searchRecursive(ary);
		}
	};

	isMatchSearch(reply) {
		return this.isTextMatchSearch(reply.id)
			|| this.isTextMatchSearch(reply.text)
			|| this.isTextMatchSearch(reply.next.text);
	};

	isTextMatchSearch(text) {
		return text.toLowerCase().includes(this.searchText);
	}
}