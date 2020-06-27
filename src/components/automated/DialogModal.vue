<template>
  <div>
    <v-dialog v-model="dialog" persistent scrollable max-width="500px">
      <v-card class="pa-4">
        <v-menu>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" v-on="on" class="mt-2">{{title}}</v-btn>
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
        <v-card-actions v-if="isOptionSelected">
          <v-text-field v-model="message" prepend-icon="mdi-android-messages" label="Message"></v-text-field>
        </v-card-actions>
        <v-card-actions v-if="inputMessage">
          <span>{{inputMessage}}</span>
        </v-card-actions>
        <v-card-actions v-if="fileInput">
          <v-file-input
            :rules="rules"
            :accept="fileInput.accept"
            :placeholder="fileInput.placeholder"
            :prepend-icon="fileInput.icon"
            :label="selectedOption.text"
          ></v-file-input>
        </v-card-actions>
        <v-card-actions v-if="textInput">
          <v-text-field
            :placeholder="textInput.placeholder"
            :prepend-icon="textInput.icon"
            :label="selectedOption.text"
          ></v-text-field>
        </v-card-actions>
        <v-card-actions class="mt-3 flex-row-reverse">
          <v-btn
            v-if="isOptionSelected"
            class="ml-3"
            :rounded="true"
            :color="`success`"
            @click="handelSave"
          >Save</v-btn>
          <v-btn :rounded="true" @click="handelClose">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import options from "./config";
export default {
  props: {
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
      options: options,
      selectedOption: this.option,
      message: "",
      dialog: true,
      rules: [
        value =>
          !value ||
          value.size < 2000000 ||
          "file size should be less than 2 MB!"
      ]
    };
  },
  computed: {
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
      this.selectedOption = option;
    },
    handelClose() {
      this.dialog = false;
      this.$emit("hide");
    },
    handelSave() {
      if (this.isValidLocaly()) {
        this.postToServer(data => {
          if (data.success) {
            this.dialog = false;
            this.$emit("save", {
              option: this.selectedOption,
              values: { message: this.message }
            });
          } else {
            this.showServerErrorMessage(data.error);
          }
        });
      }
    },
    isValidLocaly() {
      return true;
    },
    postToServer(callback) {
      // post here to server
      callback({ success: true, error: "" });
    }
  }
};
</script>

<style lang="scss">
.v-list-item {
  min-height: 34px !important;
}
</style>