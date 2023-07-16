import axios from 'axios'

export const getAllTodos = async () => {
    const res = await axios.get('http://travellisttest/api/todos');
    if(res.status === 200){
        return res.data;
    } 
    throw(new Error(`get all todo fail with status code ${res.status}`)); 
} 