<template>
    <div :class="['reply-container',selected ?'reply-active':'']">
        <input type="text" v-model="text" @input="handelChange" @blur="handelFocus(false)" @focus="handelFocus(true)" :placeholder="placeHolder" :style="{'width':width}">
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
                placeHolder: 'Reply option'
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
            }
        },
        watch: {
            value: function(to, from) {
                this.text = to;
            }
        }
    }
</script>
<style>
    .reply-container {
        display: inline-block;
        margin: 5px;
        padding: 5px 15px;
        border-radius: 25px;
        border: 1px solid #3A97F9;
        background-color: white;
    }
    .reply-active {
        background-color: #3A97F9;
    }
    .reply-container input {
        min-width: 12px;
        max-width: 200px;
        height: 30px;
        background-color: transparent;
        border: 0px;
        color: #3A97F9;
    }
    .reply-container input::placeholder {
        color: #82BEFD;
    }
    .reply-active input {
        color: white;
    }
</style>
