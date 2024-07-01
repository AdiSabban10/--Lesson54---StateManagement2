import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'todoDB'
const PAGE_SIZE = 8

export const todoService = {
    query,
    getById,
    save,
    remove,
    
}

function query(filterBy = { txt: '', isDone: 'all', pageIdx: 0 }) {
    return storageService.query(STORAGE_KEY)
        .then(todos => {
            if (filterBy.txt) {
                const regex = new RegExp(filterBy.txt, 'i')
                todos = todos.filter(todo => regex.test(todo.txt))
            }
            if (filterBy.isDone !== 'all') {
                todos = todos.filter((todo) => (filterBy.isDone === 'done' ? todo.isDone : !todo.isDone))
            }
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                todos = todos.slice(startIdx, PAGE_SIZE + startIdx)
            }
            return todos
        })
}

function getById(todoId) {
    return storageService.get(STORAGE_KEY, todoId)
}

function remove(todoId) {
    return storageService.remove(STORAGE_KEY, todoId)
        .then(() => {
            userService.addActivity('Removed', todoId)
        })
}


function save(todo) {
    if (todo._id) {
        return storageService.put(STORAGE_KEY, todo)
            .then((savedTodo) => {
                userService.addActivity('Updated', savedTodo._id)
                return savedTodo
            })
    } else {
        todo.isDone = false
        todo.createdAt = Date.now()
        todo.creator = userService.getLoggedInUser()
        return storageService.post(STORAGE_KEY, todo)
            .then((savedTodo) => {
                userService.addActivity('Added', savedTodo._id)
                return savedTodo
            })
    }
}

