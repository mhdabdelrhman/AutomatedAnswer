<template>
    <div class="message-container">
        <div class="icon-container">
            <svg viewBox="0 0 24 30">
                                    <g fill="none" fill-rule="evenodd">
                                        <rect stroke="#BBB" stroke-width="2" x="1" y="5" width="22" height="24" rx="3"></rect>
                                        <path d="M6 22c3.916 1.62 7.916 1.62 12 0" stroke="#BBB" stroke-width="2" stroke-linecap="round"></path>
                                        <path d="M9 1c1.958 1.62 3.958 1.62 6 0" stroke="#BBB" stroke-linecap="round"></path>
                                        <circle fill="#23C749" cx="18" cy="13" r="2"></circle>
                                        <circle fill="#2A80BA" cx="12" cy="13" r="2"></circle>
                                        <circle fill="#FF3EF4" cx="6" cy="13" r="2"></circle>
                                    </g>
                                </svg>
        </div>
        <div class="input-container">
            <input type="text" v-model="text" @input="handelChange" @blur="handelFocus(false)" @focus="handelFocus(true)" :placeholder="placeHolder">
        </div>
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
                placeHolder: 'Bot message'
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
<style lang="scss">
    $msg-color-b:#F1F3F5;
    $msg-color-f:#666669;
    $msg-place-holder:#ADADB4;
    .message-container {
        margin: 0.5rem;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        .icon-container {
            margin-right: 0.9rem;
            margin-top: 0.2rem;
            width: 1.5rem;
        }
        .input-container {
            padding: 0.5rem 1rem;
            background-color: $msg-color-b;
            border-radius: 10px;
            flex-grow: 1;
            input {
                width: 100%;
                background-color: transparent;
                border: 0px;
                color: $msg-color-f;
            }
            input::placeholder {
                color: $msg-place-holder;
            }
        }
    }
</style>
