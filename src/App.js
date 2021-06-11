import React from 'react'
import './App.css';
import Calendar from './Components/Calendar'
import Todo from './Components/To-Do'
import Weather from './Components/Weather'

function App() {
  return (
    <div className="App">

      <Weather></Weather>
      <Todo></Todo>
      <Calendar></Calendar>
    </div>
  );
}

export default App;
