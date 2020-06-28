<template>
  <div class="conversation-container">
    <div class="search">
      <v-menu v-model="searchMenu" :close-on-content-click="false" :max-height="500" offset-y>
        <template v-slot:activator="{ on }">
          <input
            class="input-search"
            type="text"
            v-model="searchText"
            placeholder="Search..."
            @keypress.enter="handelSearchEnter"
            v-on="on"
          />
        </template>
        <v-card v-if="searchResults && searchResults.length>0">
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Search Results</v-list-item-title>
                <v-list-item-subtitle class="mt-2">
                  Results for '
                  <span>{{lastSearchText}}</span>'
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon color="red" @click="()=>{searchResults = [];searchMenu=false}">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <v-list-item
              v-for="(result,index) in searchResults"
              :key="index"
              @click="handelSearchResult(result.value)"
            >
              <v-list-item-action>{{result.text}}</v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
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
      <v-card-actions v-if="errorMessage">
        <v-alert width="100%" type="error">{{errorMessage}}</v-alert>
      </v-card-actions>
      <v-progress-circular
        v-if="processing"
        class="mr-3"
        indeterminate
        rotate="0"
        size="32"
        width="4"
        color="light-blue"
      ></v-progress-circular>
      <v-btn :disabled="processing" :rounded="true" @click="handelDiscard">Discard</v-btn>
      <v-btn
        :disabled="processing"
        class="ml-3"
        :rounded="true"
        :color="`success`"
        @click="handelSave"
      >Save</v-btn>
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
  applySelection,
  findDeletedUrls
} from "./models";
import {
  deepClone,
  saveToLocalStorage,
  loadFromLocalStorage,
  sleep,
  postSavedDataToServer
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
      lastSearchText: "",
      searchResults: [],
      searchMenu: false,
      dialog: {
        isEdit: false,
        data: null
      },
      errorMessage: null,
      processing: false
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
      this.searchResults = [];
      this.searchMenu = false;
      if (!this.searchText || this.searchText.length == 0) return;

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
          this.searchMenu = true;
        } else {
          alert(
            `Sorry, we couldn't find any results matching "${this.searchText}".`
          );
        }
        this.lastSearchText = this.searchText;
        this.searchText = "";
      });
    },
    handelSearchResult(res) {
      if (res != null) applySelection(this.chain, res);
    },
    handelSave() {
      new ValidateService(this.chain, async res => {
        if (res.invalidPath == null) {
          this.processing = true;
          this.errorMessage = null;
          const deletedUrls = findDeletedUrls(this.baseChain, this.chain);
          postSavedDataToServer(this.chain, deletedUrls).then(res => {
            this.processing = false;
            if (res.success) {
              saveToLocalStorage(this.chain, this.storageName);
              saveToLocalStorage(this.chain, this.baseStorageName);
              this.baseChain = deepClone(this.chain);
            } else {
              this.errorMessage = res.error;
            }
          });
        } else {
          applySelection(this.chain, res.invalidPath);
          await sleep(200);
          alert("Error, Please fill in all the reply fields.");
        }
      });
    },
    handelDiscard() {
      this.errorMessage=null;
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
