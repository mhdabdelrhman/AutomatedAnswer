<template>
    <div :class="['reply-container',selected||hover ?'reply-active':'']" @mouseover="hover = true" @mouseleave="hover = false">
        <input type="text" 
        v-model="text" 
        :placeholder="placeHolder" 
        :style="{'width':width}"
        @input="handelChange" 
        @blur="handelFocus(false)" 
        @focus="handelFocus(true)" 
        @keypress.enter="handelEnter"
        :id="id"
        >

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
            },
            id: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                text: this.value,
                placeHolder: 'Reply option',
                hover: false,
            }
        },
        mounted(){
            if(this.selected){
                let input = document.getElementById(this.id);
                input.focus();
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
            handelEnter(){
                this.$emit('enterPressed');
            }
        },
        watch: {
            value: function(to, from) {
                this.text = to;
            },            
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
        position: relative;
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
    .reply-container div {
        display: inline-block;
        width: 21px;
        height: 19px;
        position: absolute;
        top: -4px;
        right: -8px;
        background-color: white;
        color: #3A97F9;
        border-radius: 14px;
        border: 1px solid #3A97F9;
        cursor: pointer;
        text-align: center;
        padding-top: 2px;
    }
    .reply-container div:hover {
        background-color: #3A97F9;
        color: white;
        border-color: white;
    }
    .reply-active {
        background-color: #3A97F9;
    }
    .reply-active input {
        color: white;
    }
</style>
