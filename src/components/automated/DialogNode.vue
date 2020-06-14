<template>
    <div class="dialog-container" @mouseover="hover = true" @mouseleave="hover = false">
        <label :id="id" >{{value}}</label>
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
        computed: {
            
        },
        methods: {            
            handelDelete() {
                this.$emit('delete');
            },
            handelEdit(){
                this.$emit('edit');
            }
        },
        watch: {
            value: function(to, from) {
            }
        }
    }
</script>
<style>
    .dialog-container {
        display: inline-block;
        margin: 5px;
        padding: 12px 15px;
        border-radius: 25px;
        border: 1px solid #E07B21;
        background-color: white;
        position: relative;
    }
    .dialog-container div {
        display: inline-block;
        width: 21px;
        height: 19px;
        position: absolute;
        top: -4px;
        right: -8px;
        background-color: white;
        color: #E07B21;
        border-radius: 14px;
        border: 1px solid #E07B21;
        cursor: pointer;
        text-align: center;
        padding-top: 2px;
    }
    .dialog-container div:hover {
        background-color: #E07B21;
        color: white;
        border-color: white;
    }
</style>
