import React from "react";
import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import useAuth from "../../hooks/auth";

const AdminUsers = () => {
  
    const {isSignedIn, isAdmin} = useAuth()
    const location = useLocation();
    const routeParams = useParams();
    const [action, handleAction] = useState({type: "Creation", title: "CREATE TEAM"});
    const [currValues, setCurrentValues] = useState({teamName: null, description: null, location: null,
        division: null, email: null 
    })
    const [playersList, setPlayersList] = useState(null)
    const [sportSelected, setSportSelected] = useState("")
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [logoURL, setLogoURL] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [bannerURL, setBannerURL] = useState(null);
    const [disableDelete, setDeleteButton] = useState(true)
    const [oldValues, setOldValues] = useState(null)
    const [didPlayersChange, setPlayersChanged] = useState(false)
    const sportsOptions = [ {label: "Soccer", value: "soccerId"}, {label: "Basketball", value: "basketId"} ]
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
        }
    }, []);

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
    const navigateTeamDetails = () => { 
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
    
    if (isSignedIn == false || isAdmin == false) {
      return "You don't have permissions to this page"
    }

  return (
    <div className="d-flex container mt-2 justify-content-center">
      <Card style={{ width: "60rem", padding: 20 }}>
        <h2 className="mb-4 center-text">{action.title.toUpperCase()}</h2>
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
                                        <select name="position" className="form-control" defaultValue={player.position} onChange={(e) => handlePositionChange(e, index)}>
                                            {positionOptions.map((option) => (
                                                <option value={option.value} key={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input name="jerseyNumber" type="number" defaultValue={player.jerseyNumber} onChange={(e) => handleJerseyChange(e, index)} style={{ width: "4rem"}}/>
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
    </div>
  );
};

export default AdminUsers;
