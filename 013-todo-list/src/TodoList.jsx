import { useContext } from "react"
import { TodosContext } from "./App"
import { TodoItem } from "./TodoItem"

export function TodoList() {
  const { filteredTodos } = useContext(TodosContext)
  
  return (
    <ul className="list">
      {filteredTodos.map((todo) => {
        return <TodoItem key={todo.id} {...todo}></TodoItem>
      })}
    </ul>
  )
}
