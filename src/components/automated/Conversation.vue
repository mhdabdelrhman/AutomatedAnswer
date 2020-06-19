<template>
    <div class="conversation-container">
        <div class="search">
            <input v-if="searchResults.length==0" class="input-search" type="text" v-model="searchText" placeholder="Search..." @keypress.enter="handelSearchEnter">
            <v-select v-else :items="searchResults" label="Search results" @change="handelSearchResult"></v-select>
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
                    if (res.results.length > 0) {
                        res.results.forEach(r => {
                            let txt = res.chain.text;
                            r.forEach(p => {
                                txt = txt.concat(", " + p.text);
                            });
                            this.searchResults.push({
                                text: txt,
                                value: r
                            });
                        });
                        this.searchResults.push({
                            text: "Clear results",
                            value: null
                        });
                    } else {
                        alert(`Sorry, we couldn't find any results matching "${this.searchText}".`);
                    }
                    this.searchText = "";
                });
            },
            handelSearchResult(res) {
                if (res != null){
                    ApplySearchResult(this.chain, res);
                }
                else{
                    this.searchResults = [];
                }
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
            margin: 0.5rem;
            height: 50px;
            .input-search {
                height: 2rem;
                margin-top: 0.5rem;
                width: 100%;
                border: 0px;
                border-bottom: 1px solid gray;
            }
        }
    }
</style>
