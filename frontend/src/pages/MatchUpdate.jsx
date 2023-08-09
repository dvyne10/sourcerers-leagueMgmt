import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaTrash, FaSearchPlus } from 'react-icons/fa';
import useAuth, {checkIfSignedIn, getToken} from "../hooks/auth";

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";

const MatchUpdate = () => {
  
    const navigate = useNavigate(); 
    const location = useLocation();
    const routeParams = useParams();
    const {isSignedIn, isAdmin} = useAuth()
    const token = `Bearer ${getToken()}`
    const [statistics, setStatistics] = useState([{ statisticsId: null, statShortDesc: null}])
    const [currValues, setCurrentValues] = useState({matchId: routeParams.matchId, dateOfMatch: null, locationOfMatch: null,
        teamId1: null, teamName1: null, finalScore1: null, finalScorePending1: null, leaguePoints1: null, leaguePointsPending1: null, disableInput1: true,
        teamId2: null, teamName2: null, finalScore2: null, finalScorePending2: null, leaguePoints2: null, leaguePointsPending2: null, disableInput2: true,
    })
    const [matchesToUpdate1, setMatchesToUpdate1] = useState([ { playerId: null, userName: null, fullName: null, statistics: [{ statisticsId: null, value: null }] } ])
    const [matchesToUpdate2, setMatchesToUpdate2] = useState([ { playerId: null, userName: null, fullName: null, statistics: [{ statisticsId: null, value: null }] } ])
    const [findUsername, setFindUsername] = useState(["",""])
    const [oldValues, setOldValues] = useState(null)
    const [didMatchDetailsChange, setMatchDetailsChanged] = useState(false)
    const [errorMessage, setErrorMessage] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        let url
        if (window.location.pathname.substring(1,6).toLowerCase() === "admin") {
            url = `${backend}/admingetmatchdetailsupdate/${routeParams.matchid}`
        } else {
            url = `${backend}/getmatchdetailsupdate/${routeParams.matchid}`
        }
        setIsLoading(true)
        fetch(url, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "Application/JSON",
                "Authorization": token
            }
        })
        .then(response => response.json())
        .then(data=>{
            console.log(JSON.stringify(data))
            if (data.requestStatus !== 'ACTC') {
                navigate(`/match/${routeParams.matchid}`)
            } else {
                setCurrentValues({ dateOfMatch: data.details.dateOfMatch.toString().substring(0,16), locationOfMatch: data.details.locationOfMatch,
                    teamId1: data.details.team1.teamId, teamName1: data.details.team1.teamName, finalScore1: data.details.team1.finalScore, finalScorePending1: data.details.team1.finalScorePending, 
                        leaguePoints1: data.details.team1.leaguePoints, leaguePointsPending1: data.details.team1.leaguePointsPending, disableInput1: !data.details.team1.isTeamAdmin,
                    teamId2: data.details.team2.teamId, teamName2: data.details.team2.teamName, finalScore2: data.details.team2.finalScore, finalScorePending2: data.details.team2.finalScorePending, 
                        leaguePoints2: data.details.team2.leaguePoints, leaguePointsPending2: data.details.team2.leaguePointsPending, disableInput2: !data.details.team2.isTeamAdmin,
                })
                setMatchesToUpdate1(data.details.team1.players)
                setMatchesToUpdate2(data.details.team2.players)
                setStatistics(data.details.statisticOptions)
                setOldValues({ dateOfMatch: data.details.dateOfMatch.toString().substring(0,16), locationOfMatch: data.details.locationOfMatch, 
                    finalScore1: data.details.team1.finalScore, leaguePoints1: data.details.team1.leaguePoints, finalScore2: data.details.team2.finalScore, leaguePoints2: data.details.team2.leaguePoints,
                    finalScorePending1: data.details.team1.finalScorePending, leaguePointsPending1: data.details.team1.leaguePointsPending, 
                    finalScorePending2: data.details.team2.finalScorePending, leaguePointsPending2: data.details.team1.leaguePointsPending
                }) 
            }
            setIsLoading(false)
        }).catch((error) => {
            console.log(error)
            setIsLoading(false)
        })
    }, [location.pathname]);

    const handleMatchDetails = (e) => {
        const arrOfNumerics = ["finalScore1", "finalScore2", "leaguePoints1", "leaguePoints2"]
        const field = e.target.name
        if (arrOfNumerics.find(e => e === field) ) {
            setCurrentValues({ ...currValues, [field] : Number(e.target.value) })
        } else {
            setCurrentValues({ ...currValues, [field] : e.target.value })
        }
    }

    const onChangeStat = (e, playerId, statisticsId, num) => {
        let i = 0; let j = 0;
        const value = Number(e.target.value)
        let newList = [];
        if (num ===1 ) {
            newList = [...matchesToUpdate1]
        } else {
            newList = [...matchesToUpdate2]
        }
        i = newList.findIndex(i => i.playerId === playerId);
        j = newList[i].statistics.findIndex( j => j.statisticsId === statisticsId)
        if (j !== -1) {
            newList[i].statistics[j].value = value
        } else if (newList[i].statistics) {
            newList[i].statistics.push({statisticsId, value})
        } else {
            newList[i].statistics = [{statisticsId, value}]
        }
        if (num ===1 ) {
            setMatchesToUpdate1(newList)
        } else {
            setMatchesToUpdate2(newList)
        }
        setMatchDetailsChanged(true)
    }

    const handleRemoveRow = (index, num) => {
        let newList = [];
        if (num ===1 && !currValues.disableInput1 ) {
            newList = [...matchesToUpdate1]
            newList.splice(index, 1)
            setMatchesToUpdate1(newList)
        } else if (!currValues.disableInput2 ) {
            newList = [...matchesToUpdate2]
            newList.splice(index, 1)
            setMatchesToUpdate2(newList)
        }
        setMatchDetailsChanged(true)
    }

    const handleAddUsername = (e, num) => {
        if ( num ===1 ) {
            setFindUsername([e.target.value,findUsername[1]])
        } else {
            setFindUsername([findUsername[0],e.target.value])
        }
    }

    const handleAddRow = (userName, num) => {
        if (userName !== "") {
            let newList = [];
            fetch(`${backend}/finduser/${userName}`)
            .then(response => response.json())
            .then(resp => {
                if (resp.playerId !== "") {
                    let newStat = statistics.map(stat => {
                        return {statisticsId: stat.statisticsId, value: 0} 
                    })
                    if (num === 1 && !currValues.disableInput1) {
                        newList = [...matchesToUpdate1]
                        newList.push({ playerId: resp.playerId, userName: resp.userName, fullName: resp.fullName, statistics: newStat })
                        setMatchesToUpdate1(newList)
                        setFindUsername(["",findUsername[1]])
                    } else if (!currValues.disableInput2) {
                        newList = [...matchesToUpdate2]
                        newList.push({ playerId: resp.playerId, userName: resp.userName, fullName: resp.fullName, statistics: newStat })
                        setMatchesToUpdate2(newList)
                        setFindUsername([findUsername[0],""])
                    }
                    setMatchDetailsChanged(true)
                } else {
                    setErrorMessage(["User is not found"]);
                    if ( num ===1 ) {
                        window.scrollTo(0, 0);
                        document.getElementById("userName1").focus();
                    } else {
                        window.scrollTo(0, 0);
                        document.getElementById("userName2").focus();
                    }
                }
            })
        }
    }

    const checkIfUserIsSignedIn = () => {
        checkIfSignedIn()
        .then((user) => {
          if (!user.isSignedIn) {
            navigate("/signin");
          }
        })
      }

    const navigateUpdate = () => {
        let data = {}
        let error = false; 
        error = validateInput();
        if (!error) {
            if ( oldValues.dateOfMatch == currValues.dateOfMatch 
                && oldValues.locationOfMatch == currValues.locationOfMatch 
                && oldValues.finalScore1 == currValues.finalScore1 
                && oldValues.leaguePoints1 == currValues.leaguePoints1
                && oldValues.finalScore2 == currValues.finalScore2
                && oldValues.leaguePoints2 == currValues.leaguePoints2
                && oldValues.finalScorePending1 == currValues.finalScorePending1 
                && oldValues.leaguePointsPending1 == currValues.leaguePointsPending1
                && oldValues.finalScorePending2 == currValues.finalScorePending2
                && oldValues.leaguePointsPending2 == currValues.leaguePointsPending2
                && didMatchDetailsChange == false
            ) {
                alert("NO CHANGES FOUND!")
            } else {
                data = {...currValues}
                if (!currValues.disableInput1) {
                    data.players1 = matchesToUpdate1.map(player => {
                        return { playerId: player.playerId, statistics: player.statistics }
                    })
                }
                if (!currValues.disableInput2) {
                    data.players2 = matchesToUpdate2.map(player => {
                        return { playerId: player.playerId, statistics: player.statistics }
                    })
                }
                setIsLoading(true)
                if (!isAdmin) {
                    let proceed = false
                    if (oldValues.finalScore1 !== currValues.finalScore1
                        || oldValues.leaguePoints1 !== currValues.leaguePoints1
                        || oldValues.finalScore2 !== currValues.finalScore2
                        || oldValues.leaguePoints2 !== currValues.leaguePoints2    
                    ) {
                        if (confirm("Changes will require the approval of other team's admin.\nPlease click on OK if you wish to proceed.")) {
                            proceed = true
                        } else {
                            console.log("Update cancelled")
                        } 
                    } else { proceed = true }
                    if (proceed) {
                        fetch(`${backend}/updatematch/${routeParams.matchid}`, {
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
                                if (data.errField !== "") {
                                    document.getElementById(data.errField).focus()
                                }
                            } else {
                                navigate(`/match/${routeParams.matchid}`)
                            }
                            setIsLoading(false)
                        }).catch((error) => {
                            console.log(error)
                            setIsLoading(false)
                        })
                    }
                } else {
                    fetch(`${backend}/adminupdatematch/${routeParams.matchid}`, {
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
                            if (data.errField !== "") {
                                document.getElementById(data.errField).focus()
                            }
                        } else {
                            navigate("/adminmatches")
                        }
                        setIsLoading(false)
                    }).catch((error) => {
                        console.log(error)
                        setIsLoading(false)
                    })
                }
            }
        }
    }

    const playerStat = (statisticsId, playerRec) => {
        let index = playerRec.findIndex(ps => ps.statisticsId === statisticsId)
        if (index !== -1) {
            return playerRec[index].value
        } else {
            return 0
        }
    }
    
    const navigateCancel = () => { navigate(-1) }

    const validateInput = () => {
        let errResp = false; 
        let errMsgs = [];
        let focusON = false; 
        let now = new Date();
        let year = now.getFullYear();
        let month = ('0' + (now.getMonth() + 1)).slice(-2);
        let day = ('0' + now.getDate()).slice(-2);
        let hours = ('0' + now.getHours()).slice(-2);
        let minutes = ('0' + now.getMinutes()).slice(-2);
        let formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        let totalScore1 = 0;
        let totalScore2 = 0;
        let dateStr = currValues.dateOfMatch; // Your date string
        let dateObj = new Date(dateStr);

        matchesToUpdate1.forEach(player => {
            player.statistics.forEach(stat => {
                if (stat.statisticsId === statistics[0].statisticsId) {
                    totalScore1 += stat.value;
                }
            });
        });

        matchesToUpdate2.forEach(player => {
            player.statistics.forEach(stat => {
                if (stat.statisticsId === statistics[0].statisticsId) {
                    totalScore2 += stat.value;
                }
            });
        });
        if (currValues.locationOfMatch.trim() === "") {
            errMsgs.push("Location of match is required.");
            if (!focusON) {
                window.scrollTo(0, 0);
                document.getElementById("locationOfMatch").focus();
                focusON = true; 
            }
        }
        if (isNaN(dateObj)) {
            errMsgs.push('Date of match is required');
            if (!focusON) {
                window.scrollTo(0, 0);
                document.getElementById("dateOfMatch").focus();
                focusON = true; 
            }
        }
        if (currValues.dateOfMatch > formattedDateTime) {
            errMsgs.push("Date of match cannot be later than the current date."); 
            if (!focusON) {
                window.scrollTo(0, 0);
                document.getElementById("dateOfMatch").focus();
                focusON = true; 
            }
        }
        if (currValues.finalScore1 !== null && currValues.finalScore2 !== null) {
            if ((matchesToUpdate1.length === 0 && !currValues.disableInput1) || (matchesToUpdate2.length === 0 && !currValues.disableInput2)) {
                errMsgs.push("The details of your team's players for this match are required."); 
                if (!focusON) {
                    window.scrollTo(0, 0);
                    focusON = true; 
                }
            }
        }
        if (currValues.finalScore1 > 0 || currValues.finalScore2 > 0) {
            if ((!matchesToUpdate1[0].statistics && !currValues.disableInput1) || (!matchesToUpdate2[0].statistics && !currValues.disableInput2)) {
                errMsgs.push("The statistics of your team's players for this match are required."); 
                if (!focusON) {
                    window.scrollTo(0, 0);
                    focusON = true; 
                }
            }
        }
        if (currValues.finalScore2 !== null && currValues.finalScore2 > 0 && matchesToUpdate2.statistics === null) {
            errMsgs.push("The statistics of your team's players for this match are required.");
            if (!focusON) {
                window.scrollTo(0, 0);
                focusON = true; 
            }
        }
        
        if ((currValues.finalScore1 !== totalScore1 && !currValues.disableInput1) || (currValues.finalScore2 !== totalScore2 && !currValues.disableInput2)) {
            errMsgs.push("The sum of the total scores of the players does not match the final score entered.");    
            if (!focusON) {
                window.scrollTo(0, 0);
                focusON = true; 
            }
        }
        setErrorMessage(errMsgs);
        if (errMsgs.length > 0) {
            errResp = true;
        }
        return errResp; 
    }
  return (
    <div className="d-flex container mt-3 justify-content-center" >
      <Card style={{ width: "60rem", padding: 20 }}>
      {isLoading && (
          <div className="loading-overlay">
            <div style={{color: 'black'}}>Loading...</div>
            <div className="loading-spinner"></div>
          </div>
        )}
      {errorMessage.length > 0 && (
            <div className="alert alert-danger mb-3 p-1">
                {errorMessage.map((err, index) => (
                    <p className="mb-0" key={index}>{err}</p>
                ))}
            </div>
        )}
        { !isSignedIn && (
            <div>
                {checkIfUserIsSignedIn()}
            </div>
        )}
        <form action="">
            <div className="col mb-3 text-center">
                <div className="row justify-content-center mb-3">
                    <div className="col-4">
                        <h4 className="text-xl-center text-uppercase fw-bolder">{currValues.teamName1}</h4>
                    </div>
                    <div className="col-1">
                        <h6 className="text-lg-center fw-bold">VS</h6>
                    </div>
                    <div className="col-4">
                        <h4 className="text-xl-center text-uppercase fw-bolder">{currValues.teamName2}</h4>
                    </div>
                </div>
                <div className="row justify-content-center mb-2">
                    <div className="col-2">
                        <input name="finalScore1" type="number" min="0" className="form-control" value={currValues.finalScore1} onChange={handleMatchDetails} />
                    </div>
                    <div className="col-3">
                        <p className="text-lg-center fw-bold">Final Score</p>
                    </div>
                    <div className="col-2">
                        <input name="finalScore2" type="number" min="0" className="form-control" value={currValues.finalScore2} onChange={handleMatchDetails} />
                    </div>
                </div>
                { isAdmin && location.pathname.substring(1,6).toLowerCase() === "admin" && (
                    <div className="row justify-content-center mb-2">
                        <div className="col-2">
                            <input name="finalScorePending1" type="number" min="0" className="form-control" value={currValues.finalScorePending1} onChange={handleMatchDetails} />
                        </div>
                        <div className="col-3">
                            <p className="text-lg-center fw-bold">Final Score (Pending)</p>
                        </div>
                        <div className="col-2">
                            <input name="finalScorePending2" type="number" min="0" className="form-control" value={currValues.finalScorePending2} onChange={handleMatchDetails} />
                        </div>
                    </div>
                ) }
                <div className="row justify-content-center mb-3">
                    <div className="col-2">
                        <input name="leaguePoints1" type="number" min="0" className="form-control" value={currValues.leaguePoints1} onChange={handleMatchDetails} />
                    </div>
                    <div className="col-3">
                        <p className="text-lg-center fw-bold">League Points</p>
                    </div>
                    <div className="col-2">
                        <input name="leaguePoints2" type="number" min="0" className="form-control" value={currValues.leaguePoints2} onChange={handleMatchDetails} />
                    </div>
                </div>
                { isAdmin && location.pathname.substring(1,6).toLowerCase() === "admin" && (
                    <div className="row justify-content-center mb-2">
                        <div className="col-2">
                            <input name="leaguePointsPending1" type="number" min="0" className="form-control" value={currValues.leaguePointsPending1} onChange={handleMatchDetails} />
                        </div>
                        <div className="col-3">
                            <p className="text-lg-center fw-bold">League Points (Pending)</p>
                        </div>
                        <div className="col-2">
                            <input name="leaguePointsPending2" type="number" min="0" className="form-control" value={currValues.leaguePointsPending2} onChange={handleMatchDetails} />
                        </div>
                    </div>
                ) }
                <div className="row justify-content-center mt-5 mb-3">
                    <div className="col-6 mb-3 text-start">
                        <label htmlFor="locationOfMatch" className="form-label text-left">
                            Location of Match
                        </label>
                        <input id="locationOfMatch" name="locationOfMatch" type="text" className="form-control" value={currValues.locationOfMatch} onChange={handleMatchDetails} />
                    </div>
                    <div className="col-3 mb-3 text-start">
                        <label htmlFor="dateOfMatch" className="form-label">
                            Date and Time of Match
                        </label>
                        <input id="dateOfMatch" name="dateOfMatch" type="datetime-local" className="form-control" value={currValues.dateOfMatch} onChange={handleMatchDetails} />
                    </div>
                </div>
            </div>

            <br/><br/><br/>
            <div>
                <p className="fw-bold row justify-content-center">Players&apos; Statistics : {currValues.teamName1}</p>
            </div>
            <div className="row justify-content-center">
                <table className="table table-hover w-auto text-center" >
                    <thead>
                        <tr>
                            <th >Username</th>
                            <th >Full name</th>
                            {statistics.map((stat) =>       
                                <th key={stat.statisticsId}>{stat.statShortDesc}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {matchesToUpdate1.map((player, index) => (
                            <tr key={player.playerId}>
                                <td style={{ width: "10rem"}}>{player.userName}</td>
                                <td style={{ width: "15rem"}}>{player.fullName}</td>
                                {statistics.map((stat) =>       
                                    <td key={stat.statisticsId} > 
                                        <input name="stat" value={playerStat(stat.statisticsId,player.statistics)} type="number" min="0" onChange={(e) => onChangeStat(e, player.playerId, stat.statisticsId, 1)} style={{ width: "3rem"}} disabled={currValues.disableInput1}/>
                                    </td>
                                )}
                                <td><FaTrash className="m-auto" onClick={() => handleRemoveRow(index, 1)} disabled={currValues.disableInput1}/></td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <input id="userName1" name="userName1" type="text" value={findUsername[0]} onChange={(e) => handleAddUsername(e, 1)} disabled={currValues.disableInput1} placeholder="Type a username" style={{ width: "10rem"}} />
                            </td>
                            <td style={{ width: "15rem"}} />
                            {statistics.map((stat) =>       
                                <td key={stat.statisticsId} style={{ width: "3rem"}} />
                            )}
                            <td><FaSearchPlus className="m-auto" onClick={()=> handleAddRow(findUsername[0], 1)} /></td>  
                        </tr>
                    </tbody>
                </table>
            </div>

            <br/><br/><br/>
            <div>
                <p className="fw-bold row justify-content-center">Players&apos; Statistics : {currValues.teamName2}</p>
            </div>
            <div className="row justify-content-center">
                <table className="table table-hover w-auto text-center" >
                    <thead>
                        <tr>
                            <th >Username</th>
                            <th >Full name</th>
                            {statistics.map((stat) =>       
                                <th key={stat.statisticsId}>{stat.statShortDesc}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {matchesToUpdate2.map((player, index) => (
                            <tr key={player.playerId}>
                                <td style={{ width: "10rem"}}>{player.userName}</td>
                                <td style={{ width: "15rem"}}>{player.fullName}</td>
                                {statistics.map((stat) =>       
                                    <td key={stat.statisticsId} > 
                                        <input name="stat" value={playerStat(stat.statisticsId,player.statistics)} type="number" min="0" onChange={(e) => onChangeStat(e, player.playerId, stat.statisticsId, 2)} style={{ width: "3rem"}} disabled={currValues.disableInput2}/>
                                    </td>
                                )}
                                <td><FaTrash className="m-auto" onClick={() => handleRemoveRow(index, 2)} disabled={currValues.disableInput2}/></td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <input id="userName2" name="userName2" type="text" value={findUsername[1]} onChange={(e) => handleAddUsername(e, 2)} disabled={currValues.disableInput2} placeholder="Type a username" style={{ width: "10rem"}} />
                            </td>
                            <td style={{ width: "15rem"}} />
                            {statistics.map((stat) =>       
                                <td key={stat.statisticsId} style={{ width: "3rem"}} />
                            )}
                            <td><FaSearchPlus className="m-auto" onClick={()=> handleAddRow(findUsername[1], 2)} /></td>  
                        </tr>
                    </tbody>
                </table>
            </div>


            <br/><br/><br/>
            <div className="row justify-content-center mt-5">
                <button className="btn btn-dark col-2 mx-5" type="button" onClick={navigateUpdate}>
                    Update
                </button>
                <button type="button" className="btn btn-outline-secondary col-2" onClick={navigateCancel}>
                    Cancel
                </button>
            </div>
        </form>
      </Card>
    </div>
  );
};

export default MatchUpdate;
