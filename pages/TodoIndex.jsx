const { useState, useEffect } = React
const { Link } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

import { TodoList } from '../cmps/TodoList.jsx'
import { TodoFilter } from '../cmps/TodoFilter.jsx'
import { TodoSort } from '../cmps/TodoSort.jsx'
import { TodoAdd } from '../cmps/TodoAdd.jsx'
import { loadTodos, removeTodo, saveTodo, updateTodo } from '../store/actions/todo.actions.js'
import { SET_FILTER_BY } from '../store/reducers/todo.reducer.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
// import { loadTodos, removeTodo, saveTodo, toggleTodoStatus } from '../store/actions/todo.actions.js'

export function TodoApp() {
    const todos = useSelector(storeState => storeState.todoModule.todos)
    const filterBy = useSelector((storeState) => storeState.todoModule.filterBy)
    const [sortBy, setSort] = useState('time')
    const dispatch = useDispatch()

    useEffect(() => {
        // loadTodos()
        loadTodos(filterBy)
            .catch(() => {
                showErrorMsg('Cannot load todos!')
            })
    }, [filterBy])

    
    function onRemoveTodo(todoId) {
        removeTodo(todoId)
        .then(() => {
            console.log('removed todo ' + todoId)
            showSuccessMsg('Todo removed')
        })
        .catch(() => {
            showErrorMsg('Cannot remove todo')
        })
    }
    
    function onAddTodo(todoToAdd) {
        saveTodo(todoToAdd)
            .then((savedTodo) => {
                showSuccessMsg(`Todo added (id: ${savedTodo._id})`)
                console.log('add todo:', savedTodo)
            })
            .catch(() => {
                showErrorMsg('Cannot add todo')
            })
    }

    // function onEditTodo(todo) {
    //     const txt = prompt('What do you want to do?')
    //     const todoToSave = { ...todo, txt }
        
    //     saveTodo(todoToSave)
    //     .then((savedTodo) => {
    //         showSuccessMsg(`Todo updated`)
    //         console.log('edit todo:', savedTodo)
    //     })
    //     .catch(err => {
    //         showErrorMsg('Cannot update todo')
    //     })
    // }
    function onUpdateTodo(todo) {
        updateTodo(todo)
            .then(() => {
                showSuccessMsg(`Todo updated`)
            })
            .catch(() => showErrorMsg('Cannot update todo'))
    }
    
    function setFilter(filter) {
        const action = {type: SET_FILTER_BY, val: filter}
        dispatch(action)
    }
    // function onSetFilter(filterBy) {
    //     setFilterBy(filterBy)
    // }

    function onSetSort(sort) {
        setSort(sort)
    }
    
    function todosForDisplay() {
        let sortedTodos = [...todos]
        if (sortBy === 'txt') {
            sortedTodos = sortedTodos.sort((a, b) => a.txt.localeCompare(b.txt));
        } else {
            sortedTodos = sortedTodos.sort((a, b) => a.createdAt - b.createdAt);
        }
        return sortedTodos
    }

    // function onToggleTodo(todo) {
    //     toggleTodoStatus(todo)
    //         .then(() => {
    //             showSuccessMsg('Todo status updated')
    //         })
    //         .catch(err => {
    //             showErrorMsg('Cannot update todo status')
    //         })
    // }

    
    if (!todos) return <div>Loading..</div>
    return (
        <section>
                {/* <TodoAdd onAddTodo={onAddTodo} /> */}
                <TodoFilter onSetFilter={setFilter} />
                {/* <TodoFilter filterBy={filterBy} onSetFilter={onSetFilter} /> */}
                <TodoSort onSetSort={onSetSort} />
                <button><Link to="/todo/edit">Add Todo</Link></button>
                <TodoList todos={todosForDisplay()} onUpdateTodo={onUpdateTodo} onRemoveTodo={onRemoveTodo} />
                {(!todos.length) && <div>No todos to show...</div>}
        </section>
    )

}