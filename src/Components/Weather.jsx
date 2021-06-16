import React, { useState, useEffect } from "react";
import Forecast from "./Forecast";
import styled from "styled-components";
import Button from "./Button";
import returnKey from "../key.js";

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

  useEffect(() => {
    !position &&
      navigator.geolocation.getCurrentPosition((data) => {
        setPosition({
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
        });
      });
  }, []);

  useEffect(() => {
    position &&
      fetch(
        "http://www.7timer.info/bin/api.pl?lon=" +
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

    position &&
      fetch(
        `http://api.positionstack.com/v1/reverse?access_key=${returnKey()}&query=${
          position.latitude
        },${position.longitude}&output=json`
      )
        .then((res) => res.json())
        .then((info) => {
          setLocation({
            city: info.data[0].locality,
            country: info.data[0].country,
          });
        })
        .catch((error) => console.log(error));
  }, [position]);

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoaded(false);
    fetch(
      `http://api.positionstack.com/v1/forward?access_key=${returnKey()}&query=${searchText.replaceAll(
        " ",
        "%20"
      )}&output=json`
    )
      .then((res) => res.json())
      .then((info) => {
        setPosition({
          latitude: Number(info.data[0].latitude),
          longitude: Number(info.data[0].longitude),
        });
      });
  };

  const toggleCandF = () => {
    const tempButton = document.getElementById("cToF");
    tempButton.innerHTML = celcius ? "Switch to °C" : "Switch to °F";
    setCelcius(!celcius);
  };

  const setTemp = (temp) => {
    if (celcius) {
      return temp;
    } else {
      return (temp * 9) / 5 + 32;
    }
  };

  return (
    <WeatherDiv>
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
      <ForecastWrapper>
        {!isLoaded && (
          <LoadSpan>
            <div className="loader"></div>
          </LoadSpan>
        )}
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
