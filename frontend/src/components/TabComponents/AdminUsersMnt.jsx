import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";

const AdminUsersMnt = (props) => {
  
    const [pageLabels, handlePageLabels] = useState("");
    const [currValues, setCurrentValues] = useState({userName: null, password: null, role: "USER", email: null, phone: null,
      firstName: null, lastName: null, country: null, city: null, province: null, teamsCreated: [], 
      requestsSent: [], notifications: [], successfulLoginDetails: [], failedLoginDetails: { failedLogins: [] }
    })
    const [sportsSelected, setSportsSelected] = useState([])
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const sportsOptions = [ {label: "Soccer", value: "soccerId"}, {label: "Basketball", value: "basketId"} ]

    useEffect(() => {
        if (props.action === "creation") {
            handlePageLabels({title: "CREATE USER ACCOUNT", button1: "Create Account"})
        } else {
            handlePageLabels({title: "UPDATE USER ACCOUNT", button1: "Update"})
            setCurrentValues({status: "ACTV", userName: "hpotter", email: "hpotter@gmail.com", password: "991f120169ac3db7cbd57b9af5f8fb81718a14d19dc79db185160a66ec4dcd09", salt: "buFeA9ckvzI/DXBLL8PhJQ==", 
              role: "USER", adminAnnounce: [], phone: "", firstName: "Harry", lastName: "Potter", country: "United Kingdom", city: "London", province: "N/A",
              teamsCreated: ["648ba154251b78d7946df340", "648ba154251b78d7946df344"], 
              requestsSent: ["648ba154251b78d7946df34a", "648ba154251b78d7946df335"], 
              notifications: ["648ba154251b78d7946df34b", "648ba154251b78d7946df335" ], 
              successfulLoginDetails: [{sourceIpAddress: "194.120.180.275", Timestamp: "2023-06-15T23:40:04.233+00:00"}, {sourceIpAddress: "194.120.180.275", Timestamp: "2023-06-18T12:35:19.123+00:00"}], 
              failedLoginDetails: { numberOfLoginTries: 8, numberOfFailedLogins: 2, 
                failedLogins: [{sourceIpAddress: "194.120.180.275", Timestamp: "2023-07-01T23:40:04.233+00:00"}, {sourceIpAddress: "194.120.180.275", Timestamp: "2023-07-01T23:42:19.123+00:00"}],
                consecutiveLockedOuts: null, lockedOutTimestamp: null },
              detailsOTP: { OTP: null, expiryTimeOTP: null }, createdAt: "2023-06-15T23:40:04.236+00:00", updatedAt: "2023-06-15T23:40:04.875+00:00"
            })
            setSportsSelected([{label: "Basketball", value: "basketId"}])
            setImageURL("https://images.lifestyleasia.com/wp-content/uploads/sites/3/2022/12/31011513/harry-potter-films.jpeg")
            setSelectedImage("x")
        }
    }, []);

    const roleOptions = [ {label: "Regular user", value: "USER"}, {label: "System admin", value: "ADMIN"} ]

    const handlePhotoChange = event => {
      setSelectedImage(event.target.files[0])
      setImageURL(URL.createObjectURL(event.target.files[0]))
    };

    const handleAccountDetails = (e) => {
      const field = e.target.name
      setCurrentValues({ ...currValues, [field] : e.target.value })
    }

    const navigate = useNavigate(); 
    const navigateCreateUpdate = () => { 
        // do validations first then send to server
        // Pass new/update values to parent component 
        props.onDataChange(currValues)
    }

    const navigateCancel = () => {
        props.onDataChange()
    }

  return (
    <div className="d-flex container mt-2 justify-content-center" >
      <Card style={{ width: "70rem", padding: 20 }}>
        <h2 className="mb-4 center-text">{pageLabels.title}</h2>
        <form action="">

            <div className="row">

                <div className="col-2 text-end"><label htmlFor="userName" className="form-label">Username*</label></div>
                <div className="col-4 mb-1"><input name="userName" type="text" className="form-control" defaultValue={currValues.userName} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="password" className="form-label" >Password*</label></div>
                <div className="col-4 mb-1"><input name="password" type="password" className="form-control" defaultValue={currValues.password} onChange={handleAccountDetails}/></div>
                <div className="col-2 text-end"><label htmlFor="role" className="form-label" >Role*</label></div>
                <div className="col-4 mb-1">
                    <select name="role" type="text" className="form-control" defaultValue={currValues.role} onChange={handleAccountDetails}>
                        {roleOptions.map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="col-2 text-end"><label htmlFor="email" className="form-label">Email*</label></div>
                <div className="col-4 mb-1"><input name="email" type="email" className="form-control" defaultValue={currValues.email} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="sports" className="form-label">Sports of interest**</label></div>
                <div className="col-4 mb-1"><MultiSelect options={sportsOptions} value={sportsSelected} onChange={setSportsSelected} className="form-control"/></div>
                <div className="col-2 text-end"><label htmlFor="phone" className="form-label">Phone Number</label></div>
                <div className="col-4 mb-1"><input name="phone" type="text" className="form-control" defaultValue={currValues.phone} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="firstName" className="form-label">First Name*</label></div>
                <div className="col-4 mb-1"><input name="firstName" type="text" className="form-control" defaultValue={currValues.firstName} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="lastName" className="form-label">Last Name*</label></div>
                <div className="col-4 mb-1"><input name="lastName" type="text" className="form-control" defaultValue={currValues.lastName} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="country" className="form-label"> Country**</label></div>
                <div className="col-4 mb-1"><input name="country" type="text" className="form-control" defaultValue={currValues.country} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="city" className="form-label">City**</label></div>
                <div className="col-4 mb-1"><input name="city" type="text" className="form-control" defaultValue={currValues.city} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="province" className="form-label">Province/State**</label></div>
                <div className="col-4 mb-1"><input name="province" type="text" className="form-control" defaultValue={currValues.province} onChange={handleAccountDetails} /></div>
            
            </div>
            <div className="row">

                { props.action !== "creation" && (
                <>
                    <div className="col-2 text-end"><label htmlFor="teamsCreated" className="form-label" >Teams Created</label></div>
                    <div className="col mb-1">
                        {currValues.teamsCreated.map((team) => (
                            <><a href={`/team/${team}`} target="_blank" rel="noreferrer" name="teamsCreated" className="col-10 mb-1" key={team}>{team}</a>
                            <p className = "col-2"></p></>
                        ))}
                    </div>

                </>
                ) }

            </div>

            <div className="row justify-content-center">
                < div className="col-sm-3 mb-3 text-center">
                    <label htmlFor="upload" className="form-label ">Profile picture</label>
                        {selectedImage && (
                            <div>
                                <img src={imageURL} alt="profile picture" className="rounded mw-100 mb-2 border border-secondary" style={{ width: "13rem", height: "13rem"}} />
                                <button onClick={() => setSelectedImage(null)} className="btn btn-secondary mb-3" >Remove</button>
                            </div>
                        ) }
                        {!selectedImage && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="rounded mw-100 mb-3 border border-secondary" style={{ width: "100rem", height: "13rem"}} viewBox="0 0 16 16">
                                <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            </svg> 
                        )}
                    <input type="file" id="upload" name="upload" className="form-control" onChange={handlePhotoChange} />
                </div>
            </div>

            <div className="row justify-content-center">
                <button className="btn btn-dark col-2 mx-5" type="button" onClick={navigateCreateUpdate}>
                    {pageLabels.button1}
                </button>
                <button type="button" className="btn btn-outline-secondary col-2" onClick={navigateCancel}>
                    Cancel
                </button>
            </div>

        </form>
      </Card>
    </div>
  );
};

export default AdminUsersMnt;
