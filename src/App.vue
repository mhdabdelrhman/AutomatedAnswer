<template>
  <v-app>
    <Conversation/>
  </v-app>
</template>

<script>
  import Conversation from './components/automated/Conversation'
  export default {
    name: 'App',
    components: {
      Conversation
    }
  }
</script>
