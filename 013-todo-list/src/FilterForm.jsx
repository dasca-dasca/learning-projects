export function FilterForm({
  filterTodo,
  setFilterTodo,
  hideCompleted,
  setHideCompleted,
}) {
  return (
    <form className="filter-form">
      <div>
        <label className="action-label" htmlFor="">Search</label>
        <input
          className="text-input"
          type="text"
          value={filterTodo}
          onChange={(e) => setFilterTodo(e.target.value)}
        />
      </div>
      <div>
        <label className="action-label">Hide Completed</label>
        <input
          className="checkbox-input"
          type="checkbox"
          value={hideCompleted}
          onChange={(e) => setHideCompleted(e.target.checked)}
        />
      </div>
    </form>
  )
}
