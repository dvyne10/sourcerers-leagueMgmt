import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/auth";
import { FaSearchPlus } from 'react-icons/fa';

const AdminRequestMnt = () => {
  
    const {isSignedIn, isAdmin} = useAuth()
    const [action, handleAction] = useState("");
    const [currValues, setCurrentValues] = useState({
        requestor: "", requestorId: null, reqType: null, reqStatus: "PEND", minAppr: 1, apprCounter: 0, 
        reqExp: null, rcvrUsername: "", rcvrUserId: null, rcvrTeamName: "", rcvrTeamId: null, rcvrLeagueName: "", rcvrLeagueId: null
    })
    const requestTypeOptions = [ 
        {label: "Approval request for match details update", value: "id1"},
        {label: "Approval request from team admin to player to join team", value: "id2"},
        {label: "Approval request from player to team admin to join team", value: "id3"},
        {label: "Approval request from league admin to team to join league", value: "id4"},
        {label: "Approval request from team admin to league admins to join league", value: "id5"},
        {label: "Approval request from league admin to remove another team from the league", value: "id6"},
        {label: "Approval request to start league", value: "id7"}, 
    ]
    const requestStatusOptions = [ {label: "Pending", value: "PEND"}, {label: "Approved", value: "APRV"},
        {label: "Rejected", value: "RJCT"}, {label: "Expired", value: "EXP"}, ]

    useEffect(() => {
        const url = window.location.pathname
        if (url === "/adminrequestcreation") {
            handleAction({type: "Creation", title: "CREATE REQUEST", button1: "Create Request"})
        } else {
            handleAction({type: "Update", title: "UPDATE REQUEST", button1: "Update"})
            setCurrentValues({requestor: "sMcdowell", requestorId: "712d3815252cbe610b0970d1", reqType: "APMDU", reqStatus: "PEND", minAppr: "1", apprCounter: "0", 
            reqExp: "2023-07-07 14:03:16", rcvrUsername: "jPeter", rcvrUserId: "712d3815252cbe610b0970d1", rcvrTeamName: "Dodgers", rcvrTeamId: "814d3815252cbe610b0970d1", rcvrLeagueName: "North York League 2023", rcvrLeagueId: "916d3815252cbe610b0970d1"
            })
        }
    }, []);

    const handleRequestDetails = (e) => {
      const field = e.target.name
      setCurrentValues({ ...currValues, [field] : e.target.value })
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
                setCurrentValues({ ...currValues, rcvrTeamId : randomId })
            } else {
                setCurrentValues({ ...currValues, rcvrTeamId : "" })
                alert("TEAM NOT FOUND!")
            }
        }
    }

    const handleSearchLeague = (leagueName) => {
        if (leagueName !== "") {
            const rand = Math.floor(Math.random() * 10);
            if (rand >= 5 ) {    
                const randomId = "ci4lm3i4c2lo4242iu42n4uc24v24"
                setCurrentValues({ ...currValues, rcvrLeagueId : randomId })
            } else {
                setCurrentValues({ ...currValues, rcvrLeagueId : "" })
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
                <div className="col-3 text-end"><label htmlFor="requestor" className="form-label">Requestor's Username*</label></div>
                <div className="col-3"><input id="requestor" name="requestor" type="text" className="form-control" value={currValues.requestor} onChange={handleRequestDetails} /></div>
                <div className="col-1"><FaSearchPlus className="m-auto" onClick={()=> handleSearchUser(currValues.requestor, "requestorId")} /></div>
                <div className="col-2 text-end"><label htmlFor="requestorId" className="form-label" >Requestor's User Id</label></div>
                <div className="col-3">
                    <a href={`/adminuserupdate/${currValues.requestorId}`} target="_blank" rel="noreferrer" name="requestorId">{currValues.requestorId}</a>
                </div>
            </div>
            <div className = "row mb-2">
                <div className="col-3 text-end"><label htmlFor="reqType" className="form-label" >Request Type*</label></div>
                <div className="col-4">
                    <select id="reqType" name="reqType" type="text" className="form-control" value={currValues.reqType} onChange={handleRequestDetails}>
                        {requestTypeOptions.map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="col-2 text-end"><label htmlFor="reqStatus" className="form-label" >Request Status*</label></div>
                <div className="col-2">
                    <select id="reqStatus" name="reqStatus" type="text" className="form-control" value={currValues.reqStatus} onChange={handleRequestDetails}>
                        {requestStatusOptions.map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className = "row mb-2">
                <div className="col-3 text-end"><label htmlFor="minAppr" className="form-label">Min Number of Approvals</label></div>
                <div className="col-1"><input id="minAppr" name="minAppr" type="number" min="1" className="form-control" value={currValues.minAppr} onChange={handleRequestDetails} /></div>
                <div className="col-5 text-end"><label htmlFor="apprCounter" className="form-label">Approval/s Count</label></div>
                <div className="col-1"><input id="apprCounter" name="apprCounter" type="number" min="0" className="form-control" value={currValues.apprCounter} onChange={handleRequestDetails} /></div>
            </div>
            <div className = "row mb-2">
                <div className="col-3 text-end"><label htmlFor="reqExp" className="form-label">Request Expiry</label></div>
                <div className="col-4"><input id="reqExp" name="reqExp" type="text" className="form-control" value={currValues.reqExp} onChange={handleRequestDetails} /></div>
            </div>
            <div className="row mt-5">
                <div className="col-3 text-end"><p>RECEIVER/S :</p></div>
                </div>
            <div className="row mt-2">
                <div className="col-3 text-end"><label htmlFor="rcvrUsername" className="form-label">User</label></div>
                <div className="col-3"><input id="rcvrUsername" name="rcvrUsername" type="text" className="form-control" value={currValues.rcvrUsername} onChange={handleRequestDetails} placeholder="Search by username" /></div>
                <div className="col-1"><FaSearchPlus className="m-auto" onClick={()=> handleSearchUser(currValues.rcvrUsername, "rcvrUserId")} /></div>
                <div className="col-3">
                    <a href={`/adminuserupdate/${currValues.rcvrUserId}`} target="_blank" rel="noreferrer" name="rcvrUserId">{currValues.rcvrUserId}</a>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-3 text-end"><label htmlFor="rcvrTeamName" className="form-label">Team</label></div>
                <div className="col-3"><input id="rcvrTeamName" name="rcvrTeamName" type="text" className="form-control" value={currValues.rcvrTeamName} onChange={handleRequestDetails} placeholder="Search by team name" /></div>
                <div className="col-1"><FaSearchPlus className="m-auto" onClick={()=> handleSearchTeam(currValues.rcvrTeamName)} /></div>
                <div className="col-3">
                    <a href={`/adminuserupdate/${currValues.rcvrTeamId}`} target="_blank" rel="noreferrer" name="rcvrTeamId">{currValues.rcvrTeamId}</a>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-3 text-end"><label htmlFor="rcvrLeagueName" className="form-label">League</label></div>
                <div className="col-3"><input id="rcvrLeagueName" name="rcvrLeagueName" type="text" className="form-control" value={currValues.rcvrLeagueName} onChange={handleRequestDetails} placeholder="Search by league name" /></div>
                <div className="col-1"><FaSearchPlus className="m-auto" onClick={()=> handleSearchLeague(currValues.rcvrLeagueName)} /></div>
                <div className="col-3">
                    <a href={`/adminuserupdate/${currValues.rcvrLeagueId}`} target="_blank" rel="noreferrer" name="rcvrLeagueId">{currValues.rcvrLeagueId}</a>
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

export default AdminRequestMnt;
