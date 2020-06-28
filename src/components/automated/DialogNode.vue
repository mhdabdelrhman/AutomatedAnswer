<template>
    <div class="dialog-container option-node" @mouseover="hover = true" @mouseleave="hover = false">
        <v-icon class="mr-3" medium color="#f6ff00" @click="handelEdit">mdi-pen</v-icon>
        <label :id="id" >{{value}}</label>
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
            },
            id: {
                type: String,
                default: ""
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
        border: 1px solid $dialog-color-b;
        background-color: $dialog-color-b;
        color: $dialog-color-f;
        div {
            display: inline-block;
            width: 1.4rem;
            height: 1.45rem;
            position: absolute;
            top: -4px;
            right: -8px;
            background-color: $dialog-color-f;
            color: $dialog-color-b;
            border-radius: 14px;
            border: 1px solid $dialog-color-b;
            cursor: pointer;
            text-align: center;
        }
        div:hover {
            background-color: $dialog-color-b;
            color: $dialog-color-f;
            border-color: $dialog-color-f;
        }
    }
</style>
