import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/auth";
import { FaSearchPlus } from 'react-icons/fa';

const AdminParmMnt = () => {
  
    const {isSignedIn, isAdmin} = useAuth()
    const [action, handleAction] = useState("");
    const [currValues, setCurrentValues] = useState({parameterId: "sport"})
    const canBeAddedParms = ["sport", "statistic", "position", "notification_type" ]
    const sportsOptions = [ {label: "Soccer", value: "648ba153251b78d7946df311"}, {label: "Basketball", value: "648ba153251b78d7946df322"} ]
    const notifType = [ {label: "Informational notification only", value: "INFO"}, {label: "For approval only", value: "APRV"}, {label: "For approval or reject", value: "APRVREJ"} ]

    useEffect(() => {
        const url = window.location.pathname
        if (url === "/adminparmcreation") {
            handleAction({type: "Creation", title: "CREATE PARAMETER", button1: "Create Parameter", disableUpdate: false })
        } else {
            handleAction({type: "Update", title: "UPDATE PARAMETER", button1: "Update", disableUpdate: true })
            //setCurrentValues({parameterId: "sport", sportsTypeId: "SOCCER", sportsName: "Soccer"})
            //setCurrentValues({parameterId: "statistic", statisticsId: "SC01", statShortDesc: "Goals", statLongDesc: "Goals", sportsType: "648ba153251b78d7946df311"})
            //setCurrentValues({parameterId: "position", positionId: "SCP01", positionDesc: "Team Captain", sportsType: "648ba153251b78d7946df311"})
            //setCurrentValues({parameterId: "notification_type", notifId: "APMDU", notifDesc: "Approval request for match details update", infoOrApproval: "APRVREJ", 
            //    message: "&teamName has updated score for &teamName1 vs &teamName2 <a href='/match/${matchId}'>match</a>:\\nFinal score : &score1 - &score2\\nLeague points : &points1 - &points2"})
            setCurrentValues({parameterId: "login", numberOfLoginDtlsToKeep: 10, defaultLoginTries: 5, maxAdditionalLoginTries: 5, lockedAccountTiming: 30, 
                otpExpiry: 3, minPasswordLength: 8, capitalLetterIsRequired: true, capitalLettersList: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", specialCharacterIsRequired: true, 
                specialCharsList: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~", numberIsRequired: true, numbersList: "0123456789"})
            // setCurrentValues({parameterId: "dfltAnnouncement", defaultMsgTeamAncmt: "&teamName is looking for members. Visit their page to find out more!",
            //     defaultMsgLeagueAncmt: "&leagueName is looking for more teams to join. Visit their page to find out more!"})
            //setCurrentValues({parameterId: "maxParms", maxActiveLeaguesCreated: 3, startLeagueApprovalExp: 7, notifHousekeeping: 30})
        }
    }, []);

    const handleParameterDetails = (e) => {
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
                        <input name="parameterId" type="text" className="form-control" defaultValue={currValues.parameterId} disabled={true} />
                    ) }
                </div>
            </div>    
            
            { currValues.parameterId === "sport" && (
                <div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="sportsTypeId" className="form-label">Sports Type Id*</label></div>
                        <div className="col-4"><input id="sportsTypeId" name="sportsTypeId" type="text" className="form-control" defaultValue={currValues.sportsTypeId} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="sportsName" className="form-label">Sports Name*</label></div>
                        <div className="col-4"><input id="sportsName" name="sportsName" type="text" className="form-control" defaultValue={currValues.sportsName} onChange={handleParameterDetails} /></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "statistic" && (
                <div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="sportsType" className="form-label" >Sports Type*</label></div>
                        <div className="col-2">
                            <select name="sportsType" type="text" className="form-control" value={currValues.sportsType} onChange={handleParameterDetails} disabled={action.disableUpdate}>
                                {sportsOptions.map((option) => (
                                    <option value={option.value} key={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="statisticsId" className="form-label">Statistics Id*</label></div>
                        <div className="col-4"><input id="statisticsId" name="statisticsId" type="text" className="form-control" defaultValue={currValues.statisticsId} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="statShortDesc" className="form-label">Statistic Short Description*</label></div>
                        <div className="col-4"><input id="statShortDesc" name="statShortDesc" type="text" className="form-control" defaultValue={currValues.statShortDesc} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="statLongDesc" className="form-label">Statistic Long Description*</label></div>
                        <div className="col-4"><input id="statLongDesc" name="statLongDesc" type="text" className="form-control" defaultValue={currValues.statLongDesc} onChange={handleParameterDetails} /></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "position" && (
                <div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="sportsType" className="form-label" >Sports Type*</label></div>
                        <div className="col-2">
                            <select id="sportsType" name="sportsType" type="text" className="form-control" value={currValues.sportsType} onChange={handleParameterDetails} disabled={action.disableUpdate}>
                                {sportsOptions.map((option) => (
                                    <option value={option.value} key={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="positionId" className="form-label">Position Id*</label></div>
                        <div className="col-4"><input id="positionId" name="positionId" type="text" className="form-control" defaultValue={currValues.positionId} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="positionDesc" className="form-label">Position Description*</label></div>
                        <div className="col-4"><input id="positionDesc" name="positionDesc" type="text" className="form-control" defaultValue={currValues.positionDesc} onChange={handleParameterDetails} /></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "notification_type" && (
                <div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="notifId" className="form-label">Notification Id*</label></div>
                        <div className="col-4"><input id="notifId" name="notifId" type="text" className="form-control" defaultValue={currValues.notifId} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="notifDesc" className="form-label">Notification Description*</label></div>
                        <div className="col-8"><input id="notifDesc" name="notifDesc" type="text" className="form-control" defaultValue={currValues.notifDesc} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="infoOrApproval" className="form-label" >Notification Type*</label></div>
                        <div className="col-4">
                            <select id="infoOrApproval" name="infoOrApproval" type="text" className="form-control" value={currValues.infoOrApproval} onChange={handleParameterDetails}>
                                {notifType.map((option) => (
                                    <option value={option.value} key={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-3 text-end"><label htmlFor="message" className="form-label" >Notification Message</label></div>
                        <div className="col-9"><textarea id="message" name="message" className="form-control form-control-sm" defaultValue={currValues.message} onChange={handleParameterDetails}/></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "login" && (
                <div>
                    <div className = "row mb-3">
                        <div className="col-6 text-end"><label htmlFor="numberOfLoginDtlsToKeep" className="form-label">Number of Successful Login Details to Keep*</label></div>
                        <div className="col-1"><input id="numberOfLoginDtlsToKeep" name="numberOfLoginDtlsToKeep" type="number" min="1" className="form-control" defaultValue={currValues.numberOfLoginDtlsToKeep} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-6 text-end"><label htmlFor="defaultLoginTries" className="form-label">Default Minimum Login Tries Allowed*</label></div>
                        <div className="col-1"><input id="defaultLoginTries" name="defaultLoginTries" type="number" min="1" className="form-control" defaultValue={currValues.defaultLoginTries} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-6 text-end"><label htmlFor="maxAdditionalLoginTries" className="form-label">Maximum Additional Login Tries (on top of default minimum)*</label></div>
                        <div className="col-1"><input id="maxAdditionalLoginTries" name="maxAdditionalLoginTries" type="number" min="0" className="form-control" defaultValue={currValues.maxAdditionalLoginTries} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-6 text-end"><label htmlFor="lockedAccountTiming" className="form-label">Number of Minutes Account may be Locked*</label></div>
                        <div className="col-1"><input id="lockedAccountTiming" name="lockedAccountTiming" type="number" min="1" className="form-control" defaultValue={currValues.lockedAccountTiming} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-6 text-end"><label htmlFor="otpExpiry" className="form-label">Number of Minutes OTP may be valid*</label></div>
                        <div className="col-1"><input id="otpExpiry" name="otpExpiry" type="number" min="1" className="form-control" defaultValue={currValues.otpExpiry} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3 mt-5">
                        <div className="text-center fw-bold"><p>PASSWORD CRITERIA</p></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="minPasswordLength" className="form-label">Minimum length of password*</label></div>
                        <div className="col-1"><input id="minPasswordLength" name="minPasswordLength" type="number" min="1" className="form-control" defaultValue={currValues.minPasswordLength} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="capitalLetterIsRequired" className="form-label">Capital Letter is Required</label></div>
                        <div className="col-1"><input id="capitalLetterIsRequired" name="capitalLetterIsRequired" type="checkbox" className="form-check-input" defaultChecked={currValues.capitalLetterIsRequired && "checked"} onChange={handleParameterDetails} /></div>
                        <div className="col-3 text-end"><label htmlFor="capitalLettersList" className="form-label">List of Capital Letters*</label></div>
                        <div className="col-5"><input id="capitalLettersList" name="capitalLettersList" type="text" className="form-control" defaultValue={currValues.capitalLettersList} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="specialCharacterIsRequired" className="form-label">Special Character is Required</label></div>
                        <div className="col-1"><input id="specialCharacterIsRequired" name="specialCharacterIsRequired" type="checkbox" className="form-check-input" defaultChecked={currValues.specialCharacterIsRequired && "checked"} onChange={handleParameterDetails} /></div>
                        <div className="col-3 text-end"><label htmlFor="specialCharsList" className="form-label">List of Special Characters*</label></div>
                        <div className="col-5"><input id="specialCharsList" name="specialCharsList" type="text" className="form-control" defaultValue={currValues.specialCharsList} onChange={handleParameterDetails} /></div>
                    </div>
                    <div className = "row mb-3">
                        <div className="col-3 text-end"><label htmlFor="numberIsRequired" className="form-label">Number is Required</label></div>
                        <div className="col-1"><input id="numberIsRequired" name="numberIsRequired" type="checkbox" className="form-check-input" defaultChecked={currValues.numberIsRequired && "checked"} onChange={handleParameterDetails} /></div>
                        <div className="col-3 text-end"><label htmlFor="numbersList" className="form-label">List of Numbers*</label></div>
                        <div className="col-5"><input id="numbersList" name="numbersList" type="text" className="form-control" defaultValue={currValues.numbersList} onChange={handleParameterDetails} /></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "dfltAnnouncement" && (
                <div>
                    <div className="row mb-3">
                        <div className="col-3 text-end"><label htmlFor="defaultMsgTeamAncmt" className="form-label" >Default Team Annoucement</label></div>
                        <div className="col-9"><textarea id="defaultMsgTeamAncmt" name="defaultMsgTeamAncmt" className="form-control form-control-sm" defaultValue={currValues.defaultMsgTeamAncmt} onChange={handleParameterDetails}/></div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-3 text-end"><label htmlFor="defaultMsgLeagueAncmt" className="form-label" >Default League Annoucement</label></div>
                        <div className="col-9"><textarea id="defaultMsgLeagueAncmt" name="defaultMsgLeagueAncmt" className="form-control form-control-sm" defaultValue={currValues.defaultMsgLeagueAncmt} onChange={handleParameterDetails}/></div>
                    </div>
                </div>
            ) }

            { currValues.parameterId === "maxParms" && (
                <div>
                    <div className="row mb-3">
                        <div className="col-6 text-end"><label htmlFor="maxActiveLeaguesCreated" className="form-label" >Maximum Number of Active Leagues Allowed Per User</label></div>
                        <div className="col-1"><input id="maxActiveLeaguesCreated" name="maxActiveLeaguesCreated" type="number" min="1" className="form-control" defaultValue={currValues.maxActiveLeaguesCreated} onChange={handleParameterDetails}/></div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6 text-end"><label htmlFor="startLeagueApprovalExp" className="form-label" >Expiry of Start League Request (in 24hr days)</label></div>
                        <div className="col-1"><input id="startLeagueApprovalExp" name="startLeagueApprovalExp" type="number" min="1" className="form-control" defaultValue={currValues.startLeagueApprovalExp} onChange={handleParameterDetails}/></div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6 text-end"><label htmlFor="notifHousekeeping" className="form-label" >Number of Days Notifications are Stored</label></div>
                        <div className="col-1"><input id="notifHousekeeping" name="notifHousekeeping" type="number" min="1" className="form-control" defaultValue={currValues.notifHousekeeping} onChange={handleParameterDetails}/></div>
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
      )}
    </div>
  );
};

export default AdminParmMnt;
