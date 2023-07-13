<template>
	<div>
		<input 
			text="text" 
			class="todo-input" 
			placeholder="what needs to be done"
			v-model="newTodo"
			@keyup.enter="addTodo"
		> 

		<transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
			<TodoItems
				v-for="(todo,index) in todosFiltered" 
				:checkAll="!anyRemaining" 
				:key="todo.id" 
				:todo="todo" 
				:index="index"
				@removedTodo="removeTodo" 
				@finishedEdit="finishedEdit" 
			/>

		</transition-group>
			<div class="extra-container">
				<TodoCheckAll/>
				<TodoItemsRemaining/>
			</div>

			<div class="extra-container">
				<TodoFiltered/>

				<div>
					<transition name="fade">
						<TodoClearCompleted />
					</transition>
				</div>

			</div>
	</div>
</template>

<script setup>
import TodoItems from '../components/TodoItems.vue'
import TodoFiltered from '../components/TodoFiltered.vue'
import TodoItemsRemaining from '../components/TodoItemsRemaining.vue'
import TodoCheckAll from '../components/TodoCheckAll.vue'
import TodoClearCompleted from '../components/TodoClearCompleted.vue'
//import {emitter} from '../utils/eventEmitter.js';

</script>

<script>

	export default {
	name: "TodoList",
	data() {
			return {
					newTodo: "",
					idForTodo: 3,
					beforeEditCache: "st is wrong this anti empty string method",	
			};
	},
// 	created() {
// 		emitter.on('removedTodo', (id) => this.removeTodo(id))
// 		emitter.on('finishedEdit', (data) => this.finishedEdit(data))
// 		emitter.on('checkAllChanged', (checked) => this.checkAllTodos(checked))
// 		emitter.on('filterChanged', (filter) => this.$store.state.filter = filter)
// 		emitter.on('clearCompletedTodos', () => this.clearCompleted())
// },
// 	beforeUnmount() {
// 		emitter.off('removedTodo')
// 		emitter.off('finishedEdit')
// 		emitter.off('checkAllChanged')
// 		emitter.off('filterChanged')
// 		emitter.off('clearCompletedTodos')
// 	},
	computed: {
			// used for composing new data from other data should not mutate data
			// should not accept parameter  and always return st
			anyRemaining() {
				return this.$store.getters.anyRemaining
			},
			todosFiltered() {
				return this.$store.getters.todosFiltered
			},
	},
	methods: {
			addTodo() {
					if (this.newTodo.trim() == 0) {
							return;
					}
					this.$store.dispatch('addTodo', {
						id: this.idForTodo,
						title: this.newTodo,
					})
					this.newTodo = "";
					this.idForTodo++;
			},
			editTodo(todo) {
				todo.beforeEditCache = this.title;
				todo.editing = true;
			},
			doneEdit(todo) {
				if (todo.title.trim() == "") {
						todo.title = this.beforeEditCache;
				}
				todo.editing = false;
			},
			cancelEdit(todo) {
				todo.title = this.beforeEditCache;
				todo.editing = false;
			},
			finishedEdit(data) {
				const index = this.$store.state.todos.findIndex((item) => item.id == data.id);
				this.$store.state.todos.splice(index, 1, data)
			}
	},
}
</script>

<style lang="scss">
	@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");
	
	.todo-input{
		widows: 100%;
		padding: 10px 18px;
		font-size: 18px;
		margin-bottom: 16px;

		&:focus{
			outline: 0;
		}
	}

	.todo-item{
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.remove-item{
		cursor: pointer;
		margin-left: 14px;
		&:hover{
			color: black;
		}
	}

	.todo-item-left {
		display: flex;
		align-items: center;
	}
	
	.todo-item-label {
		padding: 10px;
		border: 1px solid white;
		margin-left: 12px;
	}

	.todo-item-edit {
		font-size: 24px;
		color: #2c3e50;
		margin-left: 12px;
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc; //override defaults
		font-family: 'Avenir', Helvetica, Arial, sans-serif;

		&:focus {
			outline: none;
		}
	}
	.completed {
		text-decoration: line-through;
		color: grey;	
	}

	.extra-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 16px;
		border-top: 1px solid lightgrey;
		padding-top: 14px;
		margin-bottom: 14px;
	}

	button {
		font-size: 14px;
		background-color: white;
		appearance: none;

		&:hover {
			background: lightgreen;
		}

		&:focus {
			outline: none;
		}
	}

	.active {
		background: lightgreen;
	}

	// CSS Transitions
	.fade-enter-active, .fade-leave-active {
		transition: opacity .2s;
	}

	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
</style>
