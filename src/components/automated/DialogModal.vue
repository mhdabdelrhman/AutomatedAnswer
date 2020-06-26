<template>
  <div class="dialog-modal">
    <v-btn @click="dialog = true">
      Click
    </v-btn>
    <v-dialog v-model="dialog" persistent scrollable max-width="500px">
      <v-card class="pa-2">
        <v-menu>
          <template v-slot:activator="{ on }">
                <v-btn color="primary"  v-on="on" class="mt-2">
                  {{selectedOptionTitle}}
                </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(option,index) in options" :key="index" @click="handelSelectOption(option,index)" dense>{{option.text}}
            </v-list-item>
          </v-list>
        </v-menu>
        <v-card-actions v-if="showMessageText">
          <v-text-field prepend-icon="mdi-android-messages" label="Message"></v-text-field>
        </v-card-actions>
        <v-card-actions>          
          <v-file-input 
          v-if="selectedOption && selectedOption.type=='file'" 
          :rules="rules" 
          :accept="selectedOption.input.accept" 
          :placeholder="selectedOption.placeholder"
          :prepend-icon="selectedOption.icon" 
          :label="selectedOption.text">
          </v-file-input>
        </v-card-actions>
        <v-card-actions>
          <v-btn :rounded="true" @click="handelClose">Close</v-btn>
          <v-btn class="ml-3" :rounded="true" :color="`success`" @click="handelSave" v-if="showSaveButton">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import dialog_options from './config';
  export default {
    data() {
      return {
        options: dialog_options,
        selectedOption: null,
        htmlContent: "",
        dialog: false,
        rules: [
          (value) => !value || value.size < 2000000 || "file size should be less than 2 MB!",
        ],
      }
    },
    computed: {
      showSaveButton() {
        return this.selectedOption != null;
      },
      showMessageText() {
        return this.selectedOption != null;
      },
      selectedOptionTitle() {
        if (this.selectedOption == null)
          return "Select dialog type";
        return this.selectedOption.title || this.selectedOption.text;
      },
    },
    methods: {
      handelSelectOption(option, index) {
        this.selectedOption = option;
        this.htmlContent = `<h2 @Click="handelClose">${this.selectedOptionTitle}</h2>`;
      },
      handelClose() {
        this.dialog = false;
      },
      handelSave() {
        this.dialog = false;
      },
    },
  };
</script>

<style lang="scss">
  .dialog-modal {}
  .v-list-item {
    min-height: 34px !important;
  }
</style>