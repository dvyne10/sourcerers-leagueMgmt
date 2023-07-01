import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/auth";
import { FaSearchPlus } from 'react-icons/fa';

const AdminTeamMnt = () => {
  
    const {isSignedIn, isAdmin} = useAuth()
    const [action, handleAction] = useState("");
    const [currValues, setCurrentValues] = useState({teamName: null, sport: null, location: null, division: null, email: null, description: null })
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [logoURL, setLogoURL] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [bannerURL, setBannerURL] = useState(null);
    const sportsOptions = [ {label: "Soccer", value: "soccerId"}, {label: "Basketball", value: "basketId"} ]
    const positionOptions = [ {label: "Team Captain", value: "648ba153251b78d7946df31e"}, {label: "Goalkeeper", value: "648ba153251b78d7946df31f"}, {label: "Defender", value: "648ba153251b78d7946df320"} ]

    useEffect(() => {
        const url = window.location.pathname
        if (url === "/adminteamcreation") {
            handleAction({type: "Creation", title: "CREATE TEAM", button1: "Create Team"})
        } else {
            handleAction({type: "Update", title: "UPDATE TEAM", button1: "Update"})
            setCurrentValues({teamName: "Vikings", sport: "basketId", location: "York, Ontario, CA", division: "mixed", email: "vikingsteam@mail.com", description: "A team of soccer enthusiasts.",
              players: [
                    {playerId: "648d3815252cbe610b0970d9", positionId: "648ba153251b78d7946df31e", jerseyNumber: 15, joinedDate: "2023-06-17T09:40:04.233+00:00"}, 
                    {playerId: "648d3815252cbe610b0970da", positionId: "648ba153251b78d7946df31f", jerseyNumber: 87, joinedDate: "2023-06-18T10:20:03.213+00:00"},
                    {playerId: "648d3815252cbe610b0970db", positionId: "648ba153251b78d7946df320", jerseyNumber: 12, joinedDate: "2023-06-19T11:30:02.231+00:00"},
                    {playerId: "648d3815252cbe610b0970dc", positionId: "648ba153251b78d7946df31f", jerseyNumber: 74, joinedDate: "2023-06-11T12:50:01.133+00:00"},
                    {playerId: "648d3815252cbe610b0970dd", positionId: "648ba153251b78d7946df320", jerseyNumber: 69, joinedDate: "2023-06-12T13:10:00.231+00:00"},
                ],
                lookingForPlayers: true, lookingForPlayersChgTmst: "2023-06-17T09:40:04.233+00:00", addPlayer: "",
                createdBy: "648e132ff3d2cb1d615fbd9d", createdAt: "2023-06-15T23:40:04.236+00:00", updatedAt: "2023-06-15T23:40:04.875+00:00", newCreator: "", newCreatorId: ""
            })
            setLogoURL("https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80")
            setSelectedLogo("x")
            setBannerURL("https://plus.unsplash.com/premium_photo-1685055940239-21af8b3b0443?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80")
            setSelectedBanner("x")
        }
    }, []);

    const handleLogoChange = event => {
        setSelectedLogo(event.target.files[0])
        setLogoURL(URL.createObjectURL(event.target.files[0]))
    };

    const handleBannerChange = event => {
        setSelectedBanner(event.target.files[0])
        setBannerURL(URL.createObjectURL(event.target.files[0]))
    };

    const handlePLayerChange = (event, index) => {
        const field = event.target.name
        let newList = [...currValues.players]
        newList[index][field] = event.target.value
        setCurrentValues({ ...currValues, players : newList })
    }

    const handleTeamDetails = (e) => {
        const field = e.target.name
        setCurrentValues({ ...currValues, [field] : e.target.value })
    }

    const handleRemovePlayer = (index) => {
        let newList = [...currValues.players]
        if (confirm(`Remove ${newList[index].playerId} from the team?\nPlease click on OK if you wish to proceed.`)) {
            newList.splice(index, 1)
            setCurrentValues({ ...currValues, players : newList })
        } else {
            console.log("Removal cancelled")
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

    const handleSearchPlayer = (username) => {
        console.log("handleSearchPlayer")
        if (username !== "") {
            const randomId = "83xj2udjm4fu3x2om3r342x"
            let date = new Date()
            date.setDate(date.getDate())
            let newList = [...currValues.players]
            newList.push({ playerId: randomId, positionId: null, jerseyNumber: null, joinedDate: "2023-07-07T14:03:16.292+00:00" })
            setCurrentValues({ ...currValues, players : newList, addPlayer : "" })
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

            <div className="row">

                <div className="col-2 text-end mb-2"><label htmlFor="teamName" className="form-label">Team Name*</label></div>
                <div className="col-4 mb-2"><input name="teamName" type="text" className="form-control" defaultValue={currValues.teamName} onChange={handleTeamDetails} /></div>
                <div className="col-2 text-end mb-2"><label htmlFor="location" className="form-label" >Team Location*</label></div>
                <div className="col-4 mb-2"><input name="location" type="text" className="form-control" defaultValue={currValues.location} onChange={handleTeamDetails}/></div>
                <div className="col-2 text-end mb-2"><label htmlFor="division" className="form-label" >Division</label></div>
                <div className="col-4 mb-2"><input name="division" type="text" className="form-control" defaultValue={currValues.division} onChange={handleTeamDetails}/></div>
                <div className="col-2 text-end mb-2"><label htmlFor="email" className="form-label">Email*</label></div>
                <div className="col-4 mb-2"><input name="email" type="email" className="form-control" defaultValue={currValues.email} onChange={handleTeamDetails} /></div>
                <div className="col-2 text-end mb-2"><label htmlFor="description" className="form-label" >Description</label></div>
                <div className="col-10 mb-2"><textarea name="description" className="form-control form-control-sm" defaultValue={currValues.description} onChange={handleTeamDetails}/></div>
                <div className="col-2 text-end mb-2"><label htmlFor="sport" className="form-label" >Sport*</label></div>
                <div className="col-4 mb-2">
                    <select name="sport" className="form-control" value={currValues.sport} onChange={handleTeamDetails} >
                        {sportsOptions.map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>       
            </div>
            <div className="row">

                { action.type !== "Creation" && (
                <>
                    <p />
                    <div className="col-2 text-end mb-2"><label htmlFor="lookingForPlayers" className="form-label">Looking For Players?</label></div>
                    <div className="col-1 mb-2"><input name="lookingForPlayers" type="checkbox" className="form-check-input" defaultChecked={currValues.lookingForPlayers && "checked"} onChange={handleTeamDetails} /></div>
                    <div className="col-2 text-end mb-2"><label htmlFor="lookingForPlayersChgTmst" className="form-label">Change Timestamp</label></div>
                    <div className="col-4 mb-2"><input name="lookingForPlayersChgTmst" type="text" className="form-control" defaultValue={currValues.lookingForPlayersChgTmst} onChange={handleTeamDetails} /></div> 
                    <div className="row mt-3">
                        <div className="col-3 text-end"><label htmlFor="createdBy" className="form-label">Created By :</label></div>
                        <div className="col-4">
                            <a href={`/adminuserupdate/${currValues.createdBy}`} target="_blank" rel="noreferrer" name="createdBy" className="col-10 mb-1">{currValues.createdBy}</a>
                        </div>
                    </div>
                    <div className="row mt-2 mb-2">
                        <div className="col-3 text-end"><label htmlFor="newCreator" className="form-label">Change League Creator :</label></div>
                        <div className="col-3"><input name="newCreator" type="text" className="form-control" onChange={handleTeamDetails} placeholder="Search by username" /></div>
                        <FaSearchPlus className="col-1 mt-2" onClick={()=> handleSearchUser(currValues.newCreator)} />
                        <div className="col-3">
                            <a href={`/adminuserupdate/${currValues.newCreatorId}`} target="_blank" rel="noreferrer" name="newCreatorId">{currValues.newCreatorId}</a>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3 text-end"><label htmlFor="createdAt" className="form-label">Date of Team Creation :</label></div>
                        <div className="col-4"><p className="form-label">{currValues.createdAt}</p></div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3 text-end"><label htmlFor="updatedAt" className="form-label">Team Latest Update Date :</label></div>
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
                            <button onClick={() => setSelectedLogo(null)} className="btn btn-secondary mb-3" >Remove</button>
                        </div>
                    ) }
                    {!selectedLogo && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="rounded mw-100 mb-3 border border-secondary" style={{ width: "100rem", height: "13rem"}} viewBox="-12 -12 40 40">
                            <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                            <path d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
                        </svg> 
                    )}
                    <input type="file" id="logo" name="logo" className="form-control" onChange={handleLogoChange} />
                </div>
            </div>
            < div className="col mb-5 text-center">               
                <label htmlFor="banner" className="form-label mb-1">
                    Select Banner
                </label>
                {selectedBanner && (
                    <div>
                        <img src={bannerURL} alt="Team Banner" className="object-fit-cover rounded mw-100 mb-2" style={{ width: "100rem", height: "10rem"}}/>
                        <button onClick={() => setSelectedBanner(null)} className="btn btn-secondary mb-3" >Remove</button>
                    </div>
                ) }
                {!selectedBanner && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="rounded mw-100 mb-3 border border-secondary" style={{ width: "100rem", height: "10rem"}} viewBox="-12 -12 40 40">
                        <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                        <path d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg> 
                )}
                <div className="row justify-content-center">
                    <div className="col-3">
                        <input type="file" id="banner" name="banner" className="form-control" onChange={handleBannerChange} />
                    </div>
                </div>
            </div>

        </form>
        { action.type === "Update" && currValues.players !== null && currValues.players.length !== 0 && (
            <div>
                <div>
                    <br/><br/>
                    <table className="table table-hover text-center">
                        <thead>
                            <tr>
                                <th>Player Id</th>
                                <th>Position</th>
                                <th>Jersey No.</th>
                                <th>Date Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currValues.players.map((player, index) =>       
                                <tr key={player.playerId}>
                                    <td><a href={`/adminuserupdate/${player.playerId}`} target="_blank" rel="noreferrer" name="players" className="col-10 mb-1" key={player.playerId}>{player.playerId}</a></td>
                                    <td>
                                        <select name="position" className="form-control" defaultValue={player.positionId} onChange={(e) => handlePLayerChange(e, index)}>
                                            {positionOptions.map((option) => (
                                                <option value={option.value} key={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input name="jerseyNumber" type="number" min="0" defaultValue={player.jerseyNumber} onChange={(e) => handlePLayerChange(e, index)} style={{ width: "4rem"}}/>
                                    </td>
                                    <td><input name="joinedDate" type="text" defaultValue={player.joinedDate} onChange={(e) => handlePLayerChange(e, index)}/></td>
                                    <td><button className = "btn btn-danger btn-sm" onClick={() => handleRemovePlayer(index)}>Remove</button></td>
                                </tr>) 
                            }
                            <tr>
                                <td>
                                    <input name="addPlayer" type="text" value={currValues.addPlayer} onChange={handleTeamDetails} placeholder="Search username"/>
                                </td>
                                <td/>
                                <td/>
                                <td/>
                                <td><FaSearchPlus className="m-auto" onClick={()=> handleSearchPlayer(currValues.addPlayer)} /></td>  
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

export default AdminTeamMnt;
