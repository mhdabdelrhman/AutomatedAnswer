<template>
    <div v-if="value" class="reply-container" :id="value.id">
        <div>
            <div class="message-node">
                <message-node v-model="value.text" @focusToggled="handelMessageFocusToggled" />
            </div>
            <div class="options-container">
                <option-node v-for="(reply,index) in this.value.replies" :key="index" :selected="reply.selected" v-model="reply.text" @focusToggled="(focused)=>handelOptionFocusToggled(index,reply,focused)" />
            </div>
            <div v-if="enableAddReply" class="add-reply">
                <span @click="handelAddReply">+ ADD REPLY OPTION</span>
            </div>
            <transition name="fade">
                <reply-node v-if="selectedReply && showReply" v-model="selectedReply.next" @messageFocusToggled="handelMessageFocusToggled" />
            </transition>
        </div>
    </div>
</template>

<script>
    import {
        Chain,
        Reply
    } from './models'
    import MessageNode from './MessageNode'
    import OptionNode from './OptionNode'
    import ReplyNode from './ReplyNode'
    export default {
        name: 'reply-node',
        components: {
            'message-node': MessageNode,
            'option-node': OptionNode,
            'reply-node': ReplyNode,
        },
        props: {
            value: {
                type: Chain,
                default: () => new Chain(),
            }
        },
        data() {
            return {
                showReply: true,
            }
        },
        computed: {
            enableAddReply() {
                return this.value &&
                    ((this.value.text && this.value.text.length > 0) ||
                        (this.value.replies && this.value.replies.length > 0));
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
            handelMessageFocusToggled(focused) {
                this.$emit("messageFocusToggled", focused);
            },
            handelOptionFocusToggled(index, reply, focused) {
                if (focused) {
                    this.selectReply(reply);
                }
            },
            handelAddReply() {
                let reply = new Reply();
                this.value.replies.push(reply);
                this.selectReply(reply);
            },
            selectReply(reply) {
                if (!reply.selected) {
                    this.showReply = false;
                    this.value.replies.forEach(x => x.selected = false);
                    reply.selected = true;
                    setTimeout(() => {
                        this.showReply = true;
                    }, 100);
                }
            }
        },
    }
</script>
<style>
    .reply-container .message-node {
        padding-right: 2em;
    }
    .options-container {
        text-align: end;
    }
    .add-reply {
        cursor: pointer;
        text-align: end;
        color: #4DA2FC;
        padding: 0 8px;
        font-weight: bold;
        font-size: 75%;
        margin: 5px 0;
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
