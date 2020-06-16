<template>
    <div :class="['reply-container',selected||hover ?'reply-active':'']" @mouseover="hover = true" @mouseleave="hover = false">
        <input type="text" v-model="text" :placeholder="placeHolder" :style="{'width':width}" @input="handelChange" @blur="handelFocus(false)" @focus="handelFocus(true)" @keypress.enter="handelEnter">
        <transition name="fade">
            <div v-show="hover">
                <span @click="handelDelete">X</span>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'reply-node',
        props: {
            value: {
                type: String,
                default: "",
            },
            selected: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                text: this.value,
                placeHolder: 'Reply option',
                hover: false,
            }
        },
        computed: {
            width() {
                let txt = this.placeHolder;
                if (this.text && this.text.length > 0)
                    txt = this.text;
                return ((txt.length + 1) * 6.5) + 'px';
            }
        },
        methods: {
            handelChange() {
                this.$emit('input', this.text);
            },
            handelFocus(isFocused) {
                this.$emit('focused', isFocused);
            },
            handelDelete() {
                this.$emit('delete');
            },
            handelEnter() {
                this.$emit('enterPressed');
            }
        },
        watch: {
            value: function(to, from) {
                this.text = to;
            }
        }
    }
</script>
<style lang="scss">
    $reply-color-b:#3A97F9;
    $reply-color-f:white;
    $reply-place-holder:#82BEFD;
    
    .reply-container {
        display: inline-block;
        margin: 5px;
        padding: 5px 15px;
        border-radius: 25px;
        border: 1px solid $reply-color-b;
        background-color: $reply-color-f;
        position: relative;
        input {
            min-width: 12px;
            max-width: 200px;
            height: 30px;
            background-color: transparent;
            border: 0px;
            color: $reply-color-b;
        }
        input::placeholder {
            color: $reply-place-holder;
        }
        div {
            display: inline-block;
            width: 21px;
            height: 19px;
            position: absolute;
            top: -4px;
            right: -8px;
            background-color: $reply-color-f;
            color: $reply-color-b;
            border-radius: 14px;
            border: 1px solid $reply-color-b;
            cursor: pointer;
            text-align: center;
            padding-top: 2px;
        }
        div:hover {
            background-color: $reply-color-b;
            color: $reply-color-f;
            border-color: $reply-color-f;
        }
    }
    .reply-active {
        background-color: $reply-color-b;
        input {
            color: $reply-color-f;
        }
    }
</style>
