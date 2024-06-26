import { useContext, useRef, useState } from "react"
import { TodosContext } from "./App"

export function TodoItem({ name, id, completed }) {
  const { toggleTodo, deleteTodo, updateTodo } = useContext(TodosContext)
  const [isEdited, setIsEdited] = useState(false)
  const updateRef = useRef()

  function handleSubmit(e) {
    e.preventDefault()
    updateTodo(id, updateRef.current.value)
    setIsEdited(false)
  }

  return (
    <li className="list-item">
      {isEdited ? (
        <>
          <form className="editing-form" onSubmit={handleSubmit}>
            <input
              autoFocus
              className="text-input list-item-input"
              type="text"
              ref={updateRef}
              defaultValue={name}
            />
            <button className="btn btn-save">
              <i class="fa-regular fa-floppy-disk"></i>
            </button>
          </form>
        </>
      ) : (
        <>
          <div>
            <input
              className="item-checkbox"
              id={id}
              type="checkbox"
              checked={completed}
              onChange={(e) => toggleTodo(id, e.target.checked)}
            />
            <label className="item-name" htmlFor={id}>
              {name}
            </label>
          </div>
          <div>
            <button className="btn btn-edit" onClick={() => setIsEdited(true)}>
              <i className="fa-solid fa-pen"></i>
            </button>
            <button className="btn btn-delete" onClick={() => deleteTodo(id)}>
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </>
      )}
    </li>
  )
}
