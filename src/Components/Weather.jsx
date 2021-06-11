import React, { useState, useEffect } from 'react';
import Forecast from './Forecast'

let lat
let long

navigator.geolocation.getCurrentPosition((position) => {
lat = position.coords.latitude
long = position.coords.longitude}, () => {console.log('there is an error')}, {})






let styles = {
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
}

function Weather() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    
  
    useEffect(() => {
      fetch("http://www.7timer.info/bin/api.pl?lon=" + long + "&lat=" + lat + "&product=civillight&output=json")
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
  
          
        
    }, [])
  

 
  
    return (
      <div className="Weather" style={styles}>

          {items.map(function(item, index){
              return (
                  <Forecast key={index} index={index} cloudcover={item.weather} temperatureMax={item.temp2m.max} temperatureMin={item.temp2m.min}/>
              )
          })}
         
        
      </div>
    );
}
  


export default Weather;