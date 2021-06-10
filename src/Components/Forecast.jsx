import React from 'react';


let styles = {

}

let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let date = new Date()
let day = date.getDay()

function Forecast(props) {



    return (
        <div style={styles} className='DayForecast'>

            <h3>{days[(props.index + day)%7]}</h3>

            <p>{props.cloudcover}</p>

            <h5>Max Temperature</h5>
            <p>{props.temperatureMax}</p>

            <h5>Min Temperature</h5>
            <p>{props.temperatureMin}</p>
        </div>
    )
}


export default Forecast;