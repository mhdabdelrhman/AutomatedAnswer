<template>
    <div class="conversation-container">
        <div class="search">
            <input v-if="searchResults.length==0" class="input-search" type="text" v-model="searchText" placeholder="Search..." @keypress.enter="handelSearchEnter">
            <v-select v-else :items="searchResults" label="Search results" @change="handelSearchResult"></v-select>
        </div>
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
        Chain,
        SearchService,
        ApplySearchResult
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
                searchText: "",
                searchResults: [],
            }
        },
        computed: {
            showButtons() {
                return JSON.stringify(this.chain) != JSON.stringify(this.baseChain);
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
            this.baseChain = loadFromLocalStorage(this.baseStorageName)||tree;
            this.chain = loadFromLocalStorage(this.storageName)||tree;
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
