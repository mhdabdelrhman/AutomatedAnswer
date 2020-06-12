<template>
  <div class="conversation-container">
    <chain-node v-model="chain"></chain-node>
    <div>
      <span @click="handelSave">Save</span>
    </div>
  </div>
</template>

<script>
import tree from "./models";
import ChainNode from "./ChainNode";
export default {
  name: "conversation",
  components: {
    "chain-node": ChainNode,
  },
  data() {
    return {
      chain: tree,
    };
  },
  methods: {
    handelSave() {
      localStorage.setItem("chain", JSON.stringify(this.chain));
      console.log("chain:", JSON.stringify(this.chain));
    },
    hanedelLoadChain() {
      var newChain = JSON.stringify(this.chain);
      newChain = localStorage.getItem("chain");
      console.log(newChain);
    },
    timer() {
      setInterval(() => {
        this.handelSave();
      }, 2000);
    },
  },
  async created() {
    await this.handelSave();
    console.log("this go second");
    await this.hanedelLoadChain();
    this.timer();
  },
};
</script>
<style></style>
