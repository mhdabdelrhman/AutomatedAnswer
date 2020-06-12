<template>
    <div v-if="value" class="chain-container" :id="value.id">
        <div>
            <div class="message-node">
                <message-node v-model="value.text" @focused="handelMessageFocused" />
            </div>
            <div class="replies-dialogs-container">
                <reply-node v-for="(reply,index) in this.value.replies" :key="index" :selected="reply.selected" v-model="reply.text" @focused="(focused)=>handelFocusReply(index,reply,focused)" @delete="handelDeleteReply(index,reply)" @enterPressed="handelAddReply" />
                <dialog-node v-for="(dialog,index) in this.value.dialogs" :key="index" v-model="dialog.text" @delete="handelDeleteDialog(index,dialog)" @edit="handelEditDialog(index,dialog)" />
            </div>
            <div class="add-dialog-reply">
                <span class="add-dialog" v-if="enableAddDialog" @click="handelAddDialog">+ ADD DIALOG OPTION</span>
                <span v-if="enableAddDialog && enableAddReply">|</span>
                <span class="add-reply" v-if="enableAddReply" @click="handelAddReply">+ ADD REPLY OPTION</span>
            </div>
            <transition name="fade">
                <chain-node v-if="selectedReply && showNextReply" v-model="selectedReply.next" @messageFocused="handelMessageFocused" />
            </transition>
        </div>
    </div>
</template>

<script>
    import {
        Chain,
        Reply,
        Dialog
    } from './models'
    import MessageNode from './MessageNode'
    import ReplyNode from './ReplyNode'
    import DialogNode from './DialogNode'
    import ChainNode from './ChainNode'
    export default {
        name: 'chain-node',
        components: {
            'message-node': MessageNode,
            'reply-node': ReplyNode,
            'dialog-node': DialogNode,
            'chain-node': ChainNode,
        },
        props: {
            value: {
                type: Chain,
                default: () => new Chain(),
            }
        },
        data() {
            return {
                showNextReply: true,
            }
        },
        computed: {
            enableAddOption() {
                return this.value && this.value.text && this.value.text.length > 0;
            },
            enableAddReply() {
                return this.enableAddOption && !(this.value.dialogs && this.value.dialogs.length > 0);
            },
            enableAddDialog() {
                return this.enableAddOption && !(this.value.replies && this.value.replies.length > 0);
            },
            selectedReply() {
                if (this.value && this.value.replies) {
                    let selected = this.value.replies.find(x => x.selected == true);
                    return selected;
                }
                return null;
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
                const showConfirm = (reply.next.text && reply.next.text.length > 0) ||
                    (reply.next.replies && reply.next.replies.length > 0);
                if (showConfirm) {
                    const res = confirm("This will erase the entire chain of nested replies! Are you sure?");
                    if (!res)
                        return;
                }
                this.value.replies.splice(index, 1);
                if (reply.selected && this.value.replies.length > 0) {
                    const nIndex = this.value.replies.length % (index - 1);
                    this.selectReply(this.value.replies[nIndex]);
                }
            },
            handelDeleteDialog(index, dialog) {
                const res = confirm("This will erase the dialog and related data! Are you sure?");
                if (!res)
                    return;
                    this.value.dialogs.splice(index, 1);
            },
            handelEditDialog(index, dialog) {
                alert("edit dialog here");
            },
            handelAddReply() {
                let reply = new Reply();
                this.value.replies.unshift(reply);
                this.selectReply(reply);
            },
            handelAddDialog() {
                // show modal here
                alert("dialog model here");
                // then add dialog
                let dialog = new Dialog();
                // assgin data to dialog
                dialog.text = "Test dialog";
                this.value.dialogs.unshift(dialog);
            },
            selectReply(reply) {
                if (!reply.selected) {
                    this.showNextReply = false;
                    this.value.replies.forEach(x => x.selected = false);
                    reply.selected = true;
                    setTimeout(() => {
                        this.showNextReply = true;
                    }, 100);
                }
            },
        },
    }
</script>
<style>
    .chain-container .message-node {
        padding-right: 2em;
    }
    .replies-dialogs-container {
        text-align: end;
    }
    .add-dialog-reply {
        text-align: end;
        padding: 0 8px;
        font-weight: bold;
        font-size: 75%;
        margin: 5px 0;
    }
    .add-dialog-reply span {
        margin-left: 20px;
    }
    .add-dialog {
        cursor: pointer;
        color: #E07B21;
    }
    .add-reply {
        cursor: pointer;
        color: #4DA2FC;
    }
    .fade-enter-active {
        transition: opacity .5s
    }
    .fade-leave-active {
        transition: opacity .25s
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0
    }
</style>
