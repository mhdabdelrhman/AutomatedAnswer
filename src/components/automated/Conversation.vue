<template>
    <div class="conversation-container">
        <chain-node v-model="chain"></chain-node>
        <div>
            <span @click="handelSave">Save</span>
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
            handelSave() {
                console.log("chain:",JSON.stringify(this.chain));
            }
        }
    }
</script>
<style>

</style>
