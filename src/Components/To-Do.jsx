import React, { useState } from 'react'
import styled from 'styled-components'
import Button from './Button'

const ToDoSpan = styled.span`
margin-top: 2rem;
width: 35%;
font-family: 'Manrope', sans-serif;
font-weight: bold;

@media only screen and (max-width: 700px) {
    width: 100%;
}
`

const ToDoWrapper = styled.div`
    width: 94%;
    height: 100%;
    margin-left: 3%;
    margin-right: 3%;
    padding-top: 0.1rem;
    background-color: rgb(255,255,255,0.7);
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
`

const ToDoText = styled.span`
padding-right: 1rem;
padding-left: 1rem;
text-align: left;
`

const Right = styled.span`
    align-content: right;
`

const ToDoButtons = styled.span`
padding-right: 0.5rem;
text-align: right;
@media only screen and (max-width: 700px) {
    width: 30%;

  }
  
  @media only screen and (max-width: 700px) {
    width: 40%;
  }
`

const Form = styled.form`
float: left;
padding-left: 1rem;
padding-right: 1rem;
`

const Input = styled.input`
margin: 0 0.3em 0.3em 0;

@media only screen and (max-width: 401px) {
    width: 40%;
  }
  
  @media only screen and (max-width: 350px) {
    width: 35%;
  }
  
  @media only screen and (max-width: 330px) {
    width: 30%;
  }
  
  @media only screen and (max-width: 300px) {
    width: 25%;
  }
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
            <ToDoWrapper>
                <ToDoHeader>To Do List</ToDoHeader>
                <ToDoList>
                    {todo.length > 0 && todo.map((item, index) => {
                        return (
                            <ToDoItem key={item.text} >
                                <ToDoText id={item.text} className={item.completed && 'strikethrough'}> - {item.text}</ToDoText>
                                <ToDoButtons>
                                    <Right><Button onClick={() => strikethrough(index)}>Completed</Button></Right>
                                    <Right><Button onClick={() => deleteItem(index)}>Delete</Button></Right>
                                </ToDoButtons>
                            </ToDoItem>
                        )
                    })}
                </ToDoList>
                <Form>
                    <label htmlFor="newitem">Add list item: </label>
                    <Input type="text" id="newitem" name="newitem" value={newItem} onChange={handleChange}/>
                    <Button onClick={handleSubmit}>Submit</Button>
                </Form>
            </ToDoWrapper>
        </ToDoSpan>
    )
}

export default Todo