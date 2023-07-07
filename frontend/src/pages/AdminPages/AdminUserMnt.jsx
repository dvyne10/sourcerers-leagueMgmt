import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";
import useAuth from "../../hooks/auth";

const AdminUserMnt = () => {
  
    const {isSignedIn, isAdmin} = useAuth()
    const [action, handleAction] = useState("");
    const [currValues, setCurrentValues] = useState({userName: null, password: null, role: "USER", email: null, phone: null,
      firstName: null, lastName: null, country: null, city: null, province: null, teamsCreated: [], 
      requestsSent: [], notifications: [], successfulLoginDetails: [], failedLoginDetails: { failedLogins: [] }
    })
    const [sportsSelected, setSportsSelected] = useState([])
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const sportsOptions = [ {label: "Soccer", value: "soccerId"}, {label: "Basketball", value: "basketId"} ]
    const roleOptions = [ {label: "Regular user", value: "USER"}, {label: "System admin", value: "ADMIN"} ]
    const accountStatus = [ {label: "Active", value: "ACTV"}, {label: "Banned", value: "BAN"},
        {label: "Suspended", value: "SUSP"}, {label: "Locked", value: "LOCK"}, {label: "Pending", value: "PEND"} ]

    useEffect(() => {
        const url = window.location.pathname
        if (url === "/adminusercreation") {
            handleAction({type: "Creation", title: "CREATE USER ACCOUNT", button1: "Create Account"})
        } else {
            handleAction({type: "Update", title: "UPDATE USER ACCOUNT", button1: "Update"})
            setCurrentValues({status: "ACTV", userName: "hpotter", email: "hpotter@gmail.com", password: "991f120169ac3db7cbd57b9af5f8fb81718a14d19dc79db185160a66ec4dcd09", salt: "buFeA9ckvzI/DXBLL8PhJQ==", 
              role: "USER", adminAnnounce: [], phone: "", firstName: "Harry", lastName: "Potter", country: "United Kingdom", city: "London", province: "N/A",
              teamsCreated: ["648ba154251b78d7946df340", "648ba154251b78d7946df344"], 
              requestsSent: ["648ba154251b78d7946df34a", "648ba154251b78d7946df335"], 
              notifications: ["648ba154251b78d7946df34b", "648ba154251b78d7946df335" ], 
              successfulLoginDetails: [{sourceIpAddress: "194.120.180.275", timestamp: "2023-06-15T23:40:04.233+00:00"}, {sourceIpAddress: "194.120.180.275", timestamp: "2023-06-18T12:35:19.123+00:00"}], 
              failedLoginDetails: { numberOfLoginTries: 8, numberOfFailedLogins: 2, 
                failedLogins: [{sourceIpAddress: "194.120.180.275", timestamp: "2023-07-01T23:40:04.233+00:00"}, {sourceIpAddress: "194.120.180.275", timestamp: "2023-07-01T23:42:19.123+00:00"}],
                consecutiveLockedOuts: null, lockedOutTimestamp: null },
              detailsOTP: null, expiryTimeOTP: "" , createdAt: "2023-06-15T23:40:04.236+00:00", updatedAt: "2023-06-15T23:40:04.875+00:00"
            })
            setSportsSelected([{label: "Basketball", value: "basketId"}])
            setImageURL("https://images.lifestyleasia.com/wp-content/uploads/sites/3/2022/12/31011513/harry-potter-films.jpeg")
            setSelectedImage("x")
        }
    }, []);

    const handlePhotoChange = event => {
      setSelectedImage(event.target.files[0])
      setImageURL(URL.createObjectURL(event.target.files[0]))
    };

    const handleSuccLoginChange = (event, index) => {
        const field = event.target.name
        let newList = [...currValues.successfulLoginDetails]
        newList[index][field] = event.target.value
        setCurrentValues({ ...currValues, successfulLoginDetails : newList })
    }

    const handlefailedLoginDetails  = (event) => {
        const field = event.target.name
        let newList = {...currValues.failedLoginDetails}
        if (field !== "lockedOutTimestamp") {
            newList[field] = Number(event.target.value)
        } else {
            newList[field] = event.target.value
        }
        setCurrentValues({ ...currValues, failedLoginDetails : newList })
    }

    const handleFailedLoginChange = (event, index) => {
        const field = event.target.name
        let newList = {...currValues.failedLoginDetails}
        newList.failedLogins[index][field] = event.target.value
        setCurrentValues({ ...currValues, failedLoginDetails : newList })
    }

    const handleAccountDetails = (e) => {
      const field = e.target.name
      setCurrentValues({ ...currValues, [field] : e.target.value })
    }

    const navigate = useNavigate(); 
    const navigateCreateUpdate = () => { 
        // do validations first then send to server
        // Pass new/update values to parent component 
        navigate(-1)
    }

    const navigateCancel = () => {
        navigate(-1)
    }

  return (
    <div className="d-flex container mt-2 justify-content-center" >
        { !isSignedIn || !isAdmin ? (
          <div>
            <h1>NOT AUTHORIZED TO ACCESS THIS PAGE !!!</h1>
          </div>
        ) : (
      <Card style={{ width: "70rem", padding: 20 }}>
        <h2 className="mb-4 center-text">{action.title}</h2>
        <form action="" encType="multipart/form-data">

            { action.type !== "Creation" && (
                <div className = "row mb-2">
                    <div className="col-2 text-end"><label htmlFor="status" className="form-label" >Account status*</label></div>
                    <div className="col-4">
                        <select name="status" type="text" className="form-control" value={currValues.status} onChange={handleAccountDetails}>
                            {accountStatus.map((option) => (
                                <option value={option.value} key={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="userName" className="form-label">Username*</label></div>
                <div className="col-4"><input name="userName" type="text" className="form-control" defaultValue={currValues.userName} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="password" className="form-label" >Password*</label></div>
                <div className="col-4"><input name="password" type="password" className="form-control" defaultValue={currValues.password} onChange={handleAccountDetails}/></div>
            </div>
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="role" className="form-label" >Role*</label></div>
                <div className="col-4">
                    <select name="role" type="text" className="form-control" value={currValues.role} onChange={handleAccountDetails}>
                        {roleOptions.map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="col-2 text-end"><label htmlFor="email" className="form-label">Email*</label></div>
                <div className="col-4"><input name="email" type="email" className="form-control" defaultValue={currValues.email} onChange={handleAccountDetails} /></div>
            </div>
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="sports" className="form-label">Sports of interest**</label></div>
                <div className="col-4"><MultiSelect options={sportsOptions} value={sportsSelected} onChange={setSportsSelected} className="form-control"/></div>
                <div className="col-2 text-end"><label htmlFor="phone" className="form-label">Phone Number</label></div>
                <div className="col-4"><input name="phone" type="text" className="form-control" defaultValue={currValues.phone} onChange={handleAccountDetails} /></div>
            </div>
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="firstName" className="form-label">First Name*</label></div>
                <div className="col-4"><input name="firstName" type="text" className="form-control" defaultValue={currValues.firstName} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="lastName" className="form-label">Last Name*</label></div>
                <div className="col-4"><input name="lastName" type="text" className="form-control" defaultValue={currValues.lastName} onChange={handleAccountDetails} /></div>
            </div>
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="country" className="form-label"> Country**</label></div>
                <div className="col-4 mb-1"><input name="country" type="text" className="form-control" defaultValue={currValues.country} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="city" className="form-label">City**</label></div>
                <div className="col-4 mb-1"><input name="city" type="text" className="form-control" defaultValue={currValues.city} onChange={handleAccountDetails} /></div>
            </div>
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="province" className="form-label">Province/State**</label></div>
                <div className="col-4 mb-1"><input name="province" type="text" className="form-control" defaultValue={currValues.province} onChange={handleAccountDetails} /></div>
            </div>
            <div className="row">

                { action.type !== "Creation" && (
                <>
                    <div className="col-2 text-end mt-3"><label htmlFor="teamsCreated" className="form-label" >Teams Created</label></div>
                    <div className="col mt-3">
                        {currValues.teamsCreated.map((team) => (
                            <><a href={`/adminteamupdate/${team}`} target="_blank" rel="noreferrer" name="teamsCreated" className="col-10 mb-1" key={team}>{team}</a>
                            <div className = "col-2 mb-1"></div></>
                        ))}
                    </div>
                    <p/>
                    <div className="col-2 text-end"><label htmlFor="requestsSent" className="form-label" >Requests Sent</label></div>
                    <div className="col mb-1">
                        {currValues.requestsSent.map((req) => (
                            <><a href={`/adminrequestupdate/${req}`} target="_blank" rel="noreferrer" name="requestsSent" className="col-10 mb-1" key={req}>{req}</a>
                            <div className = "col-2 mb-1"></div></>
                        ))}
                    </div>
                    <p/>
                    <div className="col-2 text-end"><label htmlFor="notifications" className="form-label" >Notifications</label></div>
                    <div className="col mb-1">
                        {currValues.notifications.map((notif) => (
                            <><a href={`/adminnotificationupdate/${notif}`} target="_blank" rel="noreferrer" name="notifications" className="col-10 mb-1" key={notif}>{notif}</a>
                            <div className = "col-2 mb-1"></div></>
                        ))}
                    </div>
                    <div className="row mt-3">
                        <div className="col-2 text-end"><label htmlFor="successfulLoginDetails" className="form-label" >Successful Logins : </label></div>
                        <div className="col-3 text-center"><label htmlFor="sourceIpAddress" className="form-label" >IP Address</label></div>
                        <div className="col-4 text-center"><label htmlFor="timestamp" className="form-label" >Timestamp</label></div>
                    </div>
                    <div className="col mb-1">
                        {currValues.successfulLoginDetails.map((login, index) => (
                            <div className="row" key={index}>
                                <p className = "col-2"></p>
                                <div className="col-3 mb-1"><input name="sourceIpAddress" type="text" className="form-control" defaultValue={login.sourceIpAddress} onChange={(e) => handleSuccLoginChange(e, index)} /></div>
                                <div className="col-4 mb-1"><input name="timestamp" type="text" className="form-control" defaultValue={login.timestamp} onChange={(e) => handleSuccLoginChange(e, index)} /></div>
                            </div>
                        ))}
                    </div>
                    <div className="row mt-2">
                        <div className="col-2 text-end"><label htmlFor="failedLoginDetails" className="form-label" >Failed Login Details : </label></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="numberOfLoginTries" className="form-label">Number of Failed Login Tries Allowed</label></div>
                        <div className="col-1"><input name="numberOfLoginTries" type="number" min="0" className="form-control" defaultValue={currValues.failedLoginDetails.numberOfLoginTries} onChange={handlefailedLoginDetails} /></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="numberOfFailedLogins" className="form-label">Number of Failed Logins</label></div>
                        <div className="col-1"><input name="numberOfFailedLogins" type="number" min="0" className="form-control" defaultValue={currValues.failedLoginDetails.numberOfFailedLogins} onChange={handlefailedLoginDetails} /></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="consecutiveLockedOuts" className="form-label">Consecutive times account was locked-out</label></div>
                        <div className="col-1"><input name="consecutiveLockedOuts" type="number" min="0" className="form-control" defaultValue={currValues.failedLoginDetails.consecutiveLockedOuts} onChange={handlefailedLoginDetails} /></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="lockedOutTimestamp" className="form-label">Timestamp Account is Locked out</label></div>
                        <div className="col-4"><input name="lockedOutTimestamp" type="text" className="form-control" defaultValue={currValues.failedLoginDetails.lockedOutTimestamp} onChange={handlefailedLoginDetails} /></div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-4 text-end"><label htmlFor="failedLogins" className="form-label" >Failed Logins : </label></div>
                        <div className="col-3 text-center"><label htmlFor="sourceIpAddress" className="form-label" >IP Address</label></div>
                        <div className="col-4 text-center"><label htmlFor="timestamp" className="form-label" >Timestamp</label></div>
                    </div>
                    <div className="col mb-1">
                        {currValues.failedLoginDetails.failedLogins.map((login, index) => (
                            <div className="row" key={index}>
                                <p className = "col-4"></p>
                                <div className="col-3 mb-1"><input name="sourceIpAddress" type="text" className="form-control" defaultValue={login.sourceIpAddress} onChange={(e) => handleFailedLoginChange(e, index)} /></div>
                                <div className="col-4 mb-1"><input name="timestamp" type="text" className="form-control" defaultValue={login.timestamp} onChange={(e) => handleFailedLoginChange(e, index)} /></div>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        <div className="col-2 text-end"><label htmlFor="detailsOTP" className="form-label" >OTP Details : </label></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="detailsOTP" className="form-label">One Time Password</label></div>
                        <div className="col-2"><input name="detailsOTP" type="number" min="0" className="form-control" defaultValue={currValues.detailsOTP} onChange={handleAccountDetails} /></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="expiryTimeOTP" className="form-label">OTP Expiry Timestamp</label></div>
                        <div className="col-4"><input name="expiryTimeOTP" type="text" className="form-control" defaultValue={currValues.expiryTimeOTP} onChange={handleAccountDetails} /></div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-3 text-end"><label htmlFor="createdAt" className="form-label">Date of Account Creation :</label></div>
                        <div className="col-4"><p className="form-label">{currValues.createdAt}</p></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3 text-end"><label htmlFor="updatedAt" className="form-label">Account Latest Update Date :</label></div>
                        <div className="col-4"><p className="form-label">{currValues.updatedAt}</p></div>
                    </div>
                    <p/>
                </>
                ) }

            </div>

            <div className="row justify-content-center mt-3">
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
                    <input type="file" id="upload" name="upload" className="form-control" onChange={handlePhotoChange} accept="image/*"/>
                </div>
            </div>

            <div className="row justify-content-center">
                <button className="btn btn-dark col-2 mx-5" type="submit" onClick={navigateCreateUpdate}>
                    {action.button1}
                </button>
                <button type="button" className="btn btn-outline-secondary col-2" onClick={navigateCancel}>
                    Cancel
                </button>
            </div>

        </form>
      </Card>
      )}
    </div>
  );
};

export default AdminUserMnt;
