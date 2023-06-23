import Button from 'react-bootstrap/Button'; 
//import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const Search = () => {

    const [teamFilter, handleTeamFilter] = useState(false);
    const [playerFilter, handlePlayerFilter] = useState(false);
    const [leagueFilter, handleLeagueFilter] = useState(false);
    const [teamButton, handleTeamButton] = useState("secondary");
    const [playerButton, handlePlayerButton] = useState("secondary");
    const [leagueButton, handleLeagueButton] = useState("secondary");
    const [searchText, changeText] = useState("");
    const [searchLocation, changeLocation] = useState("");

    const handleFilter = (filter) => {
      if (filter === "Teams") {
        handleTeamFilter(!teamFilter);
        if (teamFilter === true) {
            handleTeamButton("secondary")
        } else {
            handleTeamButton("primary")
        }
      } else if (filter === "Players") {
        handlePlayerFilter(!playerFilter);
        if (playerFilter === true) {
            handlePlayerButton("secondary")
        } else {
            handlePlayerButton("primary")
        }
      } else {
        handleLeagueFilter(!leagueFilter);
        if (leagueFilter === true) {
            handleLeagueButton("secondary")
        } else {
            handleLeagueButton("primary")
        }
      }
    };

    const handleSearchText = (input) => {changeText(input.target.value)}
    const handleSearchLocation = (input) => {changeLocation(input.target.value)}

  return (
    <div className="App">
        <div className="row">
            <div className="col">
                <input type="text" className="form-control" value = {searchText} onChange={handleSearchText} 
                    placeholder="Search for teams, players, or leagues"/>
            </div>
            <div className="col">
                <input type="text" className="form-control" value = {searchLocation} onChange={handleSearchLocation} 
                    placeholder="Search by location"/>
            </div>
        </div>
        <div className="container my-3 bg-light">
            <div className="col-md-7 text-center">
                <Button onClick={() => handleFilter('Teams')} variant={teamButton}>Teams</Button>
                <Button onClick={() => handleFilter('Players')} variant={playerButton}>Players</Button>
                <Button onClick={() => handleFilter('Leagues')} variant={leagueButton}>Leagues</Button>
            </div>
        </div>
    </div>
  );
}

export default Search;