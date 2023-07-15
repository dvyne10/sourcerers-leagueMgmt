import { useState, useEffect, useRef }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/auth";
import { FaSearchPlus } from 'react-icons/fa';

const AdminLeagueMnt = () => {
  
    const {isSignedIn, isAdmin} = useAuth()
    const inputFileBanner = useRef(null);
    const inputFileLogo = useRef(null);
    const [action, handleAction] = useState("");
    const [currValues, setCurrentValues] = useState({leagueName: null, sport: null, location: null, division: null, description: null, matches: [] })
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [logoURL, setLogoURL] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [bannerURL, setBannerURL] = useState(null);
    const sportsOptions = [ {label: "Soccer", value: "soccerId"}, {label: "Basketball", value: "basketId"} ]
    const statusOptions = [ {label: "Hasn't started", value: "NS"}, {label: "Has started", value: "ST"}, {label: "Has ended", value: "EN"} ]
    
    useEffect(() => {
        const url = window.location.pathname
        if (url === "/adminleaguecreation") {
            handleAction({type: "Creation", title: "CREATE LEAGUE", button1: "Create League"})
        } else {
            handleAction({type: "Update", title: "UPDATE LEAGUE", button1: "Update"})
            setCurrentValues({leagueName: "York Soccer League 2023", sport: "soccerId", location: "North York, Ontario, CA", division: "mixed", description: "North York Soccer League 2023 - Mixed Division",
                status: "ST", ageGroup: "18-25", numberOfTeams: "15", numberOfRounds: "2", startDate: "2023-07-08", endDate: "2023-07-31", 
                teams: [
                    { teamId: "648e224f91a1a82229a6c11f", approvedBy: "648e0a6ff1915e7c19e2303a", joinedTimestamp: "2023-06-17T05:03:16.292+00:00" },
                    { teamId: "648e24201b1bedfb32de974c", approvedBy: "648e0a6ff1915e7c19e2303a", joinedTimestamp: "2023-06-17T05:03:16.331+00:00" },
                    { teamId: "648e6ddb2b6cc0ba74f41d32", approvedBy: "648e0a6ff1915e7c19e2303a", joinedTimestamp: "2023-06-17T05:03:16.366+00:00" },
                    { teamId: "648e7042be708eef6f20f756", approvedBy: "648e0a6ff1915e7c19e2303a", joinedTimestamp: "2023-06-17T05:03:16.401+00:00" },
                    { teamId: "648e7195202d60616b612716", approvedBy: "648e0a6ff1915e7c19e2303a", joinedTimestamp: "2023-06-17T05:03:16.436+00:00" },
                ],
                lookingForTeams: true, lookingForTeamsChgBy: "648e132ff3d2cb1d615fbd9d", lookingForTeamsChgTmst: "2023-06-17T09:40:04.233+00:00", addTeam: "",
                matches: [ "648e9014466c1c99574590b1", "648e9014466c1c99574590b5", "648e9014466c1c99574590b9", "648e9014466c1c99574590bd", "648e9014466c1c99574590c1" ],
                createdBy: "648e0a6ff1915e7c19e2303a", createdAt: "2023-06-15T23:40:04.236+00:00", updatedAt: "2023-06-15T23:40:04.875+00:00", newCreator: "", newCreatorId: ""
            })
            setLogoURL("https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80")
            setSelectedLogo("x")
            setBannerURL("https://plus.unsplash.com/premium_photo-1685055940239-21af8b3b0443?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80")
            setSelectedBanner("x")
        }
    }, []);

    const handleLogoChange = event => {
        if (event.target.files.length > 0) {
            setSelectedLogo(event.target.files[0])
            setLogoURL(URL.createObjectURL(event.target.files[0]))
        }
    };

    const handleBannerChange = event => {
        if (event.target.files.length > 0) {
            setSelectedBanner(event.target.files[0])
            setBannerURL(URL.createObjectURL(event.target.files[0]))
        }
    };

    const handleLeagueDetails = (e) => {
        const field = e.target.name
        setCurrentValues({ ...currValues, [field] : e.target.value })
    }

    const handleRemoveTeam = (index) => {
        let newList = [...currValues.teams]
        if (confirm(`Remove ${newList[index].teamId} from the league?\nPlease click on OK if you wish to proceed.`)) {
            newList.splice(index, 1)
            setCurrentValues({ ...currValues, teams : newList })
        } else {
            console.log("Removal cancelled")
        } 
    }

    const handleSearchTeam = (teamId) => {
        if (teamId !== "") {
            const randomId = "83xj2udjm4fu3x2om3r342x"
            const adminId =  "83xux2u8j3xo2239ou84uj4"
            let date = new Date()
            date.setDate(date.getDate())
            let newList = [...currValues.teams]
            newList.push({ teamId: randomId, approvedBy: adminId, joinedTimestamp: "2023-07-07T14:03:16.292+00:00" })
            setCurrentValues({ ...currValues, teams : newList, addTeam : "" })
        }
    }

    const handleSearchUser = (username) => {
        if (username !== "") {
            const rand = Math.floor(Math.random() * 10);
            if (rand >= 5 ) {    // find username first if valid
                const randomId = "xn2n3824823jx3238o23s8374i8j"
                setCurrentValues({ ...currValues, newCreatorId : randomId })
            } else {
                setCurrentValues({ ...currValues, newCreatorId : "" })
                alert("USERNAME NOT FOUND!")
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
        <form action="" encType="multipart/form-data">

            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="leagueName" className="form-label">League Name*</label></div>
                <div className="col-4"><input id="leagueName" name="leagueName" type="text" className="form-control" value={currValues.leagueName} onChange={handleLeagueDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="sport" className="form-label" >Sport*</label></div>
                <div className="col-2">
                    <select id="sport" name="sport" className="form-control" value={currValues.sport} onChange={handleLeagueDetails} >
                        {sportsOptions.map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div> 
            <div className="row mb-2">
                <div className="col-2 text-end"><label htmlFor="description" className="form-label" >Description</label></div>
                <div className="col-10"><textarea id="description" name="description" className="form-control form-control-sm" value={currValues.description} onChange={handleLeagueDetails}/></div>
            </div>
            <div className="row mb-2">
                <div className="col-2 text-end"><label htmlFor="location" className="form-label" >League Location*</label></div>
                <div className="col-4"><input id="location" name="location" type="text" className="form-control" value={currValues.location} onChange={handleLeagueDetails}/></div>
                <div className="col-2 text-end"><label htmlFor="division" className="form-label" >Division</label></div>
                <div className="col-4"><input id="division" name="division" type="text" className="form-control" value={currValues.division} onChange={handleLeagueDetails}/></div>
            </div>
            <div className="row mb-2">
                <div className="col-2 text-end"><label htmlFor="startDate" className="form-label">Start Date*</label></div>
                <div className="col-2"><input id="startDate" name="startDate" type="date" className="form-control" value={currValues.startDate} onChange={handleLeagueDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="endDate" className="form-label">End Date*</label></div>
                <div className="col-2"><input id="endDate" name="endDate" type="date" className="form-control" value={currValues.endDate} onChange={handleLeagueDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="ageGroup" className="form-label">Age Group*</label></div>
                <div className="col-2"><input id="ageGroup" name="ageGroup" type="text" className="form-control" value={currValues.ageGroup} onChange={handleLeagueDetails} /></div>
            </div>
            <div className="row mb-2">
                <div className="col-2 text-end"><label htmlFor="numberOfTeams" className="form-label">Number of Teams*</label></div>
                <div className="col-2"><input id="numberOfTeams" name="numberOfTeams" type="number" min="3" className="form-control" value={currValues.numberOfTeams} onChange={handleLeagueDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="numberOfRounds" className="form-label">Number of Rounds*</label></div>
                <div className="col-2"><input id="numberOfRounds" name="numberOfRounds" type="number" min="1" className="form-control" value={currValues.numberOfRounds} onChange={handleLeagueDetails} /></div>
            </div>           
            
            <div className="row">

                { action.type !== "Creation" && (
                <>
                    <div className="row mt-2" >
                        <div className="col-2 text-end"><label htmlFor="status" className="form-label" >League Status*</label></div>
                        <div className="col-2">
                            <select id="status" name="status" className="form-control" value={currValues.status} onChange={handleLeagueDetails} >
                                {statusOptions.map((option) => (
                                    <option value={option.value} key={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mt-3" >
                        <div className="col-2 text-end"><label htmlFor="lookingForTeams" className="form-label">Looking For Teams?</label></div>
                        <div className="col-1"><input id="lookingForTeams" name="lookingForTeams" type="checkbox" className="form-check-input" defaultChecked={currValues.lookingForTeams && "checked"} onChange={handleLeagueDetails} /></div>
                        <div className="col-3 text-end"><label htmlFor="lookingForTeamsChgBy" className="form-label">Changed By</label></div>
                        <div className="col-3">
                            <a href={`/adminuserupdate/${currValues.lookingForTeamsChgBy}`} target="_blank" rel="noreferrer" name="createdBy" className="mb-1">{currValues.lookingForTeamsChgBy}</a>
                        </div>
                    </div>
                    <div className="row mt-2" >
                        <div className="col-6 text-end"><label htmlFor="lookingForTeamsChgTmst" className="form-label">Change Timestamp</label></div>
                        <div className="col-4 mb-1"><input id="lookingForTeamsChgTmst" name="lookingForTeamsChgTmst" type="text" className="form-control" value={currValues.lookingForTeamsChgTmst} onChange={handleLeagueDetails} /></div> 
                    </div>
                    <div className="col-2 text-end mt-3"><label htmlFor="matches" className="form-label" >Matches</label></div>
                    <div className="col mt-3">
                        {currValues.matches.map((match) => (
                            <><a href={`/adminmatchupdate/${match}`} target="_blank" rel="noreferrer" name="match" className="col-10 mb-1" key={match}>{match}</a>
                            <div className = "col-2 mb-1"></div></>
                        ))}
                    </div>
                    <p/>
                    <div className="row mt-3">
                        <div className="col-3 text-end"><label htmlFor="createdBy" className="form-label">Created By :</label></div>
                        <div className="col-3">
                            <a href={`/adminuserupdate/${currValues.createdBy}`} target="_blank" rel="noreferrer" name="createdBy" className="col-10 mb-1">{currValues.createdBy}</a>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-3 text-end"><label htmlFor="newCreator" className="form-label">Change League Creator :</label></div>
                        <div className="col-3"><input id="newCreator" name="newCreator" type="text" className="form-control" onChange={handleLeagueDetails} placeholder="Search by username" /></div>
                        <FaSearchPlus className="col-1 mt-2" onClick={()=> handleSearchUser(currValues.newCreator)} />
                        <div className="col-3">
                            <a href={`/adminuserupdate/${currValues.newCreatorId}`} target="_blank" rel="noreferrer" name="newCreatorId">{currValues.newCreatorId}</a>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-3 text-end"><label htmlFor="createdAt" className="form-label">Date of League Creation :</label></div>
                        <div className="col-4"><p className="form-label">{currValues.createdAt}</p></div>
                    </div>
                    <div className="row">
                        <div className="col-3 text-end"><label htmlFor="updatedAt" className="form-label">League Latest Update Date :</label></div>
                        <div className="col-4"><p className="form-label">{currValues.updatedAt}</p></div>
                    </div>
                </>
                ) }

            </div>

            <div className="row justify-content-center mt-3">
                < div className="col-sm-3 mb-3 text-center">
                    <label htmlFor="logo" className="form-label">
                        Select Logo
                    </label>
                    {selectedLogo && (
                        <div>
                            <img src={logoURL} alt="not found" className="rounded mw-100 mb-2 border border-secondary" style={{ width: "100rem", height: "13rem"}}/>
                            <button onClick={() => setSelectedLogo(null)} className="btn btn-secondary mb-3 mx-1 btn-sm" >Remove</button>
                            <button type="button" className="btn btn-secondary mb-3 btn-sm" onClick={() => inputFileLogo.current.click()}>Replace</button>
                        </div>
                    ) }
                    {!selectedLogo && (
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="rounded mw-100 mb-3 border border-secondary" style={{ width: "100rem", height: "13rem"}} viewBox="-12 -12 40 40">
                                <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                                <path d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
                            </svg>
                            <button type="button" className="btn btn-secondary mb-3 btn-sm" onClick={() => inputFileLogo.current.click()}>Upload</button>
                        </div> 
                    )}
                    <input type="file" id="logo" name="logo" className="d-none" onChange={handleLogoChange} accept="image/*" ref={inputFileLogo}/>
                </div>
            </div>
            < div className="col mb-5 text-center">               
                <label htmlFor="banner" className="form-label mb-1">
                    Select Banner
                </label>
                {selectedBanner && (
                    <div>
                        <img src={bannerURL} alt="Team Banner" className="object-fit-cover rounded mw-100 mb-2" style={{ width: "100rem", height: "20rem"}}/>
                        <button onClick={() => setSelectedBanner(null)} className="btn btn-secondary mb-3 mx-1 btn-sm" >Remove</button>
                        <button type="button" className="btn btn-secondary mb-3 btn-sm" onClick={() => inputFileBanner.current.click()}>Replace</button>
                    </div>
                ) }
                {!selectedBanner && (
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="rounded mw-100 mb-3 border border-secondary" style={{ width: "100rem", height: "20rem"}} viewBox="-12 -12 40 40">
                            <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                            <path d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
                        </svg>
                        <button type="button" className="btn btn-secondary mb-3 btn-sm" onClick={() => inputFileBanner.current.click()}>Upload</button>
                    </div> 
                )}
                <div className="row justify-content-center">
                    <div className="col-3">
                        <input type="file" id="banner" name="banner" className="d-none" onChange={handleBannerChange} accept="image/*" ref={inputFileBanner}/>
                    </div>
                </div>
            </div>

        </form>
        { action.type === "Update" && currValues.teams !== null && currValues.teams.length !== 0 && (
            <div>
                <div>
                    <br/><br/>
                    <table className="table table-hover text-center">
                        <thead>
                            <tr>
                                <th>Team Id</th>
                                <th>Approved By</th>
                                <th>Date Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currValues.teams.map((team, index) =>       
                                <tr key={team.teamId}>
                                    <td><a href={`/adminteamupdate/${team.teamId}`} target="_blank" rel="noreferrer" key={team.teamId}>{team.teamId}</a></td>
                                    <td><a href={`/adminuserupdate/${team.approvedBy}`} target="_blank" rel="noreferrer" key={team.approvedBy}>{team.approvedBy}</a></td>
                                    <td>{team.joinedTimestamp}</td>
                                    <td><button className = "btn btn-danger btn-sm" onClick={() => handleRemoveTeam(index)}>Remove</button></td>
                                </tr>) 
                            }
                            <tr>
                                <td>
                                    <input name="addTeam" type="text" value={currValues.addTeam} onChange={handleLeagueDetails} placeholder="Search by team name"/>
                                </td>
                                <td/>
                                <td/>
                                <td><FaSearchPlus className="m-auto" onClick={()=> handleSearchTeam(currValues.addTeam)} /></td>  
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )}
        <div className="row justify-content-center">
                <button className="btn btn-dark col-2 mx-5" type="button" onClick={navigateCreateUpdate}>
                    {action.button1}
                </button>
                <button type="button" className="btn btn-outline-secondary col-2" onClick={navigateCancel}>
                    Cancel
                </button>
            </div>
      </Card>
      )}
    </div>
  );
};

export default AdminLeagueMnt;
