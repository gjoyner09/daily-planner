import React from 'react'
import './App.css';
import Calendar from './Components/Calendar'
import Todo from './Components/To-Do'
import Weather from './Components/Weather'
import GranimComponent from './Components/GranimComponent'

function App() {
  return (
    <div className="App">
      {/* <GranimComponent></GranimComponent> */}
      <Weather></Weather>
      <Todo></Todo>
      <Calendar></Calendar>
    </div>
  );
}

export default App;
