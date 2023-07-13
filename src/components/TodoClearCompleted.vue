<template>
  <button v-if="showClearCompletedButton" @click="clearCompleted">Clear Completed</button>
</template>
  
<script>
		import mitt from 'mitt';
    const emitter = mitt();
  export default {
    name: 'TodoClearCompleted',
    props: {
      showClearCompletedButton: {
        type: Boolean,
        required: true,
      }
    },
    methods: {
      clearCompleted() {
        emitter.emit('clearCompletedTodos')
      }
    }
  }
  </script>
  