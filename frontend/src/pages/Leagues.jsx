import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'; 
import LeagueCard from "../components/LeagueCard";
import useAuth from "../hooks/auth";

const backend = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://panicky-robe-mite.cyclic.app';

export default function Leagues() {
  const [leagues, setLeagues] = useState(null); 
  const navigate = useNavigate();
  const { isSignedIn  } = useAuth()
  const navigateCreateLeague = () => {
    navigate("/createleague");
  };

  const fetchLeagues = async () => {
    try {
      const response = await fetch(`${backend}/leagues`);
      const data = await response.json();
      setLeagues(data.details);  
      console.log(data.details);
    } catch (error) {
      console.error('Error fetching top leagues data:', error);
    }
  };

  useEffect(() => {
    fetchLeagues(); 
  }, []);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingInline: 30,
          width: "100%",
          alignSelf: "center",
          justifyContent: "center",
          paddingTop: "2%",
        }}
      >
        <div className="d-flex justify-content-between w-100  align-items-end">
          <div className="d-flex ">
            {/* <i className="bi bi-filter"></i>
            <p>Filter</p> */}
          </div>
          <div>
            <h1 style={{marginLeft: '50%'}}>LEAGUES</h1>
          </div>
          <div className="d-flex">
            { isSignedIn && (
              <div className="d-flex align-items-end">
                <button
                  type="button mh-25"
                  className="btn  btn-secondary"
                  onClick={navigateCreateLeague}
                >
                  <i className="bi bi-plus">Create League</i>
                </button>
              </div>
            )}
            <div
              style={{ width: 1, marginInline: 5, backgroundColor: "#666869" }}
            ></div>

            <div>
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    border: "1px solid rgba(0, 0, 0, 0.5)",
                    backgroundColor: "#00ad43",
                    margin: 3,
                  }}
                ></div>
                <p className="m-0 p-0">Ongoing</p>
              </div>
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    border: "1px solid rgba(0, 0, 0, 0.5)",
                    backgroundColor: "#7a7a7a",
                    margin: 3,
                  }}
                ></div>
                <p className="m-0 p-0">Finished</p>
              </div>
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,

                    backgroundColor: "#ffffff",
                    margin: 3,
                    border: "1px solid rgba(0, 0, 0, 0.5)",
                  }}
                ></div>
                <p className="m-0 p-0">Open</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
      <div>
        {leagues &&
          leagues.map((league, index) => (
            <LeagueCard
              key={league.leagueId} 
              name={league.leagueName}
              teams={league.teams}
              status={league.status}
              totalTeams={league.teams.length}
              teamsJoined={league.numberOfTeams}
              startDate={league.startDate}
              endDate={league.endDate}
              expanded={index === 0}
              leagueAdmin={league.createdByName}
              pastMatches={league.matches}
              onClick={() => {
                navigate(`/league/${league.leagueId}`);
              }}
            />
          ))}
      </div>
      </div>
    </>
  );
}
