<template>
  <div v-if="value" class="chain-container" :id="value.id">
    <div class="message-node">
      <message-node v-model="value.text" :enabled="enabled" @focused="handelMessageFocused" />
    </div>
    <div class="replies-dialogs-container">
      <reply-node
        v-for="(reply,index) in this.value.replies"
        :key="index"
        :selected="reply.selected"
        :id="reply.id"
        v-model="reply.text"
        @focused="(focused)=>handelFocusReply(index,reply,focused)"
        @delete="handelDeleteReply(index,reply)"
        @enterPressed="handelAddReply"
      />
      <dialog-node
        v-for="(dialog,index) in this.value.dialogs"
        :key="index"
        :id="dialog.id"
        v-model="dialog.text"
        @delete="handelDeleteDialog(index,dialog)"
        @edit="handelEditDialog({chain: value, dialog: dialog, index: index})"
      />
    </div>
    <div class="add-dialog-reply">
      <span
        class="add-dialog"
        v-if="enableAddDialog"
        @click="handelAddDialog(value)"
      >+ ADD DIALOG OPTION</span>
      <span v-if="enableAddDialog && enableAddReply">|</span>
      <span class="add-reply" v-if="enableAddReply" @click="handelAddReply">+ ADD REPLY OPTION</span>
    </div>
    <transition name="fade">
      <chain-node
        v-if="selectedReply && showNextReply"
        v-model="selectedReply.next"
        :enabled="enableEditReplyMessage"
        @messageFocused="handelMessageFocused"
        @addDialog="handelAddDialog"
        @editDialog="handelEditDialog"
      />
    </transition>
  </div>
</template>

<script>
import { tree, Chain, Reply, Dialog } from "./models";
import MessageNode from "./MessageNode";
import ReplyNode from "./ReplyNode";
import DialogNode from "./DialogNode";
import ChainNode from "./ChainNode";
export default {
  name: "chain-node",
  components: {
    "message-node": MessageNode,
    "reply-node": ReplyNode,
    "dialog-node": DialogNode,
    "chain-node": ChainNode
  },
  props: {
    value: {
      type: Object,
      default: tree
    },
    enabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showNextReply: true
    };
  },
  computed: {
    enableAddOption() {
      return this.value && this.value.text && this.value.text.length > 0;
    },
    enableAddReply() {
      return (
        this.enabled &&
        this.enableAddOption &&
        !(this.value.dialogs && this.value.dialogs.length > 0)
      );
    },
    enableAddDialog() {
      return (
        this.enabled &&
        this.enableAddOption &&
        !(this.value.replies && this.value.replies.length > 0)
      );
    },
    selectedReply() {
      if (this.value && this.value.replies) {
        let selected = this.value.replies.find(x => x.selected == true);
        return selected;
      }
      return null;
    },
    enableEditReplyMessage() {
      let enable =
        this.selectedReply &&
        this.selectedReply.text &&
        this.selectedReply.text.length > 0;
      if (enable) return true;
      return false;
    }
  },
  methods: {
    handelMessageFocused(focused) {
      this.$emit("messageFocused", focused);
    },
    handelFocusReply(index, reply, focused) {
      if (focused) {
        this.selectReply(reply);
      }
    },
    handelDeleteReply(index, reply) {
      const showConfirm =
        (reply.next.text && reply.next.text.length > 0) ||
        (reply.next.replies && reply.next.replies.length > 0);
      if (showConfirm) {
        const res = confirm(
          "This will erase the entire chain of nested replies! Are you sure?"
        );
        if (!res) return;
      }
      this.value.replies.splice(index, 1);
      if (reply.selected && this.value.replies.length > 0) {
        const nIndex =
          index - 1 == 0 ? 0 : this.value.replies.length % (index - 1);
        this.selectReply(this.value.replies[nIndex]);
      }
    },
    handelDeleteDialog(index, dialog) {
      const res = confirm(
        "This will erase the dialog and related data! Are you sure?"
      );
      if (!res) return;
      this.value.dialogs.splice(index, 1);
    },
    handelEditDialog(data) {
      this.$emit("editDialog", data);
    },
    handelAddReply() {
      let reply = new Reply();
      this.value.replies.push(reply);
      this.selectReply(reply);
    },
    handelAddDialog(chain) {
      this.$emit("addDialog", chain);
    },
    selectReply(reply) {
      if (!reply.selected) {
        this.showNextReply = false;
        this.value.replies.forEach(x => (x.selected = false));
        reply.selected = true;
        setTimeout(() => {
          this.showNextReply = true;
        }, 100);
      }
    }
  }
};
</script>
<style lang="scss">
$reply-color: #3a97f9;
$dialog-color: #e07b21;
.chain-container {
  .message-node {
    padding-right: 2em;
  }
  .replies-dialogs-container {
    text-align: end;
  }
  .add-dialog-reply {
    text-align: end;
    padding: 0 0.5rem;
    font-weight: bold;
    font-size: 75%;
    margin: 0.5rem 0;
    span {
      margin-left: 1rem;
    }
    .add-dialog {
      cursor: pointer;
      color: $dialog-color;
    }
    .add-reply {
      cursor: pointer;
      color: $reply-color;
    }
  }
  .fade-enter-active {
    transition: opacity 0.5s;
  }
  .fade-leave-active {
    transition: opacity 0.25s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
