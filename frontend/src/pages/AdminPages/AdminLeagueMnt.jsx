import { useState, useEffect, useRef }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearchPlus } from 'react-icons/fa';
import {checkIfSignedIn, getToken} from "../../hooks/auth";

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";

const AdminLeagueMnt = () => {
  
    let { isSignedIn, isAdmin } = checkIfSignedIn()
    const token = `Bearer ${getToken()}`
    const inputFileBanner = useRef(null);
    const inputFileLogo = useRef(null);
    const routeParams = useParams();
    const [action, handleAction] = useState("");
    const [currValues, setCurrentValues] = useState({leagueName: null, sport: null, location: null, division: null, 
        description: null, matches: [], teams: [{teamId: "", approvedBy: "", joinedTimestamp: null}] })
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [logoURL, setLogoURL] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [bannerURL, setBannerURL] = useState(null);
    const [sportsOptions, setSportsOptions] = useState([{ label: "Soccer", value: "648ba153251b78d7946df311" }, { label: "Basketball", value: "648ba153251b78d7946df322" }]);
    const statusOptions = [ {label: "Hasn't started", value: "NS"}, {label: "Has started", value: "ST"}, {label: "Has ended", value: "EN"} ]
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
        if (url === "/adminleaguecreation") {
            handleAction({type: "Creation", title: "CREATE LEAGUE", button1: "Create League"})
            setIsLoading(false)
        } else {
            handleAction({type: "Update", title: "UPDATE LEAGUE", button1: "Update"})
            fetch(`${backend}/admingetleaguedetails/${routeParams.leagueid}`, {
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
                    setCurrentValues({leagueName: data.details.leagueName, sportsTypeId: data.details.sportsTypeId, description: data.details.description, 
                        location: data.details.location, division: data.details.division, status: data.details.status, matches: data.details.matches.map(match => match._id),
                        ageGroup: data.details.ageGroup, numberOfTeams: data.details.numberOfTeams, numberOfRounds: data.details.numberOfRounds, startDate: dateFormat(data.details.startDate, "ISO"), endDate: dateFormat(data.details.endDate, "ISO"),
                        teams: data.details.teams, lookingForTeams: data.details.lookingForTeams, lookingForTeamsChgBy: data.details.lookingForTeamsChgBy, lookingForTeamsChgTmst: data.details.lookingForTeamsChgTmst,
                        createdBy: data.details.createdBy, createdAt: data.details.createdAt, updatedAt: data.details.updatedAt, newCreator: "", newCreatorId: ""
                    })
                    fetch(`${backend}/leaguelogos/${routeParams.leagueid}.jpeg`)
                    .then(res=>{
                        if (res.ok) {
                            setLogoURL(`${backend}/leaguelogos/${routeParams.leagueid}.jpeg`) 
                            setSelectedLogo("x")
                        }
                    })
                    fetch(`${backend}/leaguebanners/${routeParams.leagueid}.jpeg`)
                    .then(res=>{
                        if (res.ok) {
                            setBannerURL(`${backend}/leaguebanners/${routeParams.leagueid}.jpeg`)
                            setSelectedBanner("x")
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
        if (field === "lookingForTeams") {
            let newInd = currValues.lookingForTeams
            newInd = !newInd
            setCurrentValues({...currValues, lookingForTeams : newInd })
        } else {
            setCurrentValues({ ...currValues, [field] : e.target.value })
        }
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

    const dateFormat = (date, type) => {
        let dateIn = new Date(date)
        if (type === "ISO") {
            return dateIn.toISOString().substring(0,10)
        } else {
            return dateIn.toDateString()
        }
    }

    const handleSearchUser = (userName) => {
        if (userName !== "") {
            setErrorMessage([]);
            fetch(`${backend}/finduser/${userName}`)
            .then(response => response.json())
            .then(resp => {
                if (resp.playerId !== "") {
                    if (resp.playerId !== currValues.createdBy) {
                        setCurrentValues({ ...currValues, newCreatorId : resp.playerId })
                    } else {
                        setErrorMessage(["The same user as current team admin"]);
                    }
                } else {
                    setErrorMessage(["User is not found"]);
                    setCurrentValues({ ...currValues, newCreatorId : "" })
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
            fetch(`${backend}/admincreateleague`, {
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
                    navigate('/adminleagues')
                }
                setIsLoading(false)
            }).catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
        } else {
            //data.logo = selectedLogo
            //data.banner = selectedBanner
            fetch(`${backend}/adminupdateleague/${routeParams.leagueid}`, {
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
                    navigate('/adminleagues')
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

            <div className = "row mb-2">
                <div className="col-2 text-end"><label htmlFor="leagueName" className="form-label">League Name*</label></div>
                <div className="col-4"><input id="leagueName" name="leagueName" type="text" className="form-control" value={currValues.leagueName} onChange={handleLeagueDetails} /></div>
                <div className="col-2 text-end"><label htmlFor="sportsTypeId" className="form-label" >Sport*</label></div>
                <div className="col-2">
                    <select id="sportsTypeId" name="sportsTypeId" className="form-control" value={currValues.sportsTypeId} onChange={handleLeagueDetails} >
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
                        <div className="col-3 text-end"><label htmlFor="createdAt" className="form-label">Date of League Creation :</label></div>
                        <div className="col-4"><p className="form-label">{currValues.createdAt}</p></div>
                    </div>
                    <div className="row">
                        <div className="col-3 text-end"><label htmlFor="updatedAt" className="form-label">League Latest Update Date :</label></div>
                        <div className="col-4"><p className="form-label">{currValues.updatedAt}</p></div>
                    </div>
                </>
                ) }
                <div className="row mt-2">
                        <div className="col-3 text-end"><label htmlFor="newCreator" className="form-label">Change League Creator :</label></div>
                        <div className="col-3"><input id="newCreator" name="newCreator" type="text" className="form-control" onChange={handleLeagueDetails} placeholder="Search by username" /></div>
                        <FaSearchPlus className="col-1 mt-2" onClick={()=> handleSearchUser(currValues.newCreator)} />
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
              )
      )}
    </div>
  );
};

export default AdminLeagueMnt;
