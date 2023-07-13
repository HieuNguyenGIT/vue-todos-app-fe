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
				<!-- <div class="todo-item-left">
					<input type="checkbox" v-model="todo.completed">
					
					<div v-if="!todo.editing" @dblclick="editTodo(todo)" class="todo-item-label" :class="{ completed : todo.completed }"> 
						{{ todo.title }}
					</div>

					<input v-else class="todo-item-edit" type="text" 
					v-model="todo.title" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)"	@keyup.esc="cancelEdit(todo)" 
					v-focus>
				</div>

				<div class="remove-item" @click="removeTodo(index)">
					&times;
				</div> -->
		</transition-group>
			<div class="extra-container">
				<TodoCheckAll :anyRemaining="anyRemaining"/>
				<TodoItemsRemaining :remaining="remaining"/>
				<!-- <div>
					<label>
						<input type="checkbox" :checked="!anyRemaining" @change="checkAllTodos"> 
							Check All
						</label>
				</div>
				<div>{{ remaining }} items left</div> -->
			</div>

			<div class="extra-container">
				<TodoFiltered/>
				<!-- <div>
					<button :class="{ active: filter == 'all' }" @click="filter = 'all'">All</button>
						<button :class="{ active: filter == 'active' }" @click="filter = 'active'">Active</button>
					<button :class="{ active: filter == 'completed' }" @click="filter = 'completed'">Completed</button>
				</div> -->

				<div>
					<transition name="fade">
						<TodoClearCompleted :showClearCompletedButton="showClearCompletedButton"/>
						<!-- <button v-if="showClearCompletedButton" @click="clearCompleted">
							Clear Completed
						</button> -->
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
</script>
<script>
	//import TodoItems from '../components/TodoItems.vue'
	import {emitter} from '../utils/eventEmitter.js'
	import Testy from '../components/Testy.vue'
	export default {
	name: "TodoList",
	component: {
		//TodoItems,
		Testy
	},
	data() {
			return {
					newTodo: "",
					idForTodo: 3,
					beforeEditCache: "st is wrong this this anti empty string method",
					filter: "all",
					todos: [
							{
									"id": 1,
									"title": "Learn vue with the flame of ambition",
									"completed": false,
									"editing": false,
							},
							{
									"id": 2,
									"title": "put those foolish ambition to rest",
									"completed": false,
									"editing": false,
							}
					]
			};
	},
	created() {
		emitter.on('removedTodo', (id) => this.removeTodo(id))
		emitter.on('finishedEdit', (data) => this.finishedEdit(data))
		emitter.on('checkAllChanged', (checked) => this.checkAllTodos(checked))
		emitter.on('filterChanged', (filter) => this.filter = filter)
		emitter.on('clearCompletedTodos', () => this.clearCompleted())
},
	beforeUnmount() {
		emitter.off('removedTodo')
		emitter.off('finishedEdit')
		emitter.off('checkAllChanged')
		emitter.off('filterChanged')
		emitter.off('clearCompletedTodos')
	},
	computed: {
			// used for composing new data from other data
			// shouldn not mutate data
			// should not accept parameter
			// always return st
			remaining() {
					return this.todos.filter(todo => !todo.completed).length;
			},
			anyRemaining() {
					return this.remaining != 0;
			},
			todosFiltered() {
					if (this.filter == "all") {
						return this.todos;
					}
					else if (this.filter == "active") {
						return this.todos.filter(todo => !todo.completed);
					}
					else if (this.filter == "completed") {
						return this.todos.filter(todo => todo.completed);
					}
					return this.todos;
			},
			showClearCompletedButton() {
					return this.todos.filter(todo => todo.completed).length > 0;
			}
	},
	methods: {
			addTodo() {
					if (this.newTodo.trim() == 0) {
							return;
					}
					this.todos.push({
							id: this.idForTodo,
							title: this.newTodo,
							completed: false,
					});
					this.newTodo = "";
					this.idForTodo++;
			},
			removeTodo(id) {
				const index = this.todos.findIndex((item) => item.id == id)
				this.todos.splice(index, 1);
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
			checkAllTodos(checked) {
				console.log('cheking')
				this.todos.forEach((todo) => todo.completed = checked);
			},
			// clearCompleted() {
			// 	this.todos = this.todos.filter(todo => !todo.completed);
			// },
			finishedEdit(data) {
				const index = this.todos.findIndex((item) => item.id == data.id);
				this.todos.splice(index, 1, data)
			}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
