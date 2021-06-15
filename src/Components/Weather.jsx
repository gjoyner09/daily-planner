import React, { useState, useEffect } from 'react';
import Forecast from './Forecast'
import styled from 'styled-components'

const WeatherDiv = styled.span`
    width: 100vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const HeaderWrapper = styled.span`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    background-color: rgba(255, 255, 255, 0.5);
`

const HeaderDivider = styled.span`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const City = styled.h3`
    margin: auto;
`

const ForecastDiv = styled.div`
    display: flex;
    justify-content: space-evenly;
    padding: 0;
    margin: 0;
`

const ForecastWrapper = styled.span`
    padding: 0;
    margin: 0;
    margin-top: 1rem;
    width: 100%;
`

const Form = styled.form`
    padding: 0.5rem;
    margin: auto;
`

const Label = styled.label`
    padding: 0.5rem;
`
const ButtonSpan = styled.span`
    padding: 0.5rem;
    margin: auto;
`

const Button = styled.button`
    height: 40%;
    margin: auto;
    width: 100px;
`

const LoadSpan = styled.span`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
`

function Weather() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [position, setPosition] = useState(null)
    const [location, setLocation] = useState(null)
    const [searchText, setSearchText] = useState('')
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
        tempButton.innerHTML = celcius ? "Switch to °C" : "Switch to °F"
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
      <WeatherDiv>
          <HeaderWrapper>
                <HeaderDivider>
                    <h2>Daily Planner</h2>
                </HeaderDivider>
                <HeaderDivider>
                    {isLoaded && location && location.city && <City>{location.city}, {location.country}</City>}
                    <Form onSubmit={handleSubmit}>
                            <Label htmlFor="weatherLocation">Search city:</Label>
                            <input type="text" id="weatherLocation" name="weatherLocation" onChange={handleChange}/>
                            <input type="submit" />
                    </Form>
                    <ButtonSpan>
                        <Button id="cToF" onClick={toggleCandF}>Switch to °F</Button>
                    </ButtonSpan>
                </HeaderDivider>
          </HeaderWrapper>
            <ForecastWrapper>
                    {!isLoaded &&
                        <LoadSpan>
                            <div className="loader"></div>
                        </LoadSpan>
                    }
                    {isLoaded && (
                        <ForecastDiv>
                            {items.map(function(item, index){
                                return (
                                    <Forecast key={index} index={index} cloudcover={item.weather} temperatureMax={Math.round(setTemp(item.temp2m.max))} temperatureMin={Math.round(setTemp(item.temp2m.min))} />
                                    )
                                })
                            }
                        </ForecastDiv>
                    )}
                </ForecastWrapper>
      </WeatherDiv>
    );
}
  


export default Weather;