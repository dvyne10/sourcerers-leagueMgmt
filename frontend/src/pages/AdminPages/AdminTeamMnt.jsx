import { useState, useEffect, useRef }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearchPlus } from 'react-icons/fa';
import {checkIfSignedIn, getToken} from "../../hooks/auth";

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";

const AdminTeamMnt = () => {
  
    let { isSignedIn, isAdmin } = checkIfSignedIn()
    const token = `Bearer ${getToken()}`
    const inputFileBanner = useRef(null);
    const inputFileLogo = useRef(null);
    const routeParams = useParams();
    const [action, handleAction] = useState("");
    const [currValues, setCurrentValues] = useState({teamName: null, sportsTypeId: null, location: null, division: null, teamContactEmail: null, 
        description: null, players: [] })
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [logoURL, setLogoURL] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [bannerURL, setBannerURL] = useState(null);
    const [sportsOptions, setSportsOptions] = useState([{ label: "Soccer", value: "648ba153251b78d7946df311" }, { label: "Basketball", value: "648ba153251b78d7946df322" }]);
    const [positionOptions, setPositionOptions] = useState([ {label: "Team Captain", value: "SCP01"}, {label: "Goalkeeper", value: "SCP02"}, {label: "Defender", value: "SCP03"} ])
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
        if (url === "/adminteamcreation") {
            handleAction({type: "Creation", title: "CREATE TEAM", button1: "Create Team"})
            setIsLoading(false)
        } else {
            handleAction({type: "Update", title: "UPDATE TEAM", button1: "Update"})
            fetch(`${backend}/admingetteamdetails/${routeParams.teamid}`, {
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
                    setCurrentValues({teamName: data.details.teamName, sportsTypeId: data.details.sportsTypeId, description: data.details.description, 
                        location: data.details.location, division: data.details.division, teamContactEmail: data.details.teamContactEmail, 
                        players: data.details.players, lookingForPlayers: data.details.lookingForPlayers, lookingForPlayersChgTmst: data.details.lookingForPlayersChgTmst, addPlayer: "",
                        createdBy: data.details.createdBy, createdAt: data.details.createdAt, updatedAt: data.details.updatedAt, newCreatorId: ""
                    })
                    fetch(`${backend}/teamlogos/${routeParams.teamid}.jpeg`)
                    .then(res=>{
                        if (res.ok) {
                            setLogoURL(`${backend}/teamlogos/${routeParams.teamid}.jpeg`) 
                            setSelectedLogo("x")
                        }
                    })
                    fetch(`${backend}/teambanners/${routeParams.teamid}.jpeg`)
                    .then(res=>{
                        if (res.ok) {
                            setBannerURL(`${backend}/teambanners/${routeParams.teamid}.jpeg`)
                            setSelectedBanner("x")
                        }
                    })
                    let positionsFromDb = data.details.positionOptions.map(position => {
                        return {label: position.positionDesc, value: position.positionParmId}
                    })
                    setPositionOptions(positionsFromDb.sort((a,b) => a.label > b.label ? 1 : -1))
                }
                setIsLoading(false)
            }).catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
        }
    }, [location.pathname]);

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

    const handlePLayerChange = (event, index) => {
        const field = event.target.name
        let newList = [...currValues.players]
        newList[index][field] = event.target.value
        setCurrentValues({ ...currValues, players : newList })
    }

    const handleTeamDetails = (e) => {
        const field = e.target.name
        if (field === "lookingForPlayers") {
            let newInd = currValues.lookingForPlayers
            newInd = !newInd
            setCurrentValues({ ...currValues, lookingForPlayers : newInd })
        } else {
            setCurrentValues({ ...currValues, [field] : e.target.value })
        }
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

    const handleSearchUser = (userName, field) => {
        if (userName !== "") {
            setErrorMessage([]);
            fetch(`${backend}/finduser/${userName}`)
            .then(response => response.json())
            .then(resp => {
                if (resp.playerId !== "") {
                    if (field === 1) {
                        if (resp.playerId !== currValues.createdBy) {
                            setCurrentValues({ ...currValues, newCreatorId : resp.playerId })
                        } else {
                            setErrorMessage(["The same user as current team admin"]);
                        }
                    } else {
                        let newList = [...currValues.players]
                        let index = newList.findIndex(p => p.playerId === resp.playerId)
                        if (index === -1) {
                            newList.push({ playerId: resp.playerId, position: null, jerseyNumber: null, joinedTimestamp: new Date() })
                            setCurrentValues({ ...currValues, players : newList, addPlayer : "" })
                        } else {
                            setErrorMessage(["Player is already part of the team."]);
                            window.scrollTo(0, 0);
                        }
                    }
                } else {
                    setErrorMessage(["User is not found"]);
                    if (field === 1) {
                        setCurrentValues({ ...currValues, newCreatorId : "" })
                    }
                    window.scrollTo(0, 0);
                }
            })
        }
    }

    const navigate = useNavigate(); 
    const navigateCreateUpdate = () => { 
        let data = {...currValues}
        setIsLoading(true)
        if (action.type === "Creation") {
            //data.logo = selectedLogo
            //data.banner = selectedBanner
            fetch(`${backend}/admincreateteam`, {
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
                    navigate('/adminteams')
                }
                setIsLoading(false)
            }).catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
        } else {
            //data.logo = selectedLogo
            //data.banner = selectedBanner
            fetch(`${backend}/adminupdateteam/${routeParams.teamid}`, {
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
                    navigate('/adminteams')
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

            <div className="row">

                <div className="col-2 text-end mb-2"><label htmlFor="teamName" className="form-label">Team Name*</label></div>
                <div className="col-4 mb-2"><input id="teamName" name="teamName" type="text" className="form-control" value={currValues.teamName} onChange={handleTeamDetails} /></div>
                <div className="col-2 text-end mb-2"><label htmlFor="location" className="form-label" >Team Location*</label></div>
                <div className="col-4 mb-2"><input id="location" name="location" type="text" className="form-control" value={currValues.location} onChange={handleTeamDetails}/></div>
                <div className="col-2 text-end mb-2"><label htmlFor="division" className="form-label" >Division</label></div>
                <div className="col-4 mb-2"><input id="division" name="division" type="text" className="form-control" value={currValues.division} onChange={handleTeamDetails}/></div>
                <div className="col-2 text-end mb-2"><label htmlFor="teamContactEmail" className="form-label">Email*</label></div>
                <div className="col-4 mb-2"><input id="teamContactEmail" name="teamContactEmail" type="email" className="form-control" value={currValues.teamContactEmail} onChange={handleTeamDetails} /></div>
                <div className="col-2 text-end mb-2"><label htmlFor="description" className="form-label" >Description</label></div>
                <div className="col-10 mb-2"><textarea id="description" name="description" className="form-control form-control-sm" value={currValues.description} onChange={handleTeamDetails}/></div>
                <div className="col-2 text-end mb-2"><label htmlFor="sportsTypeId" className="form-label" >Sport*</label></div>
                <div className="col-4 mb-2">
                    <select id="sportsTypeId" name="sportsTypeId" className="form-control" value={currValues.sportsTypeId} onChange={handleTeamDetails} >
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
                    <div className="col-1 mb-2"><input id="lookingForPlayers" name="lookingForPlayers" type="checkbox" className="form-check-input" defaultChecked={currValues.lookingForPlayers && "checked"} onChange={handleTeamDetails} /></div>
                    <div className="col-2 text-end mb-2"><label htmlFor="lookingForPlayersChgTmst" className="form-label">Change Timestamp</label></div>
                    <div className="col-4 mb-2"><input id="lookingForPlayersChgTmst" name="lookingForPlayersChgTmst" type="text" className="form-control" value={currValues.lookingForPlayersChgTmst} onChange={handleTeamDetails} /></div> 
                    <div className="row mt-3">
                        <div className="col-3 text-end"><label htmlFor="createdBy" className="form-label">Created By :</label></div>
                        <div className="col-4">
                            <a href={`/adminuserupdate/${currValues.createdBy}`} target="_blank" rel="noreferrer" name="createdBy" className="col-10 mb-1">{currValues.createdBy}</a>
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
                    <div className="row mt-2 mb-2">
                        <div className="col-3 text-end"><label htmlFor="newCreator" className="form-label">Change Team Creator :</label></div>
                        <div className="col-3"><input id="newCreator" name="newCreator" type="text" className="form-control" onChange={handleTeamDetails} placeholder="Search by username" /></div>
                        <FaSearchPlus className="col-1 mt-2" onClick={()=> handleSearchUser(currValues.newCreator, 1)} />
                        <div className="col-3">
                            <a href={`/adminuserupdate/${currValues.newCreatorId}`} target="_blank" rel="noreferrer" name="newCreatorId">{currValues.newCreatorId}</a>
                        </div>
                    </div>
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
                                        <select name="position" className="form-control" value={player.position} onChange={(e) => handlePLayerChange(e, index)}>
                                            {positionOptions.map((option) => (
                                                <option value={option.value} key={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input name="jerseyNumber" type="number" min="0" value={player.jerseyNumber} onChange={(e) => handlePLayerChange(e, index)} style={{ width: "4rem"}}/>
                                    </td>
                                    <td><input name="joinedTimestamp" type="text" value={player.joinedTimestamp} onChange={(e) => handlePLayerChange(e, index)}/></td>
                                    <td><button className = "btn btn-danger btn-sm" onClick={() => handleRemovePlayer(index)}>Remove</button></td>
                                </tr>) 
                            }
                            <tr>
                                <td>
                                    <input name="addPlayer" type="text" value={currValues.addPlayer} onChange={handleTeamDetails} placeholder="Search by username"/>
                                </td>
                                <td/>
                                <td/>
                                <td/>
                                <td><FaSearchPlus className="m-auto" onClick={()=> handleSearchUser(currValues.addPlayer, 2)} /></td>  
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )}
        <div className="row justify-content-center">
                <button className="btn btn-dark col-2 mx-5" type="submit" onClick={navigateCreateUpdate}>
                    {action.button1}
                </button>
                <button type="button" className="btn btn-outline-secondary col-2" onClick={navigateCancel}>
                    Cancel
                </button>
            </div>
      </Card>
              )
      )}
    </div>
  );
};

export default AdminTeamMnt;
