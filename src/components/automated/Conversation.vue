<template>
    <div class="conversation-container">
        <div class="search">
            <input type="text" v-model="searchText" placeholder="Search..." @keypress.enter="handelSearchEnter">
        </div>
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
        Chain,
        SearchService,
        ApplySearchResult
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
                timerWrittenChain: "",
                storageName: "_chain_",
                searchText: "",
                searchResults: [],
            }
        },
        computed: {
            showButtons() {
                return JSON.stringify(this.chain) != JSON.stringify(this.lastChain);
            }
        },
        methods: {
            handelSearchEnter() {
                if (!this.searchText || this.searchText.length == 0) {
                    this.searchResults = [];
                    return;
                }
                new SearchService(this.chain, this.searchText, (res) => {
                    this.searchResults = res.results;
                    if (this.searchResults && this.searchResults.length > 0) {
                        ApplySearchResult(this.chain, this.searchResults[0]);
                    }
                });
            },
            handelSave() {
                this.saveTreeToLocalStorage(this.chain);
                this.lastChain = deepClone(this.chain);
            },
            handelDiscard() {
                this.chain = deepClone(this.lastChain);
                this.saveTreeToLocalStorage(this.chain);
            },
            saveTreeToLocalStorage(chainObject) {
                if (chainObject) {
                    localStorage.setItem(this.storageName, JSON.stringify(chainObject));
                }
            },
            loadTreeFromLocalStorage() {
                if (localStorage.getItem(this.storageName) && localStorage.getItem(this.storageName).length > 0) {
                    return JSON.parse(localStorage.getItem(this.storageName));
                }
                return tree;
            },
            timer() {
                setInterval(() => {
                    if (this.timerWrittenChain != JSON.stringify(this.chain)) {
                        this.timerWrittenChain = JSON.stringify(this.chain);
                        this.saveTreeToLocalStorage(this.chain);
                    }
                }, 2000);
            }
        },
        created() {
            this.lastChain = this.loadTreeFromLocalStorage();
            this.chain = deepClone(this.lastChain);
            this.timer();
        },
    }
</script>
<style lang="scss">
    .option-node {
        display: inline-block;
        margin: 0.5rem;
        padding: 0.5rem 0.9rem;
        border-radius: 25px;
        position: relative;
    }
    .conversation-container {
        .search {
            text-align: end;
            input {
                height: 2rem;
                border: 1px solid gray;
                padding: 0 0.5rem;
                border-radius: 6px;
                margin-bottom: 10px;
            }
        }
    }
</style>
