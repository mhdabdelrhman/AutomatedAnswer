<template>
    <div class="dialog-container" @mouseover="hover = true" @mouseleave="hover = false">
        <label>{{value}}</label>
        <i @click="handelEdit">Edit</i>
        <transition name="fade">
            <div v-show="hover">
                <span @click="handelDelete">X</span>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'dialog-node',
        props: {
            value: {
                type: String,
                default: "",
            }
        },
        data() {
            return {
                hover: false,
            }
        },
        computed: {},
        methods: {
            handelDelete() {
                this.$emit('delete');
            },
            handelEdit() {
                this.$emit('edit');
            }
        },
        watch: {
            value: function(to, from) {}
        }
    }
</script>
<style lang="scss">
    $dialog-color-b:#E07B21;
    $dialog-color-f:white;
    .dialog-container {
        display: inline-block;
        margin: 5px;
        padding: 12px 15px;
        border-radius: 25px;
        border: 1px solid $dialog-color-b;
        background-color: $dialog-color-b;
        color: $dialog-color-f;
        position: relative;
        div {
            display: inline-block;
            width: 21px;
            height: 19px;
            position: absolute;
            top: -4px;
            right: -8px;
            background-color: $dialog-color-f;
            color: $dialog-color-b;
            border-radius: 14px;
            border: 1px solid $dialog-color-b;
            cursor: pointer;
            text-align: center;
            padding-top: 2px;
        }
        div:hover {
            background-color: $dialog-color-b;
            color: $dialog-color-f;
            border-color: $dialog-color-f;
        }
    }
</style>
