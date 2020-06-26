import { generateId } from "./utils";

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
  constructor(op, val) {
    this.id = generateId();
    this.text = "";
    this.option = op;
    this.values = val;
  }
}

export var tree = new Chain();

function unselectChainReplies(chain) {
  if (!chain) return;
  for (let i = 0; i < chain.replies.length; i++) {
    let reply = chain.replies[i];
    reply.selected = false;
    unselectChainReplies(reply.next);
  }
}

export var ApplySelection = function(chain, selection) {
  // unselect all reply nodes
  unselectChainReplies(chain);
  // select replies
  for (let i = 0; i < selection.length; i++) {
    let reply = selection[i];
    reply.selected = true;
  }
};

export class SearchService {
  constructor(chain, searchText, callback = null) {
    this.searchText = searchText;
    this.chain = chain;
    this.results = [];
    this.search(callback);
  }

  async search(callback = null) {
    this.results = [];
    if (!this.chain || !this.searchText) return;

    if (this.isChainMatchSearch(this.chain)) this.results.push([]);

    for (let i = 0; i < this.chain.replies.length; i++) {
      this.searchRecursive([this.chain.replies[i]]);
    }

    if (callback) callback(this);
  }

  searchRecursive(arry) {
    let reply = arry[arry.length - 1];
    if (this.isReplyMatchSearch(reply)) {
      this.results.push(arry);
    }

    for (let i = 0; i < reply.next.replies.length; i++) {
      var a = [...arry];
      a.push(reply.next.replies[i]);
      this.searchRecursive(a);
    }
  }

  isReplyMatchSearch(reply) {
    return (
      this.isTextMatchSearch(reply.id) ||
      this.isTextMatchSearch(reply.text) ||
      this.isChainMatchSearch(reply.next)
    );
  }

  isChainMatchSearch(chain) {
    if (this.isTextMatchSearch(chain.id) || this.isTextMatchSearch(chain.text))
      return true;
    for (let i = 0; i < chain.dialogs.length; i++) {
      let dialog = chain.dialogs[i];
      if (this.isDialogMatchSearch(dialog)) return true;
    }
    return false;
  }

  isDialogMatchSearch(dialog) {
    return (
      this.isTextMatchSearch(dialog.id) || this.isTextMatchSearch(dialog.text)
    );
  }

  isTextMatchSearch(text) {
    return text && text.toLowerCase().includes(this.searchText);
  }
}

export class ValidateService {
  constructor(chain, callback = null) {
    this.chain = chain;
    this.invalidPath = null;
    this.validate(callback);
  }

  async validate(callback = null) {
    this.invalidPath = null;
    if (!this.chain) return;
    if (!this.isChainValid(this.chain)) {
      this.invalidPath = [];
      if (callback) callback(this);
      return;
    }

    for (let i = 0; i < this.chain.replies.length; i++) {
      this.validateRecursive([this.chain.replies[i]]);
    }

    if (callback) callback(this);
  }

  validateRecursive(arry) {
    let reply = arry[arry.length - 1];
    if (!this.isReplyValid(reply)) {
      this.invalidPath = arry;
      return;
    }

    for (let i = 0; i < reply.next.replies.length; i++) {
      var a = [...arry];
      a.push(reply.next.replies[i]);
      this.validateRecursive(a);
    }
  }

  isReplyValid(reply) {
    if (!reply.text || reply.text.length == 0) return false;

    if (
      reply.next &&
      reply.next.replies &&
      reply.next.replies.length > 0 &&
      !this.isChainValid(reply.next)
    )
      return false;

    return true;
  }

  isChainValid(chain) {
    return chain.text && chain.text.length > 0;
  }
}
