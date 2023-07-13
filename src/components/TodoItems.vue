<template>
  <div class="todo-item">
      <div class="todo-item-left">
        <input type="checkbox" v-model="completed" @change="doneEdit">
        
        <div v-if="!editing" @dblclick="editTodo(todo)" class="todo-item-label" :class="{ completed : completed }"> 
          {{ title }}
        </div>

        <input v-else class="todo-item-edit" type="text" 
        v-model="title" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)"	@keyup.esc="cancelEdit(todo)" 
        v-focus>
      </div>

     <div>
      <button @click="pluralize">Plural</button>
      <span class="remove-item" @click="removeTodo(index)">
        &times;
      </span>
     </div>
  </div>
</template>

<script >
import {emitter} from '../utils/eventEmitter.js'
export default {
    name: 'TodoItems',
    props: {
      todo: {
        type: Object,
        required: true,
      },
      checkAll: {
        type: Boolean,
        required: true,
      }
    },
    data() {
      return {
      'id': this.todo.id,
      'title': this.todo.title,
      'completed': this.todo.completed,
      'editing': this.todo.editing,
      'beforeEditCache': '',
      }
    },
    created() {
      emitter.on('pluralize', this.handlePluralize)
    },
    beforeUnmount() {
      emitter.off('pluralize', this.handlePluralize)
    },
    watch: {
      checkAll() {
        // if (this.checkAll) {
        //   this.completed = true
        // } else {
        //   this.completed = this.todo.completed
        // }
        this.completed = this.checkAll ? true : this.todo.completed
      }
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus()
        }
      }
    },
    methods: {
      removeTodo(id) {
        this.$store.dispatch('deleteTodo', id)
      },

      editTodo() {
        this.beforeEditCache = this.title
        this.editing = true
      },

      doneEdit() {
        if (this.title.trim() == '') {
          this.title = this.beforeEditCache
        }
        this.editing = false
        this.$store.dispatch('updateTodo', {
          'id': this.id,
          'title': this.title,
          'completed': this.completed,
          'editing': this.editing,
        })
      },

      cancelEdit() {
        this.title = this.beforeEditCache
        this.editing = false
      },

      pluralize() {
        emitter.emit('pluralize')
      },

      handlePluralize() {
        let data = {
          'id': this.id,
          'title': this.title,
          'completed': this.completed,
          'editing': this.editing,
        }
        this.title = this.title + 's'
        const index = this.$store.state.todos.findIndex((item) => item.id == data.id);
				this.$store.state.todos.splice(index, 1, data)
      }

    }
}
</script>

<style >
.todo-item{
			margin-bottom: 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;
    }
</style>