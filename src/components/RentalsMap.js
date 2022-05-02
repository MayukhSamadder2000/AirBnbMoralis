import React, { useState, useEffect} from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

function RentalsMap(props) {
  const { locations, google, setHighlight } = props;
  const [center, setCenter] = useState();
  useEffect(() => {
    var arr = Object.keys(locations);
    var getLat = (key) => locations[key].lat;
    var avgLat = arr.reduce((acc, curr) => acc + Number(getLat(curr)), 0) / arr.length;

    var getLng = (key) => locations[key].lng;
    var avgLng = arr.reduce((acc, curr) => acc + Number(getLng(curr)), 0) / arr.length;
    setCenter({ lat: avgLat, lng: avgLng });

  }, [locations])
  
  return (
    <>
      {
        center && (
          <Map
            google={google}
            zoom={13}
            center={center}
            containerStyle={{
              width: "50vw",
              height: "calc(100vh - 135px)",
            }}
            initialCenter={locations[0]}
            disableDefaultUI={true}
            >
              {
                locations.map((location, index) => {
                  return (
                    <Marker
                      key={index}
                      position={{ lat: location.lat, lng: location.lng }}
                      onClick={() => setHighlight(index)}
                    />
                  )
                })
              }

            </Map>
        )
      }
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAP_API_KEY,
})(RentalsMap);
