import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/auth";
import { FaSearchPlus } from 'react-icons/fa';

const AdminNotifMnt = () => {
  
    const {isSignedIn, isAdmin} = useAuth()
    const [action, handleAction] = useState("");
    const [currValues, setCurrentValues] = useState({
        readStatus: false, receiver: "", receiverId: null, notifType: null, notifLabel: "",
        senderUsername: "", senderUserId: null, senderTeamName: "", senderTeamId: null, senderLeagueName: "", senderLeagueId: null,
        actionRequestId: null, actionDone: "", actionTmst: null, contactUsDetails: null, disableAction: false
    })
    const notifTypeOptions = [ 
        {label: "Match details update is rejected", value: "id1", actionType: "INFO"},
        {label: "Match details update is approved", value: "id2", actionType: "INFO"},
        {label: "Invite to join team was accepted", value: "id3", actionType: "INFO"},
        {label: "Invite to join team was rejected", value: "id4", actionType: "INFO"},
        {label: "Request to join team was accepted", value: "id5", actionType: "INFO"},
        {label: "Request to join team was rejected", value: "id6", actionType: "INFO"},
        {label: "Invite to join league was accepted", value: "id7", actionType: "INFO"}, 
        {label: "Invite to join league was rejected", value: "id8", actionType: "INFO"}, 
        {label: "Request to join league was accepted", value: "id9", actionType: "INFO"}, 
        {label: "Request to join league was rejected", value: "id10", actionType: "INFO"}, 
        {label: "A team joined the league", value: "id11", actionType: "INFO"}, 
        {label: "A team left the league", value: "id12", actionType: "INFO"}, 
        {label: "A team has been removed from the league", value: "id13", actionType: "INFO"}, 
        {label: "A player left the team", value: "id14", actionType: "INFO"}, 
        {label: "Player was removed from the team", value: "id15", actionType: "INFO"}, 
        {label: "League has started", value: "id16", actionType: "INFO"}, 
        {label: "League has ended", value: "id17", actionType: "INFO"}, 
        {label: "Contact us", value: "id18", actionType: "INFO"}, 
        {label: "Approval request for match details update", value: "id19", actionType: "APRVREJ"},
        {label: "Approval request from team admin to player to join team", value: "id20", actionType: "APRVREJ"},
        {label: "Approval request from player to team admin to join team", value: "id21", actionType: "APRVREJ"},
        {label: "Approval request from league admin to team to join league", value: "id22", actionType: "APRVREJ"},
        {label: "Approval request from team admin to league admins to join league", value: "id23", actionType: "APRVREJ"},
        {label: "Approval request from league admin to remove another team from the league", value: "id24", actionType: "APRV"},
        {label: "Approval request to start league", value: "id25", actionType: "APRV"}, 
      ]

    const actionOptions = [ {label: "", value: "PEND"}, {label: "Approved", value: "APRV"}, {label: "Rejected", value: "RJCT"} ]

    useEffect(() => {
        const url = window.location.pathname
        if (url === "/adminnotifcreation") {
            handleAction({type: "Creation", title: "CREATE NOTIFICATION", button1: "Create Notification"})
        } else {
            handleAction({type: "Update", title: "UPDATE NOTIFICATION", button1: "Update"})
            setCurrentValues({ readStatus: true, receiver: "sMcdowell", receiverId: "712d3815252cbe610b0970d1", notifType: "id19", actionType: notifTypeOptions[18].actionType,
            actionRequestId: "648d3815252cbqweqw0970d9", actionDone: "APRV", actionTmst: "2023-07-07T14:03:16.292+00:00", disableAction: false, notifDetails: "",
            senderUsername: "jPeter", senderUserId: "712d3815252cbe610b0970d1", senderTeamName: "Dodgers", senderTeamId: "814d3815252cbe610b0970d1", senderLeagueName: "North York League 2023", senderLeagueId: "916d3815252cbe610b0970d1"
        })
        }
    }, []);

    const handleNotifDetails = (e) => {
      const field = e.target.name
      setCurrentValues({ ...currValues, [field] : e.target.value })
    }

    const handleNotifType = (e) => {
        let index = notifTypeOptions.findIndex(notif => notif.value === e.target.value)
        if (notifTypeOptions[index].actionType === "INFO") {
            setCurrentValues({ ...currValues, notifType : e.target.value, actionType: notifTypeOptions[index].actionType,
                actionRequestId: null, actionDone: "", actionTmst: null, disableAction: true })
        } else {
            setCurrentValues({ ...currValues, notifType : e.target.value, actionType: notifTypeOptions[index].actionType, 
                disableAction: false })
        }
    }

    const handleSearchUser = (username, fieldName) => {
        if (username !== "") {
            const rand = Math.floor(Math.random() * 10);
            if (rand >= 5 ) {    // find username first if valid
                const randomId = "xn2n3824823jx3238o23s8374i8j"
                setCurrentValues({ ...currValues, [fieldName] : randomId })
            } else {
                setCurrentValues({ ...currValues, [fieldName] : "" })
                alert("USERNAME NOT FOUND!")
            }
        }
    }

    const handleSearchTeam = (teamName) => {
        if (teamName !== "") {
            const rand = Math.floor(Math.random() * 10);
            if (rand >= 5 ) {    
                const randomId = "i34u2u2onc3o24u28on424uon3"
                setCurrentValues({ ...currValues, senderTeamId : randomId })
            } else {
                setCurrentValues({ ...currValues, senderTeamId : "" })
                alert("TEAM NOT FOUND!")
            }
        }
    }

    const handleSearchLeague = (leagueName) => {
        if (leagueName !== "") {
            const rand = Math.floor(Math.random() * 10);
            if (rand >= 5 ) {    
                const randomId = "ci4lm3i4c2lo4242iu42n4uc24v24"
                setCurrentValues({ ...currValues, senderLeagueId : randomId })
            } else {
                setCurrentValues({ ...currValues, senderLeagueId : "" })
                alert("LEAGUE NOT FOUND!")
            }
        }
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

            <div className = "row mb-2">
                <div className="col-3 text-end"><label htmlFor="receiver" className="form-label">Receiver's Username*</label></div>
                <div className="col-3"><input name="receiver" type="text" className="form-control" defaultValue={currValues.receiver} onChange={handleNotifDetails} /></div>
                <div className="col-1"><FaSearchPlus className="m-auto" onClick={()=> handleSearchUser(currValues.receiver, "receiverId")} /></div>
                <div className="col-2 text-end"><label htmlFor="receiverId" className="form-label" >Receiver's User Id</label></div>
                <div className="col-3">
                    <a href={`/adminuserupdate/${currValues.receiverId}`} target="_blank" rel="noreferrer" name="receiverId">{currValues.receiverId}</a>
                </div>
            </div>
            <div className="row mb-2" >
                <div className="col-3 text-end"><label htmlFor="readStatus" className="form-label">Read status</label></div>
                <div className="col-1"><input name="readStatus" type="checkbox" className="form-check-input" defaultChecked={currValues.readStatus && "checked"} onChange={handleNotifDetails} /></div>
            </div>
            <div className = "row mb-2">
                <div className="col-3 text-end"><label htmlFor="notifType" className="form-label" >Notification Type*</label></div>
                <div className="col-7">
                    <select name="notifType" type="text" className="form-control" value={currValues.notifType} onChange={handleNotifType}>
                        {notifTypeOptions.map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3 text-end"><label htmlFor="notifDetails" className="form-label" >Notification Details</label></div>
                <div className="col-9"><textarea name="notifDetails" className="form-control form-control-sm" defaultValue={currValues.notifDetails} onChange={handleNotifDetails}/></div>
            </div>
            <div className="row mt-5">
                <div className="col-4 text-end"><p>FOR APPROVAL OR REJECT NOTIFICATIONS :</p></div>
            </div>
            <div className = "row mb-2">
                <div className="col-3 text-end"><label htmlFor="actionRequestId" className="form-label">Request Id</label></div>
                <div className="col-4"><input name="actionRequestId" type="text" className="form-control" defaultValue={currValues.actionRequestId} onChange={handleNotifDetails} disabled={currValues.disableAction}/></div>
                <div className="col-4">
                    <a href={`/adminrequestupdate/${currValues.actionRequestId}`} target="_blank" rel="noreferrer" name="actionRequestId">{currValues.actionRequestId}</a>
                </div>
            </div>
            <div className = "row mb-2">
                <div className="col-3 text-end"><label htmlFor="actionDone" className="form-label" >Action done</label></div>
                <div className="col-2">
                    <select name="actionDone" type="text" className="form-control" value={currValues.actionDone} onChange={handleNotifDetails}  disabled={currValues.disableAction}>
                        {actionOptions.map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className = "row mb-2">
                <div className="col-3 text-end"><label htmlFor="actionTmst" className="form-label">Action Timestamp</label></div>
                <div className="col-4"><input name="actionTmst" type="text" className="form-control" defaultValue={currValues.actionTmst} onChange={handleNotifDetails}  disabled={currValues.disableAction}/></div>
            </div>
            <div className="row mt-5">
                <div className="col-3 text-end"><p>SENDER :</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-3 text-end"><label htmlFor="senderUsername" className="form-label">User</label></div>
                <div className="col-3"><input name="senderUsername" type="text" className="form-control" defaultValue={currValues.senderUsername} onChange={handleNotifDetails} placeholder="Search by username" /></div>
                <div className="col-1"><FaSearchPlus className="m-auto" onClick={()=> handleSearchUser(currValues.senderUsername, "senderUserId")} /></div>
                <div className="col-3">
                    <a href={`/adminuserupdate/${currValues.senderUserId}`} target="_blank" rel="noreferrer" name="senderUserId">{currValues.senderUserId}</a>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-3 text-end"><label htmlFor="senderTeamName" className="form-label">Team</label></div>
                <div className="col-3"><input name="senderTeamName" type="text" className="form-control" defaultValue={currValues.senderTeamName} onChange={handleNotifDetails} placeholder="Search by team name" /></div>
                <div className="col-1"><FaSearchPlus className="m-auto" onClick={()=> handleSearchTeam(currValues.senderTeamName)} /></div>
                <div className="col-3">
                    <a href={`/adminuserupdate/${currValues.senderTeamId}`} target="_blank" rel="noreferrer" name="senderTeamId">{currValues.senderTeamId}</a>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-3 text-end"><label htmlFor="senderLeagueName" className="form-label">League</label></div>
                <div className="col-3"><input name="senderLeagueName" type="text" className="form-control" defaultValue={currValues.senderLeagueName} onChange={handleNotifDetails} placeholder="Search by league name" /></div>
                <div className="col-1"><FaSearchPlus className="m-auto" onClick={()=> handleSearchLeague(currValues.senderLeagueName)} /></div>
                <div className="col-3">
                    <a href={`/adminuserupdate/${currValues.senderLeagueId}`} target="_blank" rel="noreferrer" name="senderLeagueId">{currValues.senderLeagueId}</a>
                </div>
            </div>
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

export default AdminNotifMnt;
