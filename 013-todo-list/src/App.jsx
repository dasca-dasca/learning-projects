import "./styles.css"
import { createContext, useEffect, useReducer, useState } from "react"
import { NewTodoForm } from "./NewTodoForm"
import { TodoList } from "./TodoList"
import { FilterForm } from "./FilterForm"

const ACTIONS = {
  CREATE_TODO: "CREATE_TODO",
  TOGGLE_TODO: "TOGGLE_TODO",
  DELETE_TODO: "DELETE_TODO",
  UPDATE_TODO: "UPDATE_TODO",
}

export const TodosContext = createContext()

function reducer(todos, { type, payload }) {
  switch (type) {
    case ACTIONS.CREATE_TODO:
      return [
        ...todos,
        {
          name: payload.name,
          id: crypto.randomUUID(),
          completed: false,
        },
      ]

    case ACTIONS.TOGGLE_TODO:
      return todos.map((todo) => {
        if (todo.id === payload.id) {
          return { ...todo, completed: payload.completed }
        }
        return todo
      })

    case ACTIONS.DELETE_TODO:
      return todos.filter((todo) => todo.id !== payload.id)

    case ACTIONS.UPDATE_TODO:
      return todos.map((todo) => {
        if (todo.id === payload.id) {
          return { ...todo, name: payload.name }
        }
        return todo
      })
  }
}

const localTodos = JSON.parse(localStorage.getItem("TODOS"))

export default function App() {
  const [todos, dispatch] = useReducer(reducer, localTodos, () => {
    if (localTodos === null) {
      return []
    }
    return localTodos
  })

  const [filterTodo, setFilterTodo] = useState("")
  const [hideCompleted, setHideCompleted] = useState(false)

  const filteredTodos = todos.filter((todo) => {
    if (hideCompleted && todo.completed) {
      return false
    }
    return todo.name.includes(filterTodo)
  })

  function addTodo(name) {
    dispatch({
      type: ACTIONS.CREATE_TODO,
      payload: { name },
    })
  }

  function toggleTodo(todoId, completed) {
    dispatch({ type: ACTIONS.TOGGLE_TODO, payload: { id: todoId, completed } })
  }

  function deleteTodo(todoId) {
    dispatch({ type: ACTIONS.DELETE_TODO, payload: { id: todoId } })
  }

  function updateTodo(todoId, name) {
    dispatch({ type: ACTIONS.UPDATE_TODO, payload: { name, id: todoId } })
  }

  useEffect(() => {
    localStorage.setItem("TODOS", JSON.stringify(todos))
  }, [todos])

  return (
    <TodosContext.Provider
      value={{
        todos,
        filteredTodos,
        addTodo,
        toggleTodo,
        deleteTodo,
        updateTodo,
      }}
    >
      <h1 className="title">Todos</h1>
      <div className="container">
        <FilterForm
          filterTodo={filterTodo}
          setFilterTodo={setFilterTodo}
          hideCompleted={hideCompleted}
          setHideCompleted={setHideCompleted}
        ></FilterForm>
        <TodoList></TodoList>
        <NewTodoForm></NewTodoForm>
      </div>
    </TodosContext.Provider>
  )
}
