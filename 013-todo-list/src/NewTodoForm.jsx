import { useContext, useRef } from "react"
import { TodosContext } from "./App"

export function NewTodoForm() {
  const nameRef = useRef()
  const { addTodo } = useContext(TodosContext)

  function handleSubmit(e) {
    e.preventDefault()
    if (nameRef.current.value === "") return
    addTodo(nameRef.current.value)
    nameRef.current.value = ""
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="adding-todo">
      <div className="adding-todo-left">
        <label className="action-label" htmlFor="">New Todo</label>
        <input className='text-input' autoFocus type="text" ref={nameRef} />
      </div>
      <div className="adding-todo-right">
        <button className="btn btn-add">Add Todo</button>
      </div>
    </form>
  )
}
