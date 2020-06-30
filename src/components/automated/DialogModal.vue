<template>
  <div>
    <v-dialog v-model="dialog" persistent scrollable max-width="500px">
      <v-card class="pa-4">
        <v-menu>
          <template v-slot:activator="{ on }">
            <v-btn :disabled="processing" color="primary" v-on="on" class="mt-2">{{title}}</v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(option,index) in options"
              :key="index"
              @click="handelSelectOption(option,index)"
              dense
            >{{option.text}}</v-list-item>
          </v-list>
        </v-menu>
        <v-card-actions v-if="errorMessage">
          <v-alert width="100%" type="error">{{errorMessage}}</v-alert>
        </v-card-actions>
        <v-card-actions v-if="isIncludeMessage">
          <v-text-field
            :disabled="processing"
            v-model="inputs.message"
            prepend-icon="mdi-android-messages"
            label="Message"
          ></v-text-field>
        </v-card-actions>
        <v-card-actions v-if="inputMessage">
          <span>{{inputMessage}}</span>
        </v-card-actions>
        <v-card-actions v-if="fileInput">
          <v-file-input
            :disabled="processing"
            v-model="inputs.file"
            :rules="rules"
            :accept="fileInput.accept"
            :placeholder="fileInput.placeholder"
            :prepend-icon="fileInput.icon"
            :label="selectedOption.text"
          ></v-file-input>
        </v-card-actions>
        <v-card-actions v-if="textInput">
          <v-text-field
            :disabled="processing"
            v-model="inputs.url"
            :placeholder="textInput.placeholder"
            :prepend-icon="textInput.icon"
            :label="selectedOption.text"
          ></v-text-field>
        </v-card-actions>
        <v-card-actions class="mt-3 flex-row-reverse">
          <v-btn
            v-if="isOptionSelected"
            :disabled="processing"
            class="ml-3"
            rounded
            :color="`success`"
            @click="handelSave"
          >Save</v-btn>
          <v-btn rounded :disabled="processing" @click="handelClose">Cancel</v-btn>
          <v-progress-circular
            v-if="processing"
            class="mr-3"
            indeterminate
            rotate="0"
            size="32"
            width="4"
            color="light-blue"
          ></v-progress-circular>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import options from "./config";
import { postDataToServer } from "./utils";
export default {
  props: {
    dialogId: {
      type: String,
      default: null
    },
    option: {
      type: Object,
      default: null
    },
    values: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialog: true,
      options: options,
      selectedOption: this.option,
      rules: [
        value =>
          !value ||
          value.size < 2000000 ||
          "file size should be less than 2 MB!"
      ],
      inputs: {
        message: this.values && this.values.message,
        file: null,
        url: this.values && this.values.url
      },
      errorMessage: null,
      processing: false
    };
  },
  computed: {
    isIncludeMessage() {
      if (this.isOptionSelected) {
        if (this.selectedOption.message == undefined) return true;
        return this.selectedOption.message;
      }
      return false;
    },
    isOptionSelected() {
      return this.selectedOption != null;
    },
    title() {
      if (!this.isOptionSelected) return "Select dialog type";
      return this.selectedOption.title || this.selectedOption.text;
    },
    fileInput() {
      if (this.isOptionSelected && this.selectedOption.inputs) {
        for (var i = 0; i < this.selectedOption.inputs.length; i++)
          if (this.selectedOption.inputs[i].input_type == "file")
            return this.selectedOption.inputs[i];
      }
      return null;
    },
    textInput() {
      if (this.isOptionSelected && this.selectedOption.inputs) {
        for (var i = 0; i < this.selectedOption.inputs.length; i++)
          if (this.selectedOption.inputs[i].input_type == "text")
            return this.selectedOption.inputs[i];
      }
      return null;
    },
    inputMessage() {
      if (this.fileInput && this.textInput)
        return "Please pick a file or set the url";
      if (this.fileInput) return "Please pick a file";
      if (this.textInput) return "Please set the url";
      return null;
    }
  },
  methods: {
    handelSelectOption(option, index) {
      this.errorMessage = null;
      this.inputs.message = this.inputs.file = this.inputs.url = null;
      this.selectedOption = option;
    },
    handelClose() {
      this.dialog = false;
      this.$emit("hide");
    },
    handelSave() {
      this.errorMessage = null;
      this.processing = true;
      if (this.isValidLocaly()) {
        this.checkInServer(data => {
          this.processing = false;
          if (data.success) {
            this.dialog = false;
            if (data.url) this.inputs.url = data.url;
            this.$emit("save", {
              option: this.selectedOption,
              values: { message: this.inputs.message, url: this.inputs.url }
            });
          } else {
            if (data.error) this.errorMessage = data.error;
            else this.errorMessage = "Error! please check input data.";
          }
        });
      } else {
        this.processing = false;
      }
    },
    isValidLocaly() {
      if (
        !this.fileInput &&
        !this.textInput &&
        (!this.inputs.message || this.inputs.message === "")
      ) {
        this.errorMessage = "Error! please enter valid message.";
        return false;
      }

      if (
        this.fileInput &&
        this.textInput &&
        ((this.inputs.file && this.inputs.url && this.inputs.url.length > 0) ||
          (!this.inputs.file && (!this.inputs.url || this.inputs.url === "")))
      ) {
        this.errorMessage = "Error! please fill one input (file or URL).";
        return false;
      }

      if (this.fileInput && !this.textInput && !this.inputs.file) {
        this.errorMessage = "Error! please pick a fill.";
        return false;
      }

      if (
        !this.fileInput &&
        this.textInput &&
        (!this.inputs.url || this.inputs.url === "")
      ) {
        this.errorMessage = "Error! please set the URL.";
        return false;
      }

      return true;
    },
    checkInServer(callback) {
      postDataToServer({
        dialogId: this.dialogId,
        option: this.selectedOption,
        inputs: this.inputs
      }).then(serverData => {
        callback(serverData);
      });
    }
  }
};
</script>

<style lang="scss">
.v-list-item {
  min-height: 34px !important;
}
</style>