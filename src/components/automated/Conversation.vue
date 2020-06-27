<template>
  <div class="conversation-container">
    <div class="search">
      <input
        v-if="searchResults.length==0"
        class="input-search"
        type="text"
        v-model="searchText"
        placeholder="Search..."
        @keypress.enter="handelSearchEnter"
      />
      <v-select v-else :items="searchResults" label="Search results" @change="handelSearchResult"></v-select>
    </div>
    <chain-node
      class="chain-node"
      v-model="chain"
      @addDialog="handelAddDialog"
      @editDialog="handelEditDialog"
    ></chain-node>
    <dialog-modal
      v-if="modal.show"
      :dialogId="dialog.isEdit ? dialog.data.dialog.id : null"
      :option="modal.option"
      :values="modal.values"
      @hide="handelHideModal"
      @save="handelSaveModal"
    />
    <div class="buttons" v-if="showButtons">
      <v-btn :rounded="true" @click="handelDiscard">Discard</v-btn>
      <v-btn class="ml-3" :rounded="true" :color="`success`" @click="handelSave">Save</v-btn>
    </div>
  </div>
</template>

<script>
import {
  tree,
  Chain,
  Dialog,
  SearchService,
  ValidateService,
  applySelection
} from "./models";
import {
  deepClone,
  saveToLocalStorage,
  loadFromLocalStorage,
  sleep
} from "./utils";
import ChainNode from "./ChainNode";
import DialogModal from "./DialogModal";
export default {
  name: "conversation",
  components: {
    "chain-node": ChainNode,
    "dialog-modal": DialogModal
  },
  data() {
    return {
      modal: {
        show: false,
        option: null,
        values: null
      },
      chain: tree,
      baseChain: tree,
      timerWrittenChain: "",
      baseStorageName: "_base_chain_",
      storageName: "_chain_",
      searchText: "",
      searchResults: [],
      dialog: {
        isEdit: false,
        data: null
      }
    };
  },
  computed: {
    showButtons() {
      return JSON.stringify(this.chain) != JSON.stringify(this.baseChain);
    }
  },
  methods: {
    handelHideModal() {
      this.modal.show = false;
    },
    handelSaveModal(data) {
      if (this.dialog.isEdit) {
        //edit dialog
        let dlg = this.dialog.data.dialog;
        dlg.option = data.option;
        dlg.values = data.values;
        dlg.text = data.option.text;
      } else {
        // add dialog
        let dlg = new Dialog(data.option, data.values);
        dlg.text = data.option.text;
        this.dialog.data.dialogs.push(dlg);
      }
      this.modal.show = false;
    },
    handelAddDialog(chain) {
      this.dialog.data = chain;
      this.dialog.isEdit = false;
      this.modal.option = null;
      this.modal.values = null;
      this.modal.show = true;
    },
    handelEditDialog(data) {
      this.dialog.data = data;
      this.dialog.isEdit = true;
      this.modal.option = data.dialog.option;
      this.modal.values = data.dialog.values;
      this.modal.show = true;
    },
    handelSearchEnter() {
      if (!this.searchText || this.searchText.length == 0) {
        this.searchResults = [];
        return;
      }
      new SearchService(this.chain, this.searchText, res => {
        if (res.results.length > 0) {
          res.results.forEach(r => {
            let txt = res.chain.text;
            r.forEach(p => {
              txt = p.text;
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
          alert(
            `Sorry, we couldn't find any results matching "${this.searchText}".`
          );
        }
        this.searchText = "";
      });
    },
    handelSearchResult(res) {
      if (res != null) {
        applySelection(this.chain, res);
      } else {
        this.searchResults = [];
      }
    },
    handelSave() {
      new ValidateService(this.chain, async res => {
        if (res.invalidPath == null) {
          saveToLocalStorage(this.chain, this.storageName);
          saveToLocalStorage(this.chain, this.baseStorageName);
          this.baseChain = deepClone(this.chain);
        } else {
          applySelection(this.chain, res.invalidPath);
          await sleep(200);
          alert("Error, Please fill in all the reply fields.");
        }
      });
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
    this.baseChain = loadFromLocalStorage(this.baseStorageName) || tree;
    this.chain = loadFromLocalStorage(this.storageName) || tree;
    this.timer();
  }
};
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
  position: relative;
  .search {
    z-index: 1;
    background-color: white;
    height: 50px;
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    padding: 0 0.4rem;
    .input-search {
      height: 2rem;
      margin-top: 0.5rem;
      width: 100%;
      border: 0px;
      border-bottom: 1px solid gray;
    }
  }
  .chain-node {
    margin-top: 50px;
    overflow-y: auto;
    margin-bottom: 70px;
  }
  .buttons {
    z-index: 1;
    background-color: white;
    border-top: 1px solid gray;
    padding: 1rem;
    text-align: center;
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }
}
</style>
