import React, {useState, useEffect} from "react";
import { useMoralis } from "react-moralis";
import { Icon, Modal, Card } from "web3uikit";

function User(props) {
  const { account } = props;
  const { Moralis } = useMoralis();
  const [isVisible, setIsVisible] = useState(false);
  const [userRentals, setUserRentals] = useState();

  useEffect(() => {
    const fetchRentalsList = async () => {
      const mor = await Moralis.start({
        appId: process.env.REACT_APP_API_KEY,
        serverUrl: process.env.REACT_APP_SERVER_URL,
      });
      const Rentals = Moralis.Object.extend("newBookings");
      const query = new Moralis.Query(Rentals);
      query.equalTo("booker", account);
      const results = await query.find();
      setUserRentals(results);
    }
    fetchRentalsList();
  }, [isVisible])
  
  return (
    <>
      <div onClick={() => setIsVisible(true)}>
        <Icon fill="#000000" size={24} svg="user" />
      </div>
      <Modal
        isVisible={isVisible}
        onCloseButtonPressed={() => setIsVisible(false)}
        title="Your Stays"
        hasFooter={false}
      >
        <div style={{display:'flex', justifyContent:'start',flexWrap:'wrap', gap:'10px'}}>
          {userRentals && userRentals.map((rental, index) => {
            return (
              <div style={{ width:'200px'}}>
                <Card
                isDisabled
                title={rental.attributes.city}
                description={`${rental.attributes.datesBooked[0]} for ${rental.attributes.datesBooked.length} Days`}
                >
                  <div>
                    <img width="180px"
                    src={rental.attributes.imgUrl}
                    />
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </Modal>
    </>
  );
}

export default User;
