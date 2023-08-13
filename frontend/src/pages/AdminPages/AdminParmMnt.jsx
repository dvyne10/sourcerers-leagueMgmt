import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from "../../hooks/auth";
import { FaSearchPlus } from 'react-icons/fa';
import {checkIfSignedIn, getToken} from "../../hooks/auth";

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";

const AdminParmMnt = () => {
  
    let { isSignedIn, isAdmin } = checkIfSignedIn()
    const token = `Bearer ${getToken()}`
    const [action, handleAction] = useState("");
    const routeParams = useParams();
    const [currValues, setCurrentValues] = useState({parameterId: "sport", sport: {sportsTypeId: "", sportsName: ""}, 
        statistic: {statisticsId: "", statShortDesc: "", statLongDesc: "", sportsType: ""},
        position: {positionId: "", positionDesc: "", sportsType: ""},
        notification_type: {notifId: "", notifDesc: "", infoOrApproval: "", message: ""},
    })
    const canBeAddedParms = ["sport", "statistic", "position", "notification_type" ]
    const [sportsOptions, setSportsOptions] = useState([{ label: "Soccer", value: "648ba153251b78d7946df311" }, { label: "Basketball", value: "648ba153251b78d7946df322" }]);
    const notifType = [ {label: "Informational notification only", value: "INFO"}, {label: "For approval only", value: "APRV"}, {label: "For approval or reject", value: "APRVREJ"} ]
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
        if (url === "/adminparmcreation") {
            handleAction({type: "Creation", title: "CREATE PARAMETER", button1: "Create Parameter", disableUpdate: false })
            setIsLoading(false)
        } else {
            setIsLoading(true)
            handleAction({type: "Update", title: "UPDATE PARAMETER", button1: "Update", disableUpdate: true })
            fetch(`${backend}/admingetparmdetails/${routeParams.parmid}`, {
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
                } else {
                    setCurrentValues({...data.details})
                }
                setIsLoading(false)
            }).catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
        }
    }, []);

    const handleSportChange = (e) => {
        const field = e.target.name
        let newObj = {...currValues.sport, [field] : e.target.value}
        setCurrentValues({parameterId: "sport", sport : newObj })
    }

    const handleStatChange = (e) => {
        const field = e.target.name
        let newObj = {...currValues.statistic, [field] : e.target.value}
        setCurrentValues({parameterId: "statistic", statistic : newObj })
    }

    const handlePosnChange = (e) => {
        const field = e.target.name
        let newObj = {...currValues.position, [field] : e.target.value}
        setCurrentValues({parameterId: "position", position : newObj })
    }

    const handleNotifChange = (e) => {
        const field = e.target.name
        let newObj = {...currValues.notification_type, [field] : e.target.value}
        setCurrentValues({parameterId: "notification_type", notification_type : newObj })
    }

    const handleLoginChange = (e) => {
        const field = e.target.name
        if (field !== "passwordCriteria") {
            let newObj = {...currValues.login, [field] : e.target.value}
            setCurrentValues({ ...currValues, login : newObj })
        } else {
            const innerField = e.target.id
            let newObj = {...currValues.login.passwordCriteria}
            let newValue = e.target.value
            if (innerField === "capitalLetterIsRequired") {
                newValue = !newObj.capitalLetterIsRequired  
            } else if (innerField === "specialCharacterIsRequired") {
                newValue = !newObj.specialCharacterIsRequired
            } else if (innerField === "numberIsRequired") {
                newValue = !newObj.numberIsRequired  
            }
            newObj = {...newObj, [innerField] : newValue}
            setCurrentValues({ ...currValues, login: {...currValues.login, passwordCriteria : newObj} })
        }
    }

    const handleAnnChange = (e) => {
        const field = e.target.name
        let newObj = {...currValues.dfltAnnouncement, [field] : e.target.value}
        setCurrentValues({ ...currValues, dfltAnnouncement : newObj })
    }

    const handleMaxChange = (e) => {
        const field = e.target.name
        let newObj = {...currValues.maxParms, [field] : e.target.value}
        setCurrentValues({ ...currValues, maxParms : newObj })
    }

    const handleParameterDetails = (e) => {
      const field = e.target.name
      setCurrentValues({ ...currValues, [field] : e.target.value })
    }

    const navigate = useNavigate(); 
    const navigateCreateUpdate = () => { 
        let data = {...currValues}
        setIsLoading(true)
        if (action.type === "Creation") {
            fetch(`${backend}/admincreateparm`, {
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
                    navigate('/adminsystemparameters')
                }
                setIsLoading(false)
            }).catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
        } else {
            fetch(`${backend}/adminupdateparm/${routeParams.parmid}`, {
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
                    navigate('/adminsystemparameters')
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
        <form action="">

            <div className = "row mb-5">
                <div className="col-3 text-end"><label htmlFor="parameterId" className="form-label" >Parameter Type*</label></div>
                <div className="col-3">
                    { action.type === 'Creation'&& (
                        <select id="parameterId" name="parameterId" type="text" className="form-control" onChange={handleParameterDetails}>
                            {canBeAddedParms.map((option) => (
                                <option value={option} key={option}>{option}</option>
                            ))}
                        </select>
                    ) }
                    { action.type !== 'Creation'&& (
                        <input name="parameterId" type="text" className="form-control" value={currValues.parameterId} disabled={true} />
                    ) }
                </div>
            </div>    
            
            { currValues.parameterId === "sport" && (
                <div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="sportsTypeId" className="form-label">Sports Type Id*</label></div>
                        <div className="col-4"><input id="sportsTypeId" name="sportsTypeId" type="text" className="form-control" value={currValues.sport.sportsTypeId} onChange={handleSportChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="sportsName" className="form-label">Sports Name*</label></div>
                        <div className="col-4"><input id="sportsName" name="sportsName" type="text" className="form-control" value={currValues.sport.sportsName} onChange={handleSportChange} /></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "statistic" && (
                <div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="sportsType" className="form-label" >Sports Type*</label></div>
                        <div className="col-2">
                            <select name="sportsType" type="text" className="form-control" value={currValues.statistic.sportsType} onChange={handleStatChange} disabled={action.disableUpdate}>
                                {sportsOptions.map((option) => (
                                    <option value={option.value} key={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="statisticsId" className="form-label">Statistics Id*</label></div>
                        <div className="col-4"><input id="statisticsId" name="statisticsId" type="text" className="form-control" value={currValues.statistic.statisticsId} onChange={handleStatChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="statShortDesc" className="form-label">Statistic Short Description*</label></div>
                        <div className="col-4"><input id="statShortDesc" name="statShortDesc" type="text" className="form-control" value={currValues.statistic.statShortDesc} onChange={handleStatChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="statLongDesc" className="form-label">Statistic Long Description*</label></div>
                        <div className="col-4"><input id="statLongDesc" name="statLongDesc" type="text" className="form-control" value={currValues.statistic.statLongDesc} onChange={handleStatChange} /></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "position" && (
                <div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="sportsType" className="form-label" >Sports Type*</label></div>
                        <div className="col-2">
                            <select id="sportsType" name="sportsType" type="text" className="form-control" value={currValues.position.sportsType} onChange={handlePosnChange} disabled={action.disableUpdate}>
                                {sportsOptions.map((option) => (
                                    <option value={option.value} key={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="positionId" className="form-label">Position Id*</label></div>
                        <div className="col-4"><input id="positionId" name="positionId" type="text" className="form-control" value={currValues.position.positionId} onChange={handlePosnChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="positionDesc" className="form-label">Position Description*</label></div>
                        <div className="col-4"><input id="positionDesc" name="positionDesc" type="text" className="form-control" value={currValues.position.positionDesc} onChange={handlePosnChange} /></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "notification_type" && (
                <div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="notifId" className="form-label">Notification Id*</label></div>
                        <div className="col-4"><input id="notifId" name="notifId" type="text" className="form-control" value={currValues.notification_type.notifId} onChange={handleNotifChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="notifDesc" className="form-label">Notification Description*</label></div>
                        <div className="col-8"><input id="notifDesc" name="notifDesc" type="text" className="form-control" value={currValues.notification_type.notifDesc} onChange={handleNotifChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="infoOrApproval" className="form-label" >Notification Type*</label></div>
                        <div className="col-4">
                            <select id="infoOrApproval" name="infoOrApproval" type="text" className="form-control" value={currValues.notification_type.infoOrApproval} onChange={handleNotifChange}>
                                {notifType.map((option) => (
                                    <option value={option.value} key={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-3 text-end"><label htmlFor="message" className="form-label" >Notification Message</label></div>
                        <div className="col-9"><textarea id="message" name="message" className="form-control form-control-sm" value={currValues.notification_type.message} onChange={handleNotifChange}/></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "login" && (
                <div>
                    <div className = "row mb-3">
                        <div className="col-6 text-end"><label htmlFor="numberOfLoginDtlsToKeep" className="form-label">Number of Successful Login Details to Keep*</label></div>
                        <div className="col-1"><input id="numberOfLoginDtlsToKeep" name="numberOfLoginDtlsToKeep" type="number" min="1" className="form-control" value={currValues.login.numberOfLoginDtlsToKeep} onChange={handleLoginChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-6 text-end"><label htmlFor="defaultLoginTries" className="form-label">Default Minimum Login Tries Allowed*</label></div>
                        <div className="col-1"><input id="defaultLoginTries" name="defaultLoginTries" type="number" min="1" className="form-control" value={currValues.login.defaultLoginTries} onChange={handleLoginChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-6 text-end"><label htmlFor="maxAdditionalLoginTries" className="form-label">Maximum Additional Login Tries (on top of default minimum)*</label></div>
                        <div className="col-1"><input id="maxAdditionalLoginTries" name="maxAdditionalLoginTries" type="number" min="0" className="form-control" value={currValues.login.maxAdditionalLoginTries} onChange={handleLoginChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-6 text-end"><label htmlFor="lockedAccountTiming" className="form-label">Number of Minutes Account may be Locked*</label></div>
                        <div className="col-1"><input id="lockedAccountTiming" name="lockedAccountTiming" type="number" min="1" className="form-control" value={currValues.login.lockedAccountTiming} onChange={handleLoginChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-6 text-end"><label htmlFor="otpExpiry" className="form-label">Number of Minutes OTP may be valid*</label></div>
                        <div className="col-1"><input id="otpExpiry" name="otpExpiry" type="number" min="1" className="form-control" value={currValues.login.otpExpiry} onChange={handleLoginChange} /></div>
                    </div>
                    <div className = "row mb-3 mt-5">
                        <div className="text-center fw-bold"><p>PASSWORD CRITERIA</p></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="minPasswordLength" className="form-label">Minimum length of password*</label></div>
                        <div className="col-1"><input id="minPasswordLength" name="minPasswordLength" type="number" min="1" className="form-control" value={currValues.login.minPasswordLength} onChange={handleLoginChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="capitalLetterIsRequired" className="form-label">Capital Letter is Required</label></div>
                        <div className="col-1"><input id="capitalLetterIsRequired" name="passwordCriteria" type="checkbox" className="form-check-input" defaultChecked={currValues.login.passwordCriteria.capitalLetterIsRequired && "checked"} onChange={handleLoginChange} /></div>
                        <div className="col-3 text-end"><label htmlFor="capitalLettersList" className="form-label">List of Capital Letters*</label></div>
                        <div className="col-5"><input id="capitalLettersList" name="passwordCriteria" type="text" className="form-control" value={currValues.login.passwordCriteria.capitalLettersList} onChange={handleLoginChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="specialCharacterIsRequired" className="form-label">Special Character is Required</label></div>
                        <div className="col-1"><input id="specialCharacterIsRequired" name="passwordCriteria" type="checkbox" className="form-check-input" defaultChecked={currValues.login.passwordCriteria.specialCharacterIsRequired && "checked"} onChange={handleLoginChange} /></div>
                        <div className="col-3 text-end"><label htmlFor="specialCharsList" className="form-label">List of Special Characters*</label></div>
                        <div className="col-5"><input id="specialCharsList" name="passwordCriteria" type="text" className="form-control" value={currValues.login.passwordCriteria.specialCharsList} onChange={handleLoginChange} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="numberIsRequired" className="form-label">Number is Required</label></div>
                        <div className="col-1"><input id="numberIsRequired" name="passwordCriteria" type="checkbox" className="form-check-input" defaultChecked={currValues.login.passwordCriteria.numberIsRequired && "checked"} onChange={handleLoginChange} /></div>
                        <div className="col-3 text-end"><label htmlFor="numbersList" className="form-label">List of Numbers*</label></div>
                        <div className="col-5"><input id="numbersList" name="passwordCriteria" type="text" className="form-control" value={currValues.login.passwordCriteria.numbersList} onChange={handleLoginChange} /></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "dfltAnnouncement" && (
                <div>
                    <div className="row mb-3">
                        <div className="col-3 text-end"><label htmlFor="defaultMsgTeamAncmt" className="form-label" >Default Team Announcement</label></div>
                        <div className="col-9"><textarea id="defaultMsgTeamAncmt" name="defaultMsgTeamAncmt" className="form-control form-control-sm" value={currValues.dfltAnnouncement.defaultMsgTeamAncmt} onChange={handleAnnChange}/></div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-3 text-end"><label htmlFor="defaultMsgLeagueAncmt" className="form-label" >Default League Announcement</label></div>
                        <div className="col-9"><textarea id="defaultMsgLeagueAncmt" name="defaultMsgLeagueAncmt" className="form-control form-control-sm" value={currValues.dfltAnnouncement.defaultMsgLeagueAncmt} onChange={handleAnnChange}/></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "maxParms" && (
                <div>
                    <div className="row mb-3">
                        <div className="col-6 text-end"><label htmlFor="maxActiveLeaguesCreated" className="form-label" >Maximum Number of Active Leagues Allowed Per User</label></div>
                        <div className="col-1"><input id="maxActiveLeaguesCreated" name="maxActiveLeaguesCreated" type="number" min="1" className="form-control" value={currValues.maxParms.maxActiveLeaguesCreated} onChange={handleMaxChange}/></div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6 text-end"><label htmlFor="startLeagueApprovalExp" className="form-label" >Expiry of Start League Request (in 24hr days)</label></div>
                        <div className="col-1"><input id="startLeagueApprovalExp" name="startLeagueApprovalExp" type="number" min="1" className="form-control" value={currValues.maxParms.startLeagueApprovalExp} onChange={handleMaxChange}/></div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6 text-end"><label htmlFor="notifHousekeeping" className="form-label" >Number of Days Notifications are Stored</label></div>
                        <div className="col-1"><input id="notifHousekeeping" name="notifHousekeeping" type="number" min="1" className="form-control" value={currValues.maxParms.notifHousekeeping} onChange={handleMaxChange}/></div>
                    </div>
                </div>
            ) }
            
            <div className="row justify-content-center mt-5">
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

export default AdminParmMnt;
