<template>
    <div>
        <label>
            <input 
            type="checkbox" 
            :checked="!anyRemaining" 
            @change="allChecked"
            > Check All
        </label>
    </div>
  </template>
  
  <script>
  import {emitter} from '../utils/eventEmitter.js'
  export default {
    name: 'TodoCheckAll',
    props: {
      anyRemaining: {
        type: Boolean,
        required: true,
      }
    },
    methods: {
      allChecked(event) {
        
        emitter.emit('checkAllChanged',event.target.checked)
      }
    }
  }
  </script>
  