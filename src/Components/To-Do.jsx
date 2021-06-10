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
    
    return (
        <>
            <ul>
                {todo.length > 0 && todo.map((item, index) => {
                    return (
                        <div key={index} >
                            <li>{item}</li>
                            <TodoDelete todo={todo} setTodo={setTodo} index={index} />
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

const TodoDelete = ({todo, setTodo, index}) => {
    const handleClick = () => {
        const newTodo = todo.filter((item, origIndex) => origIndex !== index)
        localStorage.setItem('todo', JSON.stringify(newTodo))
        setTodo(newTodo)
    }
    return (
        <button onClick={handleClick}>Remove</button>
    )
}

export default Todo