<template>
    <div class="conversation-container">
        <chain-node v-model="chain"></chain-node>
        <div v-if="showButtons">
            <span @click="handelDiscard">Discard </span>
            <span @click="handelSave"> Save</span>
        </div>
    </div>
</template>

<script>
    import {
        tree,
        Chain
    } from './models'
    import {
        deepClone,
        saveToLocalStorage,
        loadFromLocalStorage
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
                baseChain: tree,
                timerWrittenChain: "",
                baseStorageName: "_base_chain_",
                storageName: "_chain_",
            }
        },
        computed: {
            showButtons() {
                return JSON.stringify(this.chain) != JSON.stringify(this.baseChain);
            }
        },
        methods: {
            handelSave() {
                saveToLocalStorage(this.chain, this.storageName);
                saveToLocalStorage(this.chain, this.baseStorageName);
                this.baseChain = deepClone(this.chain);
            },
            handelDiscard() {
                this.chain = deepClone(this.baseChain);
                saveToLocalStorage(this.chain, this.storageName);
            },
            timer() {
                setInterval(() => {
                    if (this.timerWrittenChain != JSON.stringify(this.chain)) {
                        this.timerWrittenChain = JSON.stringify(this.chain);
                        saveToLocalStorage(this.chain, this.storageName);
                    }
                }, 2000);
            }
        },
        created() {
            this.baseChain = loadFromLocalStorage(this.baseStorageName)||tree;
            this.chain = loadFromLocalStorage(this.storageName)||tree;
            this.timer();
        },
    }
</script>
<style>

</style>
