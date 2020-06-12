<template>
    <div v-if="value" class="chain-container" :id="value.id">
        <div>
            <div class="message-node">
                <message-node v-model="value.text" @focused="handelMessageFocused" />
            </div>
            <div class="replies-container">
                <reply-node 
                v-for="(reply,index) in this.value.replies" 
                :key="index" 
                :selected="reply.selected" 
                v-model="reply.text" 
                @focused="(focused)=>handelOptionFocused(index,reply,focused)" 
                @delete="()=>handelOptionDelete(index,reply)" @enterrplay="handelAddReply"/>
            </div>
            <div v-if="enableAddReply" class="add-reply">
                <span @click="handelAddReply">+ ADD REPLY OPTION</span>
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
    import ChainNode from './ChainNode'
    export default {
        name: 'chain-node',
        components: {
            'message-node': MessageNode,
            'reply-node': ReplyNode,
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
            handelMessageFocused(focused) {
                this.$emit("messageFocused", focused);
            },
            handelOptionFocused(index, reply, focused) {
                if (focused) {
                    this.selectReply(reply);
                }
            },
            handelOptionDelete(index, reply) {
                alert('delete reply: ' + reply.text);
            },
            handelAddReply() {
                let reply = new Reply();
                this.value.replies.unshift(reply);
                this.selectReply(reply);
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
    .replies-container {
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
