import { useNavigate } from "react-router-dom";
import LeagueCard from "../components/LeagueCard";

export default function Leagues() {
  const navigate = useNavigate();
  const navigateCreateLeague = () => {
    navigate("/createleague");
  };
  return (
    <>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "50px",
        }}
      >
        <div className="d-flex justify-content-between w-100 p-3 align-items-end">
          <div className="d-flex ">
            <i className="bi bi-filter"></i>
            <p>Filter</p>
          </div>
          <div>
            <h1>LEAGUES</h1>
          </div>
          <div className="d-flex">
            <div className="d-flex align-items-end">
              <button
                type="button mh-25"
                className="btn btn-light"
                onClick={navigateCreateLeague}
              >
                <i className="bi bi-plus">Create League</i>
              </button>
            </div>
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
        <LeagueCard
          name={"first league"}
          status={"ongoing"}
          totalTeams={12}
          teamsJoined={12}
          expanded={true}
          onClick={() => {
            navigate("/league/123");
          }}
        />
        <LeagueCard
          name={"second league"}
          status={"finished"}
          totalTeams={12}
          teamsJoined={6}
          onClick={() => {
            navigate("/league/123");
          }}
        />
        <LeagueCard
          name={"third league"}
          status={"open"}
          totalTeams={12}
          teamsJoined={9}
          onClick={() => {
            navigate("/league/123");
          }}
        />
      </div>
    </>
  );
}
