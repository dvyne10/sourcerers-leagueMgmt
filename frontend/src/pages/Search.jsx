import Button from 'react-bootstrap/Button'; 
//import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {FaSearch } from 'react-icons/fa';


const Search = () => {

    const [teamFilter, handleTeamFilter] = useState(false);
    const [playerFilter, handlePlayerFilter] = useState(false);
    const [leagueFilter, handleLeagueFilter] = useState(false);
    const [teamButton, handleTeamButton] = useState("secondary");
    const [playerButton, handlePlayerButton] = useState("secondary");
    const [leagueButton, handleLeagueButton] = useState("secondary");
    const [searchText, changeText] = useState("");
    const [searchLocation, changeLocation] = useState("");
    const [searchActive, setSearchActive] = useState(false);

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
    const Teams = [{
      id:1,
      name: "Real Madrid",
      numberOfPlayers: 23,
      location: "Toronto",
      sportsType : "Soccer"
      
    },{
      id:2,
      name: "Barcelona",
      numberOfPlayers: 23,
      location: "Toronto",
      sportsType : "Soccer"
      
    },{
      id:3,
      name: "Lakers",
      numberOfPlayers: 11,
      location: "Toronto",
      sportsType : "Basketball"
      
    },{
      id:4,
      name: "Bulls",
      numberOfPlayers: 123,
      location: "Toronto",
      sportsType : "Basketball"
      
    },{
      id:5,
      name: "No Name Team",
      numberOfPlayers: 15,
      location: "Toronto",
      sportsType : "Soccer"
      
    },];


  return (
<>
    <h1 className='center-header'>SEARCH</h1>
    <div className='bg-light container justify-content-center align-items-center text-center'>
    
    <form id="search-form" className="form-inline" role="form" method="get" action="">
    <div className="input-group">
        <input type="text" className="w-50 form-control search-form" value = {searchText} onChange={handleSearchText} 
                    placeholder="Search for teams, players, or leagues" />
        <button className="btn btn-primary me-2 search-btn" style={{"borderTopRightRadius":"50%","borderBottomRightRadius":"50%" }} ><FaSearch className='search-btn'
        onClick={ () => setSearchActive(true) }/>
		</button>
        {/* Location Search Item */}
        <input type="text" className="w-25 form-control search-form" value = {searchLocation} onChange={handleSearchLocation} 
                    placeholder="Search by location" /> 
        <div className="container my-3 bg-light justify-content-center align-items-center">
      <div className="col-md-7 justify-content-center align-items-center text-center mx-auto justify-content-center align-items-center">
             <Button className='me-2' onClick={() => handleFilter('Teams')} variant={teamButton}>Teams</Button>
            <Button className='me-2' onClick={() => handleFilter('Players')} variant={playerButton}>Players</Button>
           <Button className='me-2' onClick={() => handleFilter('Leagues')} variant={leagueButton}>Leagues</Button>
       </div>
        </div>
    </div>
</form>
<div>
{ searchActive === true &&
            <div>
          <ul className='teamUl'>
          {Teams.map(f => <li key={Teams.id}><a href="#">{f.name}</a></li>)}
          </ul>
        </div>
}

</div>
</div>

</>
  );
}

export default Search;