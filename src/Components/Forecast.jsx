import React from 'react';
import styled from 'styled-components'
import sunny from '../Img/wi-day-sunny.svg'
import cloudy from '../Img/wi-cloudy.svg'
import intermittentshowers from '../Img/wi-day-rain-mix.svg'
import rain from '../Img/wi-rain.svg'
import lightrain from '../Img/wi-rain-mix.svg'
import pcloudy from '../Img/wi-day-cloudy-high.svg'
import mcloudy from '../Img/wi-day-cloudy.svg'
import snow from '../Img/wi-snow.svg'
import ts from '../Img/wi-thunderstorm.svg'



const WeatherCard = styled.div`
    background-color: rgba(255, 255, 255, 0.5);
    border: 2px solid black;
    width: 12%;
`

const Img = styled.img`
    width: 70%;
`

const H3 = styled.h3`
    margin-bottom: 0;
    margin-top: 0.5rem;
`

const H5 = styled.h5`
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
`

let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

let date = new Date()
let day = date.getDay()

function Forecast(props) {

    const weatherImg = () => {
        switch (props.cloudcover) {
            case "cloudy":
                return cloudy
            case "clear":
                return sunny
            case "ishower":
                return intermittentshowers
            case "lightrain":
                return lightrain
            case "rain":
                return rain
            case "pcloudy":
                return pcloudy
            case "mcloudy":
                return mcloudy
            case "humid":
                return pcloudy
            case "oshower":
                return lightrain
            case "snow":
                return snow
            case "lightsnow":
                return snow
            case "rainsnow":
                return snow
            case "ts":
                return ts
            case "tsrain":
                return ts
            default:
                return sunny
        }
    }
    
    const cloudCover = () => {
        switch (props.cloudcover) {
            case "cloudy":
                return "Cloudy"
            case "clear":
                return "Sunny"
            case "ishower":
                return "Showers"
            case "lightrain":
                return "Light Rain"
            case "rain":
                return "Rain"
            case "pcloudy":
                return "Partly Cloudy"
            case "mcloudy":
                return "Cloudy"
            case "humid":
                return "Humid"
            case "oshower":
                return "Rain"
            case "snow":
                return "Snow"
            case "lightsnow":
                return "Snow"
            case "rainsnow":
                return "Snow"
            case "ts":
                return "Thuderstorms"
            case "tsrain":
                return "Thuderstorms"
            default:
                return "Sunny"
        }
    }

    return (
        <WeatherCard className='DayForecast'>

            <H3>{days[(props.index + day)%7]}</H3>
            <Img src={weatherImg()} />
            <H3>{cloudCover()}</H3>
            <H3>{props.temperatureMax}°</H3>
            <H5>{props.temperatureMin}°</H5>
    
        </WeatherCard>
    )
}


export default Forecast;