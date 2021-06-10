import React from 'react'
import './App.css';
import Calendar from './Components/Calendar'
import Weather from './Components/Weather'

function App() {
  return (
    <div className="App">
      <Weather></Weather>
      <Calendar></Calendar>
    </div>
  );
}

export default App;
