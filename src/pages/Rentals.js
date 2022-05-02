import React, { useState, useEffect } from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import logo from "../images/airbnbRed.png";
import { Button, ConnectButton, Icon, useNotification } from "web3uikit";
import RentalsMap from "../components/RentalsMap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import User from "../components/User";

const Rentals = () => {
  let location = useLocation();
  const { Moralis, account } = useMoralis();
  const { state: searchFilters } = location;
  const [highlight, setHighlight] = useState();
  const [rentalsList, setRentalsList] = useState()
  const [coOrdinates, setCoOrdinates] = useState();
  const contractProcessor = useWeb3ExecuteFunction()
  const dispatch = useNotification()

  const handleSuccess = (data) => {
    dispatch({
      type: "success",
      message: `Nice You're going to ${searchFilters.destination}!!`,
      title: "Booking Successful",
      position:"topR",
      autoDismiss: 5,
    })
  }
  const handleError = (error) => {
    dispatch({
      type: "error",
      message: `${error}`,
      title: "Booking Failed",
      position:"topR",
    })
  }

  const handleNoAccount = () => {
    dispatch({
      type: "error",
      message: `Please Connect to Metamask`,
      title: "Booking Failed",
      position:"topR",
    })
  }

  useEffect(() => {
    
    const fetchRentalsList = async () => {
      const mor = await Moralis.start({
        appId: process.env.REACT_APP_API_KEY,
        serverUrl: process.env.REACT_APP_SERVER_URL,
      });
      const Rentals = Moralis.Object.extend("Rentals");
      const query = new Moralis.Query(Rentals);
      query.equalTo("city", searchFilters.destination);
      query.greaterThanOrEqualTo("maxGuests_decimal", searchFilters.guests);
      const results = await query.find();
      let cords = [];
      console.log("PPP",results);
      
      results.forEach((rental) => {
        cords.push({ lat: rental.attributes.lat, lng: rental.attributes.lng });
      });
      setRentalsList(results);
      setCoOrdinates(cords);
    }
    fetchRentalsList();

  }, [searchFilters])

  const bookRental = async (start, end, id, dayPrice) => {
    for(
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ){
      arr.push(new Date(dt).toISOString().slice(0,10));
    }
    let options = {
      contractAddress : process.env.REACT_APP_CONTRACT_ADDRESS,
      functionName : "addDatesBooked",
      abi : [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "newBookings",
              "type": "string[]"
            }
          ],
          "name": "addDatesBooked",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ],
      params:{
        id: id,
        newBookings: arr,
      },
      msgValue: Moralis.Units.ETH(dayPrice * arr.length)
    }
    await contractProcessor.fetch({
      params: options,
      onSuccess: (result) => {
        handleSuccess();
      },
      onError: (error) => {
        handleError(error.data.message);
      }
    })
  }
  

  return (
    <>
      <div className="topBanner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
        </div>
        <div className="searchReminder">
          <div className="filter">{searchFilters.destination}</div>
          <div className="vl"></div>
          <div className="filter">
            {`
            ${searchFilters.checkIn.toLocaleString("default", {
              month: "short",
            })}
            ${searchFilters.checkIn.toLocaleString("default", {
              day: "2-digit",
            })}
          `}
            -
            {`
            ${searchFilters.checkOut.toLocaleString("default", {
              month: "short",
            })}
            ${searchFilters.checkOut.toLocaleString("default", {
              day: "2-digit",
            })}
          `}
          </div>
          <div className="vl"></div>
          <div className="filter">
            {searchFilters.guests}
            Guests
          </div>
          <div className="searchFiltersIcon">
            <Icon fill="#ffffff" size={20} svg="search" />
          </div>
        </div>
        <div className="lrContainers">
          {
            account && (
              <User account={account  ? account : null} />
            )
          }
          <ConnectButton />
        </div>
      </div>
      <hr className="line"></hr>
        <div className="rentalsContent">
          <div className="rentalsContentL">
            Stays Available for your destination
            {
              rentalsList && rentalsList.map((rental, index) => {
                return (
                  <>
                    <hr className="line2"></hr>
                    <div className={highlight == index ? "rentalDivH" : "rentalDiv"}>
                      <img className="rentalImg" src={rental.attributes.imgUrl} alt="rental" />
                      <div className="rentalInfo">
                        <div className="rentalTitle">
                          {
                            rental.attributes.name
                          }
                        </div>
                        <div className="rentalDesc">
                          {
                            rental.attributes.unoDescription
                          }
                        </div>
                        <div className="rentalDesc">
                          {
                            rental.attributes.dosDescription
                          }
                        </div>
                        <div className="bottomButton">
                          <Button
                            text="Stay here"
                            onClick={() => {
                              console.log(rental)
                              if(account){
                                bookRental(
                                  searchFilters.checkIn, 
                                  searchFilters.checkOut, 
                                  rental.attributes.uid_decimal.value.$numberDecimal, 
                                  Number(rental.attributes.pricePerDay_decimal.value.$numberDecimal))
                              }
                              else{
                                handleNoAccount();
                              }
                            }}
                            />
                            <div className="price">
                              <Icon fill="#808080" size={10} svg="matic" /> {rental.attributes.pricePerDay} / Day
                            </div>
                        </div>
                        
                      </div>
                    </div>
                  </>
                )
              }
              )
            }
          </div>
          <div className="rentalsContentR">
            {
              coOrdinates && (
              <RentalsMap locations={coOrdinates} setHighlight={setHighlight}/>
              )
            }
          </div>

        </div>
    </>
  );
};

export default Rentals;
