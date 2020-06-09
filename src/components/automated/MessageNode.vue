<template>
    <div class="message-container">
        <input type="text" v-model="text" @input="handelChange" @blur="handelFocus(false)" @focus="handelFocus(true)" placeholder="Bot message">
    </div>
</template>

<script>
    export default {
        name: 'message-node',
        props: {
            value: {
                type: String,
                default: "",
            }
        },
        data() {
            return {
                text: this.value,
                focused: false,
            }
        },
        methods: {
            handelChange() {
                this.$emit('input', this.text);
            },
            handelFocus(isFocused) {
                if (this.focused != isFocused) {
                    this.focused = isFocused;
                    this.$emit('focusToggled', this.focused);
                }
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
    .message-container {
        margin: 5px;
        padding: 5px 15px;
        background-color: #F1F3F5;
        border-radius: 15px;
    }
    .message-container input {
        width: 100%;
        height: 30px;
        background-color: transparent;
        border: 0px;
        color: #666669;
    }
    .message-container input::placeholder {
        color: #ADADB4;
    }
</style>
