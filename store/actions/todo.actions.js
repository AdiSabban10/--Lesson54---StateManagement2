import { todoService } from "../../services/todo.service.js"
import { ADD_TODO, REMOVE_TODO, SET_FILTER_BY, SET_IS_LOADING, SET_TODOS, UPDATE_TODO } from "../reducers/todo.reducer.js"
import { store } from "../store.js"

// export function loadTodos() {
export function loadTodos(filterBy) {
    // const filterBy = store.getState().todoModule.filterBy
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return todoService.query(filterBy)
        .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
            return todos
        })
        .catch(err => {
            console.log('todo action -> Cannot load todos', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}


export function removeTodo(todoId) {
    return todoService.getById(todoId)
        .then(todo => {
            if (!todo) throw new Error('Todo not found')
            return todoService.remove(todoId)
                .then(() => {
                    store.dispatch({ type: REMOVE_TODO, todoId })
                })
        })
        .catch(err => {
            console.log('todo action -> Cannot remove todo', err)
            throw err
        })
}

export function saveTodo(todo) {
    const type = todo._id ? UPDATE_TODO : ADD_TODO
    return todoService.save(todo)
        .then(savedTodo => {
            store.dispatch({ type, todo: savedTodo })
            return savedTodo
        })
        .catch(err => {
            console.log('todo action -> Cannot save todo', err)
            throw err
        })
}

export function updateTodo(todo) {
    return todoService.save(todo)
        .then((savedTodo) => {
            store.dispatch({type: UPDATE_TODO,todo: savedTodo})
        })
        .catch(err => {
            console.log('todo action -> Cannot updet todo', err)
            throw err
        })
}

// export function setFilterBy(filterBy) {
//     store.dispatch({ type: SET_FILTER_BY, filterBy })
// }



