import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const LeagueMaintenance = () => {
  
    const [action, handleAction] = useState({type: "Creation", title: "CREATE LEAGUE"});
    const [currValues, setCurrentValues] = useState({leagueName: null, description: null, location: null,
        division: null, startDate: null, endDate: null, ageGroup: null, teamsNo: "3", roundsNo: "1", 
        // teamsList: []
        teamsList: [ { teamId: null, teamName: null, approvedBy: null, joinedOn: null, action: null } ]
    })
    const [sportSelected, setSportSelected] = useState("")
    const location = useLocation();
    const routeParams = useParams();
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [logoURL, setLogoURL] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [bannerURL, setBannerURL] = useState(null);
    const sportsOptions = [ {label: "Soccer", value: "soccerId"}, {label: "Basketball", value: "basketId"} ]
    const [disableDelete, setDeleteButton] = useState(true)

    useEffect(() => {
        const url = window.location.pathname.substring(1,7).toLowerCase()
        if (url === "create") {
            handleAction({type: "Creation", title: "Create League"})
        } else {
            handleAction({type: "Update", title: "Update League", protectSport: true, protectRounds: true})
            // cannot amend sport if it has team/s
            // cannot amend number of rounds is status is ST/EN.
            setCurrentValues({leagueName: "York League 2023", description: "A community league aimed to build solidarity.", location: "York, Ontario, CA",
                division: "mixed", startDate: "2023-07-08", endDate: "2023-07-31", ageGroup: "18-25", teamsNo: "15", roundsNo: "2",
                teamsList : [
                    { teamId: 1, teamName: "Vikings", approvedBy: "Hayes Lawson", joinedOn: "2022-07-01", action: "Remove", toRemove: false },
                    { teamId: 2, teamName: "Dodgers", approvedBy: "Cain Nunez", joinedOn: "2022-07-02", action: "Remove", toRemove: false  },
                    { teamId: 3, teamName: "Warriors", approvedBy: "Heidi Trevino", joinedOn: "2022-07-03", action: "Remove", toRemove: false  },
                    { teamId: 4, teamName: "Tigers", approvedBy: "Timon Kane", joinedOn: "2022-07-04", action: "Remove", toRemove: false  },
                    { teamId: 5, teamName: "Giants", approvedBy: "Tim Gibson", joinedOn: "2022-07-05", action: "Remove", toRemove: false  },
                ],
            })
            setSportSelected("basketId")
            setLogoURL("https://images.unsplash.com/photo-1685115560482-7ec4fb23414c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=881&q=80")
            setSelectedLogo("x")
            setBannerURL("https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW1lcmljYW4lMjBmb290YmFsbHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80")
            setSelectedBanner("x")
            // setDeleteButton(false)
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

    const handleSportChange= event => {
        setSportSelected(event.target.value);
    }

    const handleRemoveTeams = (index, e) => {
        e.preventDefault();
        let newList = [...currValues.teamsList]
        if (newList[index].action === "Remove" ) {
            newList[index].toRemove = true
            newList[index].action = "Cancel"
            console.log("1")
        } else {
            newList[index].toRemove = false
            newList[index].action === "Remove"
            console.log("2")  // executed but value doesn't change
        }
        setCurrentValues({ teamsList: newList })
    }

    const navigate = useNavigate(); 
    const navigateCancel = () => {
        if (action.type === "Creation") {
            navigate('/leagues')
        } else {
            navigate('/league/' + routeParams.leagueid)
        } 
    }
    const navigateLeagueDetails = () => { navigate('/league/' + routeParams.leagueid) }

    const navigateDelete = () => {
        let count = (currValues.teamsList === null ? 0 : 1)
        if (count !== 0) {
            alert("You cannot delete a league that has team/s or game history.")
        } else {
            if (confirm("Please confirm if you want to proceed with league deletion.")) {
                navigate('/league/' + routeParams.leagueid)
            } else {
                console.log("Deletion cancelled")
            }
        }
    }

    const navigateSubmitRequest = () => {
        let count = 0;
        // let newList = [...currValues.teamsList]
        // newList.map(team => count += (team.toRemove === true ? 1 : 0))
        // if (count === 0) {
        //     alert("Nothing to request.")
        // } else {
            if (confirm("Please confirm if you want to proceed to request removal of the team/s. \nThis request shall need at least half of the team admins' approval.")) {
                navigate('/league/' + routeParams.leagueid)
            } else {
                console.log("Request submission cancelled")
            }
        //}
    }

  return (
    <div className="d-flex container mt-2 justify-content-center">
      <Card style={{ width: "60rem", padding: 20 }}>
        <h2 className="mb-4 center-text">{action.title.toUpperCase()}</h2>
        <form action="">
            < div className="col mb-5 text-center">               
                <label htmlFor="banner" className="form-label mb-1">
                    Select Banner
                </label>
                {selectedBanner && (
                    <div>
                        <img src={bannerURL} alt="League Banner" className="object-fit-cover rounded mw-100 mb-2" style={{ width: "100rem", height: "10rem"}}/>
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
            <div className="row">
            <div className="col-sm-9 mb-3"> 
          <div className="row">
            <div className="col-sm-7 mb-3">
                <label htmlFor="leagueName" className="form-label">
                    Name of League*
                </label>
                <input id="leagueName" type="text" className="form-control" defaultValue={currValues.leagueName} />
            </div>
            <div className="col-sm-4 mb-3">
                <label htmlFor="sports" className="form-label">
                    Sport*
                </label>
                <select id="sports" className="form-control" value={sportSelected} onChange={handleSportChange} disabled={action.protectSport}>
                    {sportsOptions.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
          </div>
          <div className="col-sm-11 mb-3">
                <label htmlFor="description" className="form-label">
                    Description/Rules
                </label>
            <textarea name="description" className="form-control form-control-sm" defaultValue={currValues.description} />
          </div>
          <div className="row">
            <div className="col-sm-7 mb-3">
                <label htmlFor="location" className="form-label">
                    Location*
                </label>
                <input id="location" type="text" className="form-control" defaultValue={currValues.location} />
            </div>
            <div className="col-sm-4 mb-3">
                <label htmlFor="division" className="form-label">
                    Division
                </label>
                <input id="division" type="text" className="form-control" defaultValue={currValues.division} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 mb-3">
                <label htmlFor="startDate" className="form-label">
                    Start Date*
                </label>
                <input id="startDate" type="date" className="form-control" defaultValue={currValues.startDate} />
            </div>
            <div className="col-sm-3 mb-3 mx-3">
                <label htmlFor="endDate" className="form-label">
                    End Date*
                </label>
                <input id="endDate" type="date" className="form-control" defaultValue={currValues.endDate} />
            </div>
            <div className="col-sm-2 mb-3 mx-4">
                <label htmlFor="ageGroup" className="form-label">
                    Age Group*
                </label>
                <input id="ageGroup" type="text" className="form-control" placeholder="18-35" defaultValue={currValues.ageGroup} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 mb-3">
                <label htmlFor="teams" className="form-label">
                    Number of Teams
                </label>
                <input id="teams" type="number" min="3" className="form-control" defaultValue={currValues.teamsNo} />
            </div>
            <div className="col-sm-3 mb-3 mx-3">
                <label htmlFor="rounds" className="form-label">
                    Number of Rounds
                </label>
                <input id="rounds" type="number" min="1" max="10" className="form-control" defaultValue={currValues.roundsNo} disabled={action.protectRounds}/>
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
          <div className="row justify-content-center">
            <button className="btn btn-dark col-2 mx-5" type="button" onClick={navigateLeagueDetails}>
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
            { action.type === "Update" && currValues.teamsList.length !== 0 && (
                <div>
                    <div>
                        <br/><br/>
                        <h5 className="mt-5 text-center"><u>Submit Request to Remove Teams</u></h5>
                        <table className="table table-hover text-center mt-2">
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>Approved By</th>
                                <th>Date Joined</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currValues.teamsList.map((team, index) =>       
                                <tr key={team.teamId}>
                                    <td>{team.teamName}</td>
                                    <td>{team.approvedBy}</td>
                                    <td>{team.joinedOn}</td>
                                    <td><button className = "btn btn-danger btn-sm" onClick={(e) => handleRemoveTeams(index, e)}>{team.action}</button></td>
                                </tr>) 
                            }
                        </tbody>
                        </table>
                    </div>
                    <div className="row justify-content-center mt-5">
                        <button className="btn btn-warning col-3 mx-5" type="button" onClick={navigateSubmitRequest}>
                            Submit Removal Request
                        </button>
                        <button type="button" className="btn btn-outline-secondary col-2" onClick={navigateCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </form>
      </Card>
    </div>
  );
};

export default LeagueMaintenance;
