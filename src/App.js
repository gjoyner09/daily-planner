import React from 'react'
import './App.css';
import Calendar from './Components/Calendar'
import Todo from './Components/To-Do'
import Weather from './Components/Weather'
import Granim from './Components/GranimComponent'

const App = () => {
  return (
    <div className="App">
      <Granim></Granim>
      <Weather></Weather>
      <Todo></Todo>
      <Calendar></Calendar>
    </div>
  );
}

export default App;
