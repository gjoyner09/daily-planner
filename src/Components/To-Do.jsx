import React, { useState } from 'react'
import styled from 'styled-components'

const ToDoSpan = styled.span`
margin-top: 2rem;
width: 35%;
`

const ToDoHeader = styled.h3`
width: 100%;
height: 30px;
margin-bottom: 0.5rem;
`

const ToDoList = styled.div`
width: 100%;
margin-bottom: 1rem;
`

const ToDoItem = styled.div`
width: 100%;
display: flex;
justify-content: space-between;
background-color: rgba(255, 255, 255, 0.5);
`

const ToDoInterior = styled.span`
padding-right: 1rem;
padding-left: 1rem;
`

const Form = styled.form`
float: left;
padding-left: 1rem;
padding-right: 1rem;
`

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
            {text: newItem, completed: false}
        ]
        localStorage.setItem('todo', JSON.stringify(newTodo))
        setTodo(newTodo)
        setNewItem('')
    }
    
    const strikethrough = (index) => {
        let newArray = [...todo]
        newArray[index].completed = !newArray[index].completed
        localStorage.setItem('todo', JSON.stringify(newArray))
        setTodo(newArray)
    }
    
    const deleteItem = (index) => {
        const newTodo = todo.filter((item, origIndex) => origIndex !== index)
        localStorage.setItem('todo', JSON.stringify(newTodo))
        setTodo(newTodo)
    }
    
    return (
        <ToDoSpan>
            <ToDoHeader>To Do List</ToDoHeader>
            <ToDoList>
                {todo.length > 0 && todo.map((item, index) => {
                    return (
                        <ToDoItem key={item.text} >
                            <ToDoInterior id={item.text} className={item.completed && 'strikethrough'}> - {item.text}</ToDoInterior>
                            <ToDoInterior>
                                <button onClick={() => strikethrough(index)}>Completed</button>
                                <button onClick={() => deleteItem(index)}>Delete</button>
                            </ToDoInterior>
                        </ToDoItem>
                    )
                })}
            </ToDoList>
            <Form onSubmit={handleSubmit}>
                <label htmlFor="newitem">Add list item: </label>
                <input type="text" id="newitem" name="newitem" value={newItem} onChange={handleChange}/>
                <input type="submit" />
            </Form>
        </ToDoSpan>
    )
}

export default Todo