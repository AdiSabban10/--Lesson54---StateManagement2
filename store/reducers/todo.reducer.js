export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    // todos: null,
    todos: [],
    filterBy: { txt: '', isDone: 'all', pageIdx: 0 },
    isLoading: false,
}

export function todoReducer(state = initialState, action = {}) { // {type,  payload}

    switch (action.type) {
        case SET_TODOS:
            return { ...state, todos: action.todos }
        case REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo._id !== action.todoId)
            }
        case ADD_TODO:
            return {
                ...state,
                todos: [action.todo, ...state.todos]
            }
        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo => todo._id === action.todo._id ? action.todo : todo)
            }
        case SET_FILTER_BY:
            return { ...state, filterBy: action.val }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        default:
            return state
    }
}
