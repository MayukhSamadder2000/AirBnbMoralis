import React, { useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import bg from "../images/frontpagebg2.png";
import logo from "../images/airbnb.png";
import { ConnectButton, Select, DatePicker, Input, Icon, Button } from "web3uikit";
const Home = () => {
  const [destination, setDestination] = useState("New York")
  const [checkIn, setCheckIn] = useState(new Date())
  const [checkOut, setCheckOut] = useState(new Date())
  const [guests, setGuests] = useState(2)
  return (
    <>
      <div className="container" style={{ backgroundImage: `url(${bg})` }}>
        <div className="containerGradinet"></div>
      </div>
      <div className="topBanner">
        <div>
          <img className="logo" src={logo} alt="logo" />
        </div>
        <div className="tabs">
          <div className="selected">Places To Stay</div>
          <div>Experiences</div>
          <div>Online Experiences</div>
        </div>
        <div className="lrContainers">
          <ConnectButton />
        </div>
      </div>
      <div className="tabContent">
        <div className="searchFields">
          <div className="inputs">
            Location
            <Select
              defaultOptionIndex={0}
              onChange={(e) => setDestination(e.label)}
              options={[
                {
                  id: "ny",
                  label: "New York",
                },
                {
                  id:'lon',
                  label: "London",
                },
                {
                  id:'db',
                  label: "Dubai",
                },
                {
                  id:'la',
                  label: "Los Angeles",
                }
              ]}
            />
          </div>
          <div className="vl"></div>
          <div className="inputs">
            Check In
            <DatePicker
              onChange={(e) => setCheckIn(e.date)}
              id="checkIn"
              />
          </div>
          <div className="vl"></div>
          <div className="inputs">
            Check Out
            <DatePicker
              onChange={(e) => setCheckOut(e.date)}
              id="checkOut"
              />
          </div>
          <div className="vl"></div>
          <div className="inputs">
            Guests
            <Input
              onChange={(e) => setGuests(Number(e.target.value))}
              id="guests"
              name="AddGuests"
              type="number"
              value={2}
              />
          </div>
          <Link to={"/rentals"} state={{
            destination,
            checkIn,
            checkOut,
            guests
          }}>
          <div className="searchButton">
              <Icon fill="#ffffff" size={24} svg="search" />
          </div>
          </Link>
        </div>
      </div>
      <div className="randomLocation">
        <div className="title">
          Feel Adventerous
        </div>
        <div className="text">
          Go for a trip to the best destinations in the world and discover the world of tomorrow.
        </div>
          <Button
          text="Explore Random Areas"
          onClick={() => { }}
          />
      </div>
    </>
  );
};

export default Home;
