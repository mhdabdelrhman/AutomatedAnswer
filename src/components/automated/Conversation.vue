<template>
    <div class="conversation-container">
        <reply-node v-model="chain"></reply-node>
        <div>
            <span @click="handelSave">Save</span>
        </div>
    </div>
</template>

<script>
    import tree from './models'
    import ReplyNode from './ReplyNode'
    export default {
        name: 'conversation',
        components: {
            'reply-node': ReplyNode,
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
