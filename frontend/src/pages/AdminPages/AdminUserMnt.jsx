import { useState, useEffect, useRef }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useParams } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";
import { FaTrash, FaPlusCircle } from 'react-icons/fa';
import {checkIfSignedIn, getToken} from "../../hooks/auth";

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";

const AdminUserMnt = () => {
  
    let { isSignedIn, isAdmin } = checkIfSignedIn()
    const token = `Bearer ${getToken()}`
    const inputFile = useRef(null);
    const routeParams = useParams();
    const [action, handleAction] = useState("");
    const [currValues, setCurrentValues] = useState({userName: "", password: "", userType: "USER", email: "", phoneNumber: "",
      firstName: "", lastName: "", country: "", province: "", city: "", announcementsCreated: [{ showInHome: false, announcementMsg: "" }], teamsCreated: [], 
      successfulLoginDetails: [{sourceIPAddress: "", timestamp: null}], 
      failedLoginDetails: { numberOfLoginTries: 0, numberOfFailedLogins: 0, failedLogins: [{sourceIPAddress: "", timestamp: null}], consecutiveLockedOuts: 0, lockedTimestamp: null },
      detailsOTP: {OTP: "", expiryTimeOTP: null}
    })
    const [sportsSelected, setSportsSelected] = useState([])
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [sportsOptions, setSportsOptions] = useState([{ label: "Soccer", value: "648ba153251b78d7946df311" }, { label: "Basketball", value: "648ba153251b78d7946df322" }]);
    const roleOptions = [ {label: "Regular user", value: "USER"}, {label: "System admin", value: "ADMIN"} ]
    const accountStatus = [ {label: "Active", value: "ACTV"}, {label: "Banned", value: "BAN"},
        {label: "Suspended", value: "SUSP"}, {label: "Locked", value: "LOCK"}, {label: "Pending", value: "PEND"} ]
    const [countries, setCountries] = useState([ {name: null, states: []} ])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [prevCountry, setPrevCountry] = useState("")
    const [prevState, setPrevState] = useState("")
    const [errorMessage, setErrorMessage] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true)
        fetch(`${backend}/getsportslist`)
        .then(response => response.json())
        .then(resp => {
            if (resp.requestStatus === 'ACTC') {
                let newSportsList = resp.data.map(sport => {
                    return {label: sport.sportsName, value: sport.sportsId}
                })
                setSportsOptions(newSportsList.sort((a,b) => a.label > b.label ? 1 : -1))
            }
        })
        const url = window.location.pathname
        if (url === "/adminusercreation") {
            handleAction({type: "Creation", title: "CREATE USER ACCOUNT", button1: "Create Account"})
            getCountries()
            .then((data) => {
              setCurrentValues({ ...currValues, country : data[0].name, province: data[0].states[0].name})
              setIsLoading(false)
            })
        } else {
            handleAction({type: "Update", title: "UPDATE USER ACCOUNT", button1: "Update"})
            getCountries()
            fetch(`${backend}/admingetuser/${routeParams.userid}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                  "Content-Type": "Application/JSON",
                  "Authorization": token
                }
              })
              .then(response => response.json())
              .then(data=>{
                if (data.requestStatus === 'RJCT') {
                    setErrorMessage([data.errMsg])
                } else if (data.requestStatus === 'ACTC') {
                    let details = data.details
                    setPrevCountry(details.country);
                    setPrevState(details.province);
                    setCurrentValues({...currValues, status: details.status, userName: details.userName, email: details.email, password: details.password, salt: details.salt, 
                        userType: details.userType, phoneNumber: details.phoneNumber, firstName: details.firstName, lastName: details.lastName, country: details.country, province: details.province, city: details.city,
                        announcementsCreated: [...details.announcementsCreated],
                        teamsCreated: details.teamsCreated.map(team => team._id), 
                        successfulLoginDetails: [...details.successfulLoginDetails], 
                        failedLoginDetails: details.failedLoginDetails !== null ? {...details.failedLoginDetails} : currValues.failedLoginDetails,
                        detailsOTP: details.detailsOTP && details.detailsOTP !== null? {...details.detailsOTP} : currValues.detailsOTP, createdAt: details.createdAt, updatedAt: details.updatedAt
                    })
                    let sportsSelectedValues = "";
                    let sportsInDb = details.sportsOfInterest.map(sport => {
                      sportsSelectedValues = sportsSelectedValues + sport
                      let index = sportsOptions.findIndex(option => option.value ===  sport)
                      return {label: sportsOptions[index].label, value: sport}
                    })
                    setSportsSelected(sportsInDb);
                    fetch(`${backend}/profilepictures/${details._id}.jpeg`)
                    .then(res=>{
                        if (res.ok) {
                          setImageURL(`${backend}/profilepictures/${details._id}.jpeg`)
                          setSelectedImage("x")
                        }
                    })
                }
                setIsLoading(false)
            }).catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
        }
    }, [location.pathname]);

    useEffect(()=> {
        getStates(currValues.country)
    }, [currValues.country])
  
    useEffect(()=> {
        getCities(currValues.country, currValues.province)
    }, [currValues.province])

    const handlePhotoChange = event => {
        if (event.target.files.length > 0) {
            setSelectedImage(event.target.files[0])
            setImageURL(URL.createObjectURL(event.target.files[0]))
        }
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
    
    const handleOTPChange = (e) => {
        const field = e.target.name
        let newList = {...currValues.detailsOTP, [field] : e.target.value}
        setCurrentValues({ ...currValues, detailsOTP : newList })
    }

    const handleAnnouncements = (event, index) => {
        const field = event.target.name
        let newList = [...currValues.announcementsCreated]
        if (field === "showInHome") {
            newList[index].showInHome = !newList[index].showInHome
            setCurrentValues({ ...currValues, announcementsCreated : newList })
        } else {
            newList[index][field] = event.target.value
            setCurrentValues({ ...currValues, announcementsCreated : newList })
        }
      }

    const addAdminAnnouncement = () => {
        let newList = [...currValues.announcementsCreated]
        newList.push({ announcementMsg: "", showInHome: false })
        setCurrentValues({ ...currValues, announcementsCreated : newList })
    }

    const removeAdminAnnouncement = (index) => {
        console.log(index)
        let newList = [...currValues.announcementsCreated]
        newList = newList.filter((items, itemIndex) => itemIndex !== index)
        setCurrentValues({ ...currValues, announcementsCreated : newList })
    }

    function getCountries() {
        const url = 'https://countriesnow.space/api/v0.1/countries/states';
        return new Promise(function (resolve, reject) {
          fetch(url)
          .then(response => response.json())
          .then(responseData => {
            setCountries(responseData.data)
            resolve(responseData.data)
          })
        })
      }
  
      const getStates = (country) => {
        let newList = [...countries]
        let index = newList.findIndex(i => i.name === country);
        let statesFetched = []
        if (index != -1) {
          statesFetched = [...newList[index].states]
        }
        statesFetched.push({name: "N/A"})
        setStates(statesFetched)
        if (country !== prevCountry) {
          setCurrentValues({ ...currValues, province : statesFetched[0].name})
          setPrevCountry(country)
        }
      }
  
      const getCities = (country, state) => {
        if (country !== "" && state !== "") {
          let url = `https://countriesnow.space/api/v0.1/countries/state/cities/q?country=${country}&state=${state}`;
          if (state === "N/A") {
            url = `https://countriesnow.space/api/v0.1/countries/cities/q?country=${country}`;
          }
          try {
            fetch(url)
            .then(response => response.json())
            .then(responseData => {
              let citiesFetched = [...responseData.data]
              citiesFetched.push("N/A")
              setCities(citiesFetched)
              if (state !== prevState) {
                setCurrentValues({ ...currValues, city : citiesFetched[0]})
                setPrevState(state)
              }
            })
            .catch(()=> {
              setCities(["N/A"])
              setCurrentValues({ ...currValues, city : "N/A"})
              setPrevState(state)
            })
          } catch(error) {
            console.log(error);
          }
        }
      }

    const navigate = useNavigate(); 
    const navigateCreateUpdate = () => { 
        let data = {}
        setIsLoading(true)
        currValues.sportsOfInterest = []
        sportsSelected.map((i) => (currValues.sportsOfInterest.push(i.value)));
        if (action.type === "Creation") {
            data = {...currValues}
            //data.logo = selectedLogo
            //data.banner = selectedBanner
            fetch(`${backend}/admincreateuser`, {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "Application/JSON",
                    "Authorization": token
                }
            })
            .then(response => response.json())
            .then(data=>{
                if (data.requestStatus === 'RJCT') {
                    setErrorMessage([data.errMsg])
                } else {
                    navigate('/adminusers')
                }
                setIsLoading(false)
            }).catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
        } else {
            data = {...currValues}
            //data.logo = selectedLogo
            //data.banner = selectedBanner
            fetch(`${backend}/adminupdateuser/${routeParams.userid}`, {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "Application/JSON",
                    "Authorization": token
                }
            })
            .then(response => response.json())
            .then(data=>{
                if (data.requestStatus === 'RJCT') {
                    setErrorMessage([data.errMsg])
                    if (data.errField !== "") {
                        document.getElementById(data.errField).focus()
                    }
                } else {
                    navigate('/adminusers')
                }
                setIsLoading(false)
            }).catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
        }
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
            isLoading ? (
                <div className="loading-overlay">
                  <div style={{color: 'black'}}>Loading...</div>
                  <div className="loading-spinner"></div>
                </div>
              ) : (
      <Card style={{ width: "70rem", padding: 20 }}>
        {errorMessage.length > 0 && (
            <div className="alert alert-danger mb-3 p-1">
                {errorMessage.map((err, index) => (
                    <p className="mb-0" key={index}>{err}</p>
                ))}
            </div>
        )}
        <h2 className="mb-4 center-text">{action.title}</h2>
        <form action="" encType="multipart/form-data">
            { action.type !== "Creation" && (
                <div className = "row mb-2">
                    <div className="col-2 text-end"><label htmlFor="status" className="form-label" >Account status*</label></div>
                    <div className="col-4">
                        <select id="status" name="status" type="text" className="form-control" value={currValues.status} onChange={handleAccountDetails}>
                            {accountStatus.map((option) => (
                                <option value={option.value} key={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="userName" className="form-label">Username*</label></div>
                <div className="col-4"><input id="userName" name="userName" type="text" className="form-control" value={currValues.userName} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="password" className="form-label" >Password*</label></div>
                <div className="col-4"><input id="password" name="password" type="password" className="form-control" value={currValues.password} onChange={handleAccountDetails}/></div>
            </div>
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="userType" className="form-label" >Role*</label></div>
                <div className="col-4">
                    <select id="userType" name="userType" type="text" className="form-control" value={currValues.userType} onChange={handleAccountDetails}>
                        {roleOptions.map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="col-2 text-end"><label htmlFor="email" className="form-label">Email*</label></div>
                <div className="col-4"><input id="email" name="email" type="email" className="form-control" value={currValues.email} onChange={handleAccountDetails} /></div>
            </div>
            { currValues.userType === "ADMIN" && (
            <>
            <div className = "row mt-3 mb-2">
                <div className="col-2"></div>
                <div className="col-7 text-center"><label className="form-label" >Admin Announcement Messages</label></div>
                <div className="col-2 text-center"><label className="form-label" >Show in Homepage?</label></div>
            </div>
            
            <div className = "row mb-3">
                {currValues.announcementsCreated.map((announce, index) => (
                    <div className="row mb-2" key={index}>
                        <div className="col-2"></div>
                        <div className="col-7"><textarea name="announcementMsg" type="text" className="form-control form-control-sm" value={announce.announcementMsg} onChange={(e) => handleAnnouncements(e, index)} /></div>
                        <div className="col-2 mt-2 text-center"><input name="showInHome" type="checkbox" className="form-check-input" defaultChecked={announce.showInHome && "checked"} onChange={(e) => handleAnnouncements(e, index)} /></div>
                        <div className="col-1 mt-2"><FaTrash onClick={()=> removeAdminAnnouncement(index)} /></div>
                    </div>
                ))}
                <div className="col-2"></div>
                <div className="col-7 text-end"><FaPlusCircle onClick={()=> addAdminAnnouncement()} /></div>
            </div> 
            </>
            )}   
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="sports" className="form-label">Sports of Interest**</label></div>
                <div className="col-4"><MultiSelect options={sportsOptions} value={sportsSelected} onChange={setSportsSelected} className="form-control"/></div>
                <div className="col-2 text-end"><label htmlFor="phoneNumber" className="form-label">Phone Number</label></div>
                <div className="col-4"><input id="phoneNumber" name="phoneNumber" type="text" className="form-control" value={currValues.phoneNumber} onChange={handleAccountDetails} /></div>
            </div>
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="firstName" className="form-label">First Name*</label></div>
                <div className="col-4"><input id="firstName" name="firstName" type="text" className="form-control" value={currValues.firstName} onChange={handleAccountDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="lastName" className="form-label">Last Name*</label></div>
                <div className="col-4"><input id="lastName" name="lastName" type="text" className="form-control" value={currValues.lastName} onChange={handleAccountDetails} /></div>
            </div>
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="country" className="form-label">Country**</label></div>
                <div className="col-4 mb-1">
                    <select id="country" name="country" className="form-control" value={currValues.country} onChange={handleAccountDetails}>
                        {countries.map((country) => (
                            <option value={country.name} key={country.iso3}>{country.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-2 text-end"><label htmlFor="province" className="form-label">Province/State**</label></div>
                <div className="col-4 mb-1">
                    <select id="province" name="province" className="form-control" value={currValues.province} onChange={handleAccountDetails}>
                        {states.map((state) => (
                            <option value={state.name} key={state.name}>{state.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="city" className="form-label">City**</label></div>
                <div className="col-4 mb-1">
                    <select id="city" name="city" className="form-control" value={currValues.city} onChange={handleAccountDetails}>
                        {cities.map((city) => (
                            <option value={city} key={city}>{city}</option>
                        ))}
                    </select>
                </div>
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
                    <div className="row mt-3">
                        <div className="col-2 text-end"><label htmlFor="successfulLoginDetails" className="form-label" >Successful Logins : </label></div>
                        <div className="col-3 text-center"><label htmlFor="sourceIpAddress" className="form-label" >IP Address</label></div>
                        <div className="col-4 text-center"><label htmlFor="timestamp" className="form-label" >Timestamp</label></div>
                    </div>
                    <div className="col mb-1">
                        {currValues.successfulLoginDetails.map((login, index) => (
                            <div className="row" key={index}>
                                <p className = "col-2"></p>
                                <div className="col-3 mb-1"><input name="sourceIPAddress" type="text" className="form-control" value={login.sourceIPAddress} onChange={(e) => handleSuccLoginChange(e, index)} /></div>
                                <div className="col-4 mb-1"><input name="timestamp" type="text" className="form-control" value={login.timestamp} onChange={(e) => handleSuccLoginChange(e, index)} /></div>
                            </div>
                        ))}
                    </div>
                    <div className="row mt-2">
                        <div className="col-2 text-end"><label htmlFor="failedLoginDetails" className="form-label" >Failed Login Details : </label></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="numberOfLoginTries" className="form-label">Number of Failed Login Tries Allowed</label></div>
                        <div className="col-1"><input id="numberOfLoginTries" name="numberOfLoginTries" type="number" min="0" className="form-control" value={currValues.failedLoginDetails.numberOfLoginTries} onChange={handlefailedLoginDetails} /></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="numberOfFailedLogins" className="form-label">Number of Failed Logins</label></div>
                        <div className="col-1"><input id="numberOfFailedLogins" name="numberOfFailedLogins" type="number" min="0" className="form-control" value={currValues.failedLoginDetails.numberOfFailedLogins} onChange={handlefailedLoginDetails} /></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="consecutiveLockedOuts" className="form-label">Consecutive times account was locked-out</label></div>
                        <div className="col-1"><input id="consecutiveLockedOuts" name="consecutiveLockedOuts" type="number" min="0" className="form-control" value={currValues.failedLoginDetails.consecutiveLockedOuts} onChange={handlefailedLoginDetails} /></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="lockedOutTimestamp" className="form-label">Timestamp Account is Locked out</label></div>
                        <div className="col-4"><input id="lockedOutTimestamp" name="lockedOutTimestamp" type="text" className="form-control" value={currValues.failedLoginDetails.lockedOutTimestamp} onChange={handlefailedLoginDetails} /></div>
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
                                <div className="col-3 mb-1"><input name="sourceIpAddress" type="text" className="form-control" value={login.sourceIpAddress} onChange={(e) => handleFailedLoginChange(e, index)} /></div>
                                <div className="col-4 mb-1"><input name="timestamp" type="text" className="form-control" value={login.timestamp} onChange={(e) => handleFailedLoginChange(e, index)} /></div>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        <div className="col-2 text-end"><label htmlFor="detailsOTP" className="form-label" >OTP Details : </label></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="detailsOTP" className="form-label">One Time Password</label></div>
                        <div className="col-2"><input id="detailsOTP" name="OTP" type="number" min="0" className="form-control" value={currValues.detailsOTP.OTP} onChange={handleOTPChange} /></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4 text-end"><label htmlFor="expiryTimeOTP" className="form-label">OTP Expiry Timestamp</label></div>
                        <div className="col-4"><input id="expiryTimeOTP" name="expiryTimeOTP" type="text" className="form-control" value={currValues.detailsOTP.expiryTimeOTP} onChange={handleOTPChange} /></div>
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
                < div className="col-3 mb-3 text-center">
                    <label htmlFor="upload" className="form-label ">Profile Picture</label>
                        {selectedImage && (
                            <div>
                                <img src={imageURL} alt="profile picture" className="rounded mw-100 mb-2 border border-secondary" style={{ width: "100rem", height: "13rem"}} />
                                <button onClick={() => setSelectedImage(null)} className="btn btn-secondary mb-3 mx-1 btn-sm" >Remove</button>
                                <button type="button" className="btn btn-secondary mb-3 btn-sm" onClick={() => inputFile.current.click()}>Replace</button>
                            </div>
                        ) }
                        {!selectedImage && (
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="rounded mw-100 mb-3 border border-secondary" style={{ width: "100rem", height: "13rem"}} viewBox="0 0 16 16">
                                    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                </svg>
                                <button type="button" className="btn btn-secondary mb-3 btn-sm" onClick={() => inputFile.current.click()}>Upload</button>
                            </div> 
                        )}
                    <input type="file" id="upload" name="upload" className="d-none" onChange={handlePhotoChange} accept="image/*" ref={inputFile}/>
                </div>
            </div>

            <div className="row justify-content-center">
                <button className="btn btn-dark col-2 mx-5" type="button" onClick={navigateCreateUpdate}>
                    {action.button1}
                </button>
                <button type="button" className="btn btn-outline-secondary col-2" onClick={navigateCancel}>
                    Cancel
                </button>
            </div>

        </form>
      </Card>
              )
      )}
    </div>
  );
};

export default AdminUserMnt;
