import React, { useState, useEffect } from 'react';
import Forecast from './Forecast'

let styles = {
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
}

function Weather() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [position, setPosition] = useState(null)
    const [location, setLocation] = useState(null)
    const [searchText, setSearchText] = useState('')
    const [searchLocation, setSearchLocation] = useState('')
    const [celcius, setCelcius] = useState(true)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((data) => {
            setPosition({latitude: data.coords.latitude, longitude: data.coords.longitude})
        })
    }, [])

    
    useEffect(() => {
        position && fetch("http://www.7timer.info/bin/api.pl?lon=" + position.longitude + "&lat=" + position.latitude + "&product=civillight&output=json")
        .then(res => res.json())
        .then(

            (result) => {
                setIsLoaded(true);
                setItems(result.dataseries);
            }
        )
        .catch((error) => console.log(error))

        
        position && fetch(`https://geocode.xyz/${position.latitude},${position.longitude}?geoit=json`)
        .then(res => res.json())
        .then(data => {
            let city = data.city
            city = city[0] + city.substring(1).toLowerCase()
            city = city.split('').map((letter, index) => city[index - 1] === " " ? letter.toUpperCase() : letter).join('')
            setLocation({city: city, country: data.country})
        })
        .catch((error) => console.log(error))
    }, [position])
    
    const handleChange = (event) => {
        setSearchText(event.target.value)
    }
    
    const handleSubmit = (event) => {
        event.preventDefault()
        setIsLoaded(false)
        fetch(`https://geocode.xyz/${searchText.replaceAll(' ', '%20')}?json=1`)
        .then(res => res.json())
        .then(data => {
            setPosition({latitude: Number(data.latt), longitude: Number(data.longt)})
        })
    }
    
    const toggleCandF = () => {
        const tempButton = document.getElementById("cToF")
        tempButton.innerHTML = celcius ? "Switch to Celcius" : "Swtich to Fahrenheit"
        setCelcius(!celcius)
    }
    
    const setTemp = (temp) => {
        if (celcius) {
            return temp
        } else {
            return temp * 9/5 + 32
        }
    }
    
    return (
      <div className="Weather" style={styles}>
          <form onSubmit={handleSubmit}>
                <label htmlFor="weatherLocation">Search city:</label>
                <input type="text" id="weatherLocation" name="weatherLocation" onChange={handleChange}/>
                <input type="submit" />
            </form>
            <button id="cToF" onClick={toggleCandF}>Switch to Fahrenheit</button>
          {!isLoaded &&
            <>
             <div className="loader"></div>
             <p>Loading weather</p>
            </>
          }
          {isLoaded && 
                <>
                    {location && location.city && <h1>Weather for {location.city}, {location.country}</h1>}    
                    {items.map(function(item, index){
                        return (
                            <Forecast key={index} index={index} cloudcover={item.weather} temperatureMax={Math.round(setTemp(item.temp2m.max))} temperatureMin={Math.round(setTemp(item.temp2m.min))} />
                        )
                        })
                    }
                </>
            }
      </div>
    );
}
  


export default Weather;