<template>
  <div id="app">
    <Conversation/>
  </div>
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
