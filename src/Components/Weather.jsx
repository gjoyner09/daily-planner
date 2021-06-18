import React, { useState, useEffect } from "react";
import Forecast from "./Forecast";
import styled from "styled-components";
import Button from "./Button";

const WeatherDiv = styled.span`
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-family: "Manrope", sans-serif;
  font-weight: bold;
`;

const HeaderWrapper = styled.span`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background-color: rgba(255, 255, 255, 0.7);

  @media only screen and (max-width: 700px) {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }
`;

const HeaderDivider = styled.span`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-family: "Yeseva One", cursive;
`;

const City = styled.h3`
  margin: auto;

  @media only screen and (max-width: 700px) {
    margin-right: 0;
  }
`;

const ForecastDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 0;
  margin: 0;
`;

const ForecastWrapper = styled.span`
  padding: 0;
  margin: 0;
  margin-top: 1rem;
  width: 100%;
`;

const Form = styled.form`
  padding: 0.5rem;
  margin: auto;
  @media only screen and (max-width: 700px) {
    padding-right: 0;
    padding-left: 0;
    margin-right: 0;
    float: right;
    width: 100%;
    text-align: right;
  }
`;

const TextInput = styled.input`
  margin-right: 0.2rem;

  @media only screen and (max-width: 700px) {
    width: 47%;
    margin-right: 0;
  }

  @media only screen and (max-width: 400px) {
    width: 40%;
  }

  @media only screen and (max-width: 350px) {
    width: 35%;
  }

  @media only screen and (max-width: 330px) {
    width: 30%;
  }
`;

const Label = styled.label`
  padding: 0.5rem;

  @media only screen and (max-width: 700px) {
    padding-left: 0;
  }
`;

const ButtonSpan = styled.span`
  padding: 0.5rem;
  margin: auto;

  @media only screen and (max-width: 700px) {
    width: 100%;
    margin-right: 0;
    margin-left: 0;
    padding: 0;
    padding-bottom: 0.5rem;
  }
`;

const ButtonCtoF = styled.button`
  width: 100px;
  display: inline-block;
  padding: 0.1em 0.7em;
  border: 0.1em solid #ffffff;
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.3em;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Manrope", sans-serif;
  font-weight: bold;
  color: #000000;
  background-color: rgb(230, 230, 230, 0.65);
  text-align: center;
  transition: all 0.2s;

  &:hover {
    color: #000000;
    background-color: rgb(230, 230, 230, 0.9);
    border: 0.1em solid #aaaaaa;
  }

  @media only screen and (max-width: 700px) {
    float: right;
  }
`;

const LoadSpan = styled.span`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
`;

const Weather = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [position, setPosition] = useState(null);
  const [location, setLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [celcius, setCelcius] = useState(true);

  // Get user's location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((data) => {
      setPosition({
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    // once position has been updated, get the weather for that location
    position &&
      fetch(
        "https://www.7timer.info/bin/api.pl?lon=" +
          position.longitude +
          "&lat=" +
          position.latitude +
          "&product=civillight&output=json"
      )
        .then((res) => res.json())
        .then((result) => {
          setIsLoaded(true);
          setItems(result.dataseries);
        })
        .catch((error) => console.log(error));

    // once position has been updated, get the city and country of that location
    position &&
      fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${position.latitude}+${position.longitude}&key=24033e439ac74d6b95c36ca8359ac919`
      )
        .then((res) => res.json())
        .then((info) => {
          setLocation({
            city: info.results[0].components.city,
            country: info.results[0].components.country,
          });
        })
        .catch((error) => console.log(error));
  }, [position]);

  // update the value in the search bar as the user types
  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  // when the user submits a search for a location, get the weather for that locatin and update the position in state
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoaded(false);
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${searchText.replaceAll(
        " ",
        "%20"
      )}&key=24033e439ac74d6b95c36ca8359ac919`
    )
      .then((res) => res.json())
      .then((info) => {
        setPosition({
          latitude: Number(info.results[0].geometry.lat),
          longitude: Number(info.results[0].geometry.lng),
        });
      });
  };

  // when the user click the "switch to" button, change the text of the button and update the temperatures
  const toggleCandF = () => {
    const tempButton = document.getElementById("cToF");
    tempButton.innerHTML = celcius ? "Switch to °C" : "Switch to °F";
    setCelcius(!celcius);
  };

  // convert celcius to fahrenheit
  const setTemp = (temp) => {
    if (celcius) {
      return temp;
    } else {
      return (temp * 9) / 5 + 32;
    }
  };

  return (
    <WeatherDiv>
      {/* Header of page with "Daily Planner" title, location, search bar and button to switch C/F */}
      <HeaderWrapper>
        <HeaderDivider>
          <Title>Daily Planner</Title>
        </HeaderDivider>
        <HeaderDivider>
          {isLoaded && location && location.city && (
            <City>
              {location.city}, {location.country}
            </City>
          )}
          <Form>
            <Label htmlFor="weatherLocation">Search location:</Label>
            <TextInput
              type="text"
              id="weatherLocation"
              name="weatherLocation"
              onChange={handleChange}
            />
            <Button onClick={handleSubmit}>Submit</Button>
          </Form>
          <ButtonSpan>
            <ButtonCtoF id="cToF" onClick={toggleCandF}>
              Switch to °F
            </ButtonCtoF>
          </ButtonSpan>
        </HeaderDivider>
      </HeaderWrapper>
      {/* Forecast portion with loading bar or forecasts */}
      <ForecastWrapper>
        {!isLoaded && (
          <LoadSpan>
            <div className="loader"></div>
          </LoadSpan>
        )}
        {/* map through the first 6 results for the weather forecast and display to the user */}
        {isLoaded && (
          <ForecastDiv>
            {items.map(function (item, index) {
              return (
                index < 6 && (
                  <Forecast
                    key={index}
                    index={index}
                    cloudcover={item.weather}
                    temperatureMax={Math.round(setTemp(item.temp2m.max))}
                    temperatureMin={Math.round(setTemp(item.temp2m.min))}
                  />
                )
              );
            })}
          </ForecastDiv>
        )}
      </ForecastWrapper>
    </WeatherDiv>
  );
};

export default Weather;
