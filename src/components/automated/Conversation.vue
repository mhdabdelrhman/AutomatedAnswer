<template>
    <div class="conversation-container">
        <chain-node v-model="chain"></chain-node>
        <div>
            <span @click="saveTreeToLocalStorage">Save</span>
        </div>
    </div>
</template>

<script>
    import tree from './models'
    import ChainNode from './ChainNode'
    export default {
        name: 'conversation',
        components: {
            'chain-node': ChainNode,
        },
        data() {
            return {
                chain: tree,
            }
        },
        methods: {
            saveTreeToLocalStorage() {
                console.log("chain:",JSON.stringify(this.chain));
                localStorage.setItem("chain", JSON.stringify(this.chain));
            },
            loadTreeFromLocalStorage(){
                var loadedChain = JSON.parse(localStorage.getItem("chain"));
                return loadedChain;
            },
            timer() {
                setInterval(() => {
                    this.saveTreeToLocalStorage();
                }, 2000);
    }
        },
        created() {
            // i get error for this 
            // this.chain = this.loadTreeFromLocalStorage()
            this.timer()
            //now this return chain every 2 sec and i test to get chain and it is updated in every 2 sec
        },
    }
</script>
<style></style>
