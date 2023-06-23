import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';

const CreateLeague = () => {
  
    const navigate = useNavigate(); 
    const navigateLeagues = () => { navigate('/leagues') }
    const navigateLeagueDetails = () => { navigate('/league') }

  return (
    <div className="card">
      <Card style={{ width: "80rem", padding: 20 }}>
        <h2 className="mb-4 center-text">CREATE LEAGUE</h2>
        <form action="">
            < div className="col-sm-4 mb-4">
                <label htmlFor="banner" className="form-label">
                    Select Banner
                </label>
                <button id="banner" type="button" className="btn btn-secondary" >
                    Select image
                </button>
            </div> 
          <div className="row ">
            <div className="col-sm-4 mb-2">
                <label htmlFor="username" className="form-label">
                    Name of League*
                </label>
                <input id="username" type="text" className="form-control" />
            </div>
            <div className="col-sm-4 mb-2">
                <label htmlFor="sports" className="form-label">
                    Sport*
                </label>
                <select id="sports" type="text" className="form-control" />
            </div>
            < div className="col-sm-4 mb-4">
                <label htmlFor="logo" className="form-label">
                    Select Logo
                </label>
                <button id="logo" type="button" className="btn btn-secondary" >
                    Select image
                </button>
            </div>
          </div>
          <div className="col-sm-8 mb-2">
                <label htmlFor="description" className="form-label">
                    Description/Rules
                </label>
            <textarea name="description" className="form-control form-control-sm" />
          </div>
          <div className="row">
            <div className="col-sm-4 mb-2">
                <label htmlFor="location" className="form-label">
                    Location*
                </label>
                <input id="location" type="text" className="form-control" />
            </div>
            <div className="col-sm-4 mb-2">
                <label htmlFor="division" className="form-label">
                    Division
                </label>
                <input id="division" type="text" className="form-control" />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4 mb-2">
                <label htmlFor="age" className="form-label">
                    Age*
                </label>
                <input id="age" type="text" className="form-control" placeholder="18-35"/>
            </div>
            <div className="col-sm-4 mb-2">
                <label htmlFor="startDate" className="form-label">
                    Start Date*
                </label>
                <input id="startDate" type="date" className="form-control" />
            </div>
            <div className="col-sm-4 mb-2">
                <label htmlFor="endDate" className="form-label">
                    End Date*
                </label>
                <input id="endDate" type="date" className="form-control" />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4 mb-2">
                <label htmlFor="teams" className="form-label">
                    Number of Teams
                </label>
                <input id="teams" type="number" min="3" value="3" className="form-control" />
            </div>
            <div className="col-sm-4 mb-2">
                <label htmlFor="rounds" className="form-label">
                    Number of Rounds
                </label>
                <input id="rounds" type="number" min="3" max="10" value="1" className="form-control" />
            </div>
          </div>
          <div className="d-flex justify-content-evenly width:10% mb-4">
            <button className="btn btn-dark" type="button" onClick={navigateLeagueDetails}>
              Create League
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={navigateLeagues}>
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateLeague;
