import React, { useState } from 'react'

const Todo = () => {
    const initialEvents = localStorage.getItem('todo')
    const [todo, setTodo] = useState(initialEvents ? JSON.parse(initialEvents) : [])
    const [newItem, setNewItem] = useState('')
    
    const handleChange = (event) => {
        setNewItem(event.target.value)
    }
    
    const handleSubmit = (event) => {
        event.preventDefault()
        const newTodo = [
            ...todo,
            newItem
        ]
        localStorage.setItem('todo', JSON.stringify(newTodo))
        setTodo(newTodo)
        setNewItem('')
    }
    
    const strikethrough = ( index) => {
        console.log(index)
        const item = document.getElementById(`item${index}`)
        item.classList.toggle('strikethrough')
    }
    
    const deleteItem = (index) => {
        const newTodo = todo.filter((item, origIndex) => origIndex !== index)
        localStorage.setItem('todo', JSON.stringify(newTodo))
        setTodo(newTodo)
    }
    
    return (
        <>
            <h1>To Do List</h1>
            <ul>
                {todo.length > 0 && todo.map((item, index) => {
                    return (
                        <div key={index} >
                            <li id={`item${index}`}>{item}</li>
                            <button onClick={() => strikethrough(index)}>Completed</button>
                            <button onClick={() => deleteItem(index)}>Delete</button>
                        </div>
                    )
                })}
            </ul>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newitem">Add list item:</label>
                <input type="text" id="newitem" name="newitem" onChange={handleChange}/>
                <input type="submit" />
            </form>
        </>
    )
}

export default Todo