<template>
  <div id="app" class="container">
    <img alt="Vue logo" src="./assets/logo.png" class="logo">
    <TodoList/>
    <!-- <Testy/>  -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>
 
<script>
//import HelloWorld from './components/HelloWorld.vue'
import TodoList from './components/TodoList.vue'
// import Testy from './components/Testy.vue'
export default {
  name: 'App',
  components: {
    //HelloWorld,
    TodoList,
    //Testy
  }
}
</script>

<style>

* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 24px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

.logo{
  display: block;
  margin: 20px auto;
  height: 75px;
}
</style>
