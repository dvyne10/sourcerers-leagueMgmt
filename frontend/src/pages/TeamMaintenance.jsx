import { useState, useEffect, useRef }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import useAuth from "../hooks/auth";
import {Form} from 'react-bootstrap/';


const TeamMaintenance = () => {
    const [validated, setValidated] = useState(false);
    const {isSignedIn} = useAuth()
    const location = useLocation();
    const routeParams = useParams();
    const inputFileBanner = useRef(null);
    const inputFileLogo = useRef(null);
    const [action, handleAction] = useState({type: "Creation", title: "CREATE TEAM"});
    const [currValues, setCurrentValues] = useState({teamName: null, description: null, location: null,
        division: null, email: null 
    })
    const [playersList, setPlayersList] = useState(null)
    const sportsOptions = [ {label: "Soccer", value: "soccerId"}, {label: "Basketball", value: "basketId"} ]
    const [sportSelected, setSportSelected] = useState(sportsOptions[0].value)
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [logoURL, setLogoURL] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [bannerURL, setBannerURL] = useState(null);
    const [disableDelete, setDeleteButton] = useState(true)
    const [oldValues, setOldValues] = useState(null)
    const [didPlayersChange, setPlayersChanged] = useState(false)
    const [errorMessage, setErrorMessage] = useState([]);
    
    const positionOptions = [ {label: "Team Captain", value: "SCP01"}, {label: "Goalkeeper", value: "SCP02"}, {label: "Defender", value: "SCP03"} ]


    useEffect(() => {
        const url = window.location.pathname.substring(1,7).toLowerCase()
        if (url === "create") {
            handleAction({type: "Creation", title: "Create Team"})
        } else {
            handleAction({type: "Update", title: "Update Team", protectSport: true })
            // cannot amend sport if it has player/s or game history
            setCurrentValues({teamName: "Vikings", description: "A team of soccer enthusiasts.", location: "York, Ontario, CA",
                division: "mixed", email: "vikingsteam@mail.com"
            })
            setPlayersList([
                { playerId: 1, username: "sMcdowell", playerName: "Scarlet Mcdowell", position: "SCP01", jerseyNumber: 15, joinedDate: "2022-07-01" },
                { playerId: 2, username: "uWatts", playerName: "Ursa Watts", position: "SCP02", jerseyNumber: 87, joinedDate: "2022-07-02" },
                { playerId: 3, username: "pRodriguez", playerName: "Phoebe Rodriguez", position: "SCP03", jerseyNumber: 12, joinedDate: "2022-07-03" },
                { playerId: 4, username: "zHickman", playerName: "Zachary Hickman", position: "SCP02", jerseyNumber: 74, joinedDate: "2022-07-04" },
                { playerId: 5, username: "kBall", playerName: "Kylynn Ball", position: "SCP03", jerseyNumber: 69, joinedDate: "2022-07-05" },
                { playerId: 6, username: "aHorn", playerName: "Athena Horn", position: "SCP02", jerseyNumber: 73, joinedDate: "2022-07-06" },
                { playerId: 7, username: "bChristian", playerName: "Bruno Christian", position: "SCP03", jerseyNumber: 4, joinedDate: "2022-07-07" },
                { playerId: 8, username: "mHodge", playerName: "Meghan Hodge", position: "SCP02", jerseyNumber: 26, joinedDate: "2022-07-08" },
                { playerId: 9, username: "oBurt", playerName: "Olivia Burt", position: "SCP03", jerseyNumber: 27, joinedDate: "2022-07-09" },
                { playerId: 10, username: "kJustice", playerName: "Katelyn Justice", position: "SCP02", jerseyNumber: 36, joinedDate: "2022-07-10" },
            ])
            setSportSelected("soccerId")
            setLogoURL("https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80")
            setSelectedLogo("x")
            setBannerURL("https://plus.unsplash.com/premium_photo-1685055940239-21af8b3b0443?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80")
            setSelectedBanner("x")
            //setDeleteButton(false)
            setOldValues({ teamName: "Vikings", description: "A team of soccer enthusiasts.", location: "York, Ontario, CA",
                division: "mixed", email: "vikingsteam@mail.com", sport: "soccerId", logo: "x", banner: "x"
            })
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

    const handleSportChange= event => {
        setSportSelected(event.target.value);
    }

    const handlePLayerChange = (event, index) => {
        const field = event.target.name
        let newList = [...playersList]
        newList[index][field] = event.target.value
        setPlayersList(newList)
        setPlayersChanged(true)
    }

    const handleTeamDetails = (e) => {
        const field = e.target.name
        setCurrentValues({ ...currValues, [field] : e.target.value })
    }

    const handleRemovePlayer = (index) => {
        let newList = [...playersList]
        if (confirm(`Remove ${newList[index].playerName} from the team?\nPlease click on OK if you wish to proceed.`)) {
            newList.splice(index, 1)
            setPlayersList(newList)
            setPlayersChanged(true)
        } else {
            console.log("Removal cancelled")
        } 
    }

    const navigate = useNavigate(); 
    const navigateCancel = () => {
        if (action.type === "Creation") {
            navigate('/teams')
        } else {
            navigate('/team/' + routeParams.teamid)
        } 
    }
    const navigateTeamDetails = (event) => { 
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        setValidated(true);
        let error = false
        error = validateInput()
        if (!error) {
        if (action.type === "Creation") {
            navigate('/team/' + "new team id here")
        } else {
            if ( oldValues.teamName == currValues.teamName 
                && oldValues.description == currValues.description 
                && oldValues.location == currValues.location 
                && oldValues.division == currValues.division
                && oldValues.email == currValues.email
                && oldValues.sport == sportSelected
                && oldValues.logo == selectedLogo
                && oldValues.banner == selectedBanner
                && didPlayersChange == false
            ) {
                alert("NO CHANGES FOUND!")
            } else {
                navigate('/team/' + routeParams.teamid)
            } 
        }
    }
}

const validateInput = () => {
    let errResp = false
    let errMsgs = []
    let focusON = false
    if (currValues.teamName.trim() === "") {
        errMsgs.push('Team name is required.');
        document.getElementById("teamName").focus()
        focusON = true
    }
    if (currValues.location === "") {
        errMsgs.push('Location is required.');
        if (!focusON) {
            document.getElementById("location").focus()
            focusON = true
        }
    }
    if (currValues.email.trim() === "") {
        errMsgs.push('Email is required.');
        if (!focusON) {
            document.getElementById("email").focus()
            focusON = true
        }
    }

    setErrorMessage(errMsgs)
    if (errMsgs.length > 0) {
        errResp = true
    }
    return errResp
}

    const navigateDelete = () => {
        let count = (playersList === null ? 0 : 1)
        if (count !== 0) {
            alert("You cannot delete a team that has player/s or game history.")
        } else {
            if (confirm("Please confirm if you want to proceed with deletion of this team.")) {
                navigate('/teams')
            } else {
                console.log("Deletion cancelled")
            }
        }
    }

  return (
    <div className="d-flex container mt-2 justify-content-center">
        { !isSignedIn ? (
            <div>
                {navigate('/signin')}
            </div>
        ) : (
        <Card style={{ width: "60rem", padding: 20 }}>
        {errorMessage.length > 0 && (
            <div className="alert alert-danger mb-3 p-1">
                {errorMessage.map((err, index) => (
                    <p className="mb-0" key={index}>{err}</p>
                ))}
            </div>
        )}
        <h2 className="mb-4 center-text">{action.title.toUpperCase()}</h2>
        <Form noValidate validated={validated} action="" encType="multipart/form-data">
            < div className="col mb-5 text-center">           
                <Form.Label htmlFor="banner" className="form-label mb-1">
                    Select Banner
                </Form.Label>
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
            <div className="row">
            <div className="col-sm-9 mb-3"> 
          <div className="row">
            <div className="col-sm-7 mb-3">
                <Form.Label htmlFor="teamName"  className="form-label">
                    Team Name*
                </Form.Label>
                <Form.Control
            required
            pattern="^\S.*$"
            // pattern="^(?!.*\s)[^']*$" --this is for avoiding ' as well.
            type="text"
            placeholder="Last name"
            defaultValue="Otto" id="teamName" name="teamName" className="form-control" value={currValues.teamName} onChange={handleTeamDetails} />
            
            <Form.Control.Feedback type="invalid">
            Please provide a valid team name.
          </Form.Control.Feedback>
          
            {/* <Form.Group controlId="validationCustom03">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" placeholder="City" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group> */}
            </div>
            <div className="col-sm-4 mb-3">
                <Form.Label htmlFor="sport" className="form-label">
                    Sport*
                </Form.Label>
                <Form.Select id="sport" name="sport" className="form-control" value={sportSelected} onChange={handleSportChange} disabled={action.protectSport}>
                    {sportsOptions.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                    ))}
                </Form.Select>
            </div>
          </div>
          <div className="col-sm-11 mb-3">
                <Form.Label htmlFor="description" className="form-label" required>
                    Description
                </Form.Label>
            <textarea id="description" name="description" className="form-control form-control-sm" value={currValues.description} onChange={handleTeamDetails} />
          </div>
          <div className="row">
            <div className="col-sm-5 mb-3">
                <Form.Label htmlFor="location" className="form-label">
                    Location*
                </Form.Label>
                <Form.Control required pattern="^\S.*$" id="location" name="location" type="text" className="form-control" value={currValues.location} onChange={handleTeamDetails} />
            </div>
            <div className="col-sm-3 mb-3">
                <Form.Label htmlFor="division" className="form-label">
                    Division
                </Form.Label>
                <input id="division" name="division" type="text" className="form-control" value={currValues.division} onChange={handleTeamDetails} />
            </div>
            <div className="col-sm-4 mb-3">
                <label htmlFor="email" className="form-label">
                    Email*
                </label>
                <Form.Control required id="email" name="email" type="email" className="form-control" value={currValues.email} onChange={handleTeamDetails} />
            </div>
          </div>
          </div>
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
        </Form>
        { action.type === "Update" && playersList !== null && playersList.length !== 0 && (
            <div>
                <div>
                    <br/><br/>
                    <table className="table table-hover text-center">
                        <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Username</th>
                                <th>Position</th>
                                <th>Jersey No.</th>
                                <th>Date Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playersList.map((player, index) =>       
                                <tr key={player.playerId}>
                                    <td>{player.playerName}</td>
                                    <td>{player.username}</td>
                                    <td>
                                        <select name="position" className="form-control" value={player.position} onChange={(e) => handlePLayerChange(e, index)}>
                                            {positionOptions.map((option) => (
                                                <option value={option.value} key={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input name="jerseyNumber" type="number" value={player.jerseyNumber} onChange={(e) => handlePLayerChange(e, index)} style={{ width: "4rem"}}/>
                                    </td>
                                    <td>{player.joinedDate}</td>
                                    <td><button className = "btn btn-danger btn-sm" onClick={() => handleRemovePlayer(index)}>Remove</button></td>
                                </tr>) 
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )}
                <div className="row justify-content-center mt-5">
                    <button className="btn btn-dark col-2 mx-5" type="button" onClick={navigateTeamDetails}>
                        {action.title}
                    </button>
                    { action.type !== "Creation" && (
                        <button type="button" className="btn btn-danger col-2" disabled={disableDelete} onClick={navigateDelete}>
                            Delete
                        </button>
                    ) }
                    <button type="button" className="btn btn-outline-secondary col-2" onClick={navigateCancel}>
                        Cancel
                    </button>
                </div>

      </Card>
      )}
    </div>
  );
};

export default TeamMaintenance;
