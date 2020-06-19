<template>
    <div class="conversation-container">
        <chain-node v-model="chain"></chain-node>
        <div v-if="showButtons">
            <span @click="handelDiscard">Discard </span>
            <span @click="checkEmptyOption(chain)"> Save</span>
        </div>
    </div>
</template>

<script>
    import {
        tree,
        Chain
    } from './models'
    import {
        deepClone
    } from './utils'
    import ChainNode from './ChainNode'
    export default {
        name: 'conversation',
        components: {
            'chain-node': ChainNode,
        },
        data() {
            return {
                chain: tree,
                lastChain: tree,
                timerWrittenChain:"",
                storageName: "_chain_",
            }
        },
        computed: {
            showButtons() {
                return JSON.stringify(this.chain) != JSON.stringify(this.lastChain);
            }
        },
        methods: {
            handelSave() {
                this.saveTreeToLocalStorage(this.chain);
                this.lastChain = deepClone(this.chain);
            },
            handelDiscard() {
                this.chain = deepClone(this.lastChain);
                this.saveTreeToLocalStorage(this.chain);
            },
            saveTreeToLocalStorage(chainObject) {
                if(chainObject){
                    localStorage.setItem(this.storageName, JSON.stringify(chainObject));
                }
            },
            loadTreeFromLocalStorage() {
                if (localStorage.getItem(this.storageName) && localStorage.getItem(this.storageName).length > 0) {
                    return  JSON.parse(localStorage.getItem(this.storageName));
                }
                return tree;
            },
            timer() {
                setInterval(() => {
                    if(this.timerWrittenChain != JSON.stringify(this.chain)){
                        this.timerWrittenChain = JSON.stringify(this.chain);
                        this.saveTreeToLocalStorage(this.chain);
                    }
                }, 2000);
            },
            checkEmptyOption(data) {
                for (let i = 0; i < data.replies.length; i++) {
                    if (data.replies[i].text == "") {
                    this.showit = true;
                    setTimeout(() => {
                        this.showit = false;
                    }, 5000);
                    return false;
                    } else if (data.replies[i].next.replies.length > 0) {
                    if (!this.checkEmptyOption(data.replies[i].next)) {
                        
                        return false;
                    }
                    }
                }
                this.handelSave()
                return true;
                }
        },
        created() {
            this.lastChain = this.loadTreeFromLocalStorage();
            this.chain = deepClone(this.lastChain);
            this.timer();
        },
    }
</script>
<style>

</style>
