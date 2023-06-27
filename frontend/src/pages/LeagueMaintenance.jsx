import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useLocation } from 'react-router-dom';

const LeagueMaintenance = () => {
  
    const [action, handleAction] = useState({type: "Creation", title: "CREATE LEAGUE"});
    const location = useLocation();
    useEffect(() => {
        const url = location.pathname.substring(1,7).toLowerCase()
        console.log(url)
        if (url === "create") {
            handleAction({type: "Creation", title: "Create League"})
        } else {
            handleAction({type: "Update", title: "Update League", protectSport: "true", protectRounds: "true"})
            // cannot amend sport if it has team/s
            // cannot amend number of rounds is status is ST/EN.
        }
    }, []);

    const navigate = useNavigate(); 
    const navigateCancel = () => {
        if (action.type === "Creation") {
            navigate('/leagues')
        } else {
            navigate('/league/648e9013466c1c995745907c')   // temp id only 
        } 
    }
    const navigateLeagueDetails = () => { navigate('/league/648e9013466c1c995745907c') }    // temp id only  

  return (
    <div className="d-flex container mt-2 justify-content-center">
      <Card style={{ width: "60rem", padding: 20 }}>
        <h2 className="mb-4 center-text">{action.title.toUpperCase()}</h2>
        <form action="">
            < div className="col mb-5 text-center">
                <label htmlFor="banner" className="form-label mb-1">
                    Select Banner
                </label>
                <img id="banner" className="center-block img-fluid object-fit-cover rounded mw-100" style={{ width: "100rem", height: "10rem"}} src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW1lcmljYW4lMjBmb290YmFsbHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" alt="League Banner" />
                <button id="banner" type="button" className="btn btn-secondary mt-2" >
                    Select image
                </button>
            </div>
            <div className="row">
            <div className="col-sm-9 mb-3"> 
          <div className="row">
            <div className="col-sm-7 mb-3">
                <label htmlFor="username" className="form-label">
                    Name of League*
                </label>
                <input id="username" type="text" className="form-control" />
            </div>
            <div className="col-sm-4 mb-3">
                <label htmlFor="sports" className="form-label">
                    Sport*
                </label>
                <select id="sports" type="text" className="form-control" disabled={action.protectSport}/>
            </div>
          </div>
          <div className="col-sm-11 mb-3">
                <label htmlFor="description" className="form-label">
                    Description/Rules
                </label>
            <textarea name="description" className="form-control form-control-sm" />
          </div>
          <div className="row">
            <div className="col-sm-7 mb-3">
                <label htmlFor="location" className="form-label">
                    Location*
                </label>
                <input id="location" type="text" className="form-control" />
            </div>
            <div className="col-sm-4 mb-3">
                <label htmlFor="division" className="form-label">
                    Division
                </label>
                <input id="division" type="text" className="form-control" />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 mb-3">
                <label htmlFor="startDate" className="form-label">
                    Start Date*
                </label>
                <input id="startDate" type="date" className="form-control" />
            </div>
            <div className="col-sm-3 mb-3 mx-3">
                <label htmlFor="endDate" className="form-label">
                    End Date*
                </label>
                <input id="endDate" type="date" className="form-control" />
            </div>
            <div className="col-sm-2 mb-3 mx-4">
                <label htmlFor="age" className="form-label">
                    Age Group*
                </label>
                <input id="age" type="text" className="form-control" placeholder="18-35"/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 mb-3">
                <label htmlFor="teams" className="form-label">
                    Number of Teams
                </label>
                <input id="teams" type="number" min="3" value="3" className="form-control" />
            </div>
            <div className="col-sm-3 mb-3 mx-3">
                <label htmlFor="rounds" className="form-label">
                    Number of Rounds
                </label>
                <input id="rounds" type="number" min="1" max="10" value="1" className="form-control" disabled={action.protectRounds}/>
            </div>
          </div>
          </div>
          < div className="col-sm-3 mb-3 text-center">
                <label htmlFor="logo" className="form-label">
                    Select Logo
                </label>
                <img id="logo" className="img-thumbnail mb-3" src="https://images.unsplash.com/photo-1599204606395-ede983387d21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="League Logo" />
                <button id="logo" type="button" className="btn btn-secondary" >
                    Select image
                </button>
            </div>
            </div>
          <div className="row justify-content-center">
            <button className="btn btn-dark col-2 mx-5" type="button" onClick={navigateLeagueDetails}>
              {action.title}
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

export default LeagueMaintenance;
