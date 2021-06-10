import React, { useState, useEffect } from 'react';
import Forecast from './Forecast'

let city, country

let styles = {
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
}

function Weather() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [lat, setLat] = useState(null)
    const [long, setLong] = useState(null)

    let locationPromise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition(position.coords)
            resolve()
        })
    })
    
    const setPosition = async (data) => {
        await setLat(data.latitude)
        await setLong(data.longitude)
    }
    
    const setLocation = (data) => {
        city = data.city.toLowerCase()
        city = city[0].toUpperCase() + city.substring(1)
        country = data.country
    }
    
  
    useEffect(() => {
        if(true) {
            locationPromise
            .then(() => fetch("http://www.7timer.info/bin/api.pl?lon=" + long + "&lat=" + lat + "&product=civillight&output=json"))
            .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true);
                setItems(result.dataseries);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
            )
            .then(() => console.log("then: " + lat))
            .then(() => console.log("then: " + long))
            // .then(() => fetch(`https://geocode.xyz/${lat},${long}?geoit=json`))
            // .then(res => res.json())
            // .then(data => setLocation(data))
        }
    }, [])
    
    return (
      <div className="Weather" style={styles}>
          {!isLoaded &&
            <>
             <div class="loader"></div>
             <p>Loading weather</p>
            </>
          }
          {isLoaded && 
                <>
                    <h1>Weather for {city}, {country}</h1>
                    {lat && items.map(function(item, index){
                        return (
                            <Forecast key={index} index={index} cloudcover={item.weather} temperatureMax={item.temp2m.max} temperatureMin={item.temp2m.min} />
                        )
                        })
                    }
                </>
            }
      </div>
    );
}
  


export default Weather;