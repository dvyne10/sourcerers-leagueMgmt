import {Button, Row, Col} from 'react-bootstrap'; 
import { useState } from 'react';
import {FaSearch, FaFilter } from 'react-icons/fa';

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";

const Search = () => {

    const [teamFilter, handleTeamFilter] = useState(false);
    const [playerFilter, handlePlayerFilter] = useState(false);
    const [leagueFilter, handleLeagueFilter] = useState(false);
    const [teamButton, handleTeamButton] = useState("secondary");
    const [playerButton, handlePlayerButton] = useState("secondary");
    const [leagueButton, handleLeagueButton] = useState("secondary");
    const [searchText, changeText] = useState("");
    const [searchLocation, changeLocation] = useState("");
    const [filterShow, setFilterShow] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterInd, setFilterInd] = useState({player: false, team: false, league: false, basket: false, soccer: false});
    const [filterButtons, setFilterButtons] = useState({player: "outline-secondary", team: "outline-secondary", league: "outline-secondary", basket: "outline-secondary", soccer: "outline-secondary"});

    const handleFilter = (filter) => {
      let currButton
      if (filter === "Teams") {
        currButton = !teamFilter
        handleTeamFilter(currButton);
        currButton ? handleTeamButton("primary") : handleTeamButton("secondary")
      } else if (filter === "Players") {
        currButton = !playerFilter
        handlePlayerFilter(currButton);
        currButton ? handlePlayerButton("primary") : handlePlayerButton("secondary")
      } else {
        currButton = !leagueFilter
        handleLeagueFilter(currButton);
        currButton ? handleLeagueButton("primary") : handleLeagueButton("secondary")
      }
    };

    const handleResultFilter = (filter) =>{
      let filterIndicators = {...filterInd}
      if (filter === "Teams") {
        filterIndicators.team = !filterIndicators.team
        filterIndicators.player = filterIndicators.team ? false : filterIndicators.player,
        filterIndicators.league = filterIndicators.team ? false : filterIndicators.league,
        setFilterButtons({...filterButtons, team: filterIndicators.team ? "secondary" : "outline-secondary",
          player: filterIndicators.team ? "outline-secondary" : filterButtons.player,
          league: filterIndicators.team ? "outline-secondary" : filterButtons.league,
        })
      } else if (filter === "Players") {
        filterIndicators.player = !filterIndicators.player
        filterIndicators.team = filterIndicators.player ? false : filterIndicators.team,
        filterIndicators.league = filterIndicators.player ? false : filterIndicators.league,
        setFilterButtons({...filterButtons, player: filterIndicators.player ? "secondary" : "outline-secondary",
          team: filterIndicators.player ? "outline-secondary" : filterButtons.team,
          league: filterIndicators.player ? "outline-secondary" : filterButtons.league,
        })
      } else if (filter === "Leagues"){
        filterIndicators.league = !filterIndicators.league
        filterIndicators.player = filterIndicators.league ? false : filterIndicators.player,
        filterIndicators.team = filterIndicators.league ? false : filterIndicators.team,
        setFilterButtons({...filterButtons, league: filterIndicators.league ? "secondary" : "outline-secondary",
          player: filterIndicators.league ? "outline-secondary" : filterButtons.player,
          team: filterIndicators.league ? "outline-secondary" : filterButtons.team,
        })
      }
      if (filter === "Basketball") {
        filterIndicators.basket = !filterIndicators.basket
        setFilterButtons({...filterButtons, basket: filterIndicators.basket ? "secondary" : "outline-secondary"})
      } else if (filter === "Soccer") {
        filterIndicators.soccer = !filterIndicators.soccer
        setFilterButtons({...filterButtons, soccer: filterIndicators.soccer ? "secondary" : "outline-secondary"})
      } 
      let newList = [...data]
      if (filterIndicators.team) {
        newList = newList.filter(row => row.type === "team")
      }
      if (filterIndicators.player) {
        newList = newList.filter(row => row.type === "player")
      }
      if (filterIndicators.league) {
        newList = newList.filter(row => row.type === "league")
      }
      if (filterIndicators.basket) {
        newList = newList.filter(row => row.sports.includes("Basketball"))
      }
      if (filterIndicators.soccer) {
        newList = newList.filter(row => row.sports.includes("Soccer"))
      }
      setFilterInd(filterIndicators)
      setFilteredData(newList)
    };

    const setFilterButton = () =>{
      setFilterShow(!filterShow)
    }

    const handleSearchText = (input) => {changeText(input.target.value)}
    const handleSearchLocation = (input) => {changeLocation(input.target.value)}
    const setSearchValues = () => {
      fetch(`${backend}/search?findtext=${searchText}&location=${searchLocation}&teamfilter=${teamFilter}&playerfilter=${playerFilter}&leaguefilter=${leagueFilter}`)
      .then(response => response.json())
      .then(resp => {
        if (resp.requestStatus === 'ACTC') {
          setData(resp.details)
          setFilteredData(resp.details)
        } else {
          setData([])
          setFilteredData([])
        }
        setFilterInd({player: false, team: false, league: false, basket: false, soccer: false})
        setFilterButtons({player: "outline-secondary", team: "outline-secondary", league: "outline-secondary", basket: "outline-secondary", soccer: "outline-secondary"})
        setFilterShow(false)
      })
    }

return (
  <>
  <h1 className='center-header'>SEARCH</h1>
  <div className='bg-light container justify-content-center align-items-center text-center'>
    <form id="search-form" className="form-inline" role="form" method="get" action="">
    <div className="input-group">
        <input type="text" className="w-50 form-control search-form" value = {searchText} onChange={handleSearchText} 
                    placeholder="Search for teams, players, or leagues" />
        <button type='button' className="btn btn-primary me-2 search-btn" onClick={ () => setSearchValues() } style={{"borderTopRightRadius":"50%","borderBottomRightRadius":"50%" }} >
          <FaSearch className='search-btn'/></button>
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
  </div>
  <div className='mx-auto w-75'>
    <div className='search-list'> 
      <Row>
        <Col className="col-4"><h2 className='text-center mt-3'><Button size="sm" variant="outline-secondary" onClick={setFilterButton}>
              <FaFilter></FaFilter>Filter Results
            </Button></h2>
            {filterShow &&
              <Col className='text-center'>
                <Button size="sm" className='me-2' onClick={()=>{handleResultFilter("Teams")}} variant={filterButtons.team}>Teams</Button>
                <Button size="sm" className='me-2' onClick={()=>{handleResultFilter("Leagues")}} variant={filterButtons.league}>Leagues</Button>
                <Button size="sm" className='me-2' onClick={()=>{handleResultFilter("Players")}} variant={filterButtons.player}>Players</Button>
                <Button size="sm" className='me-2' onClick={()=>{handleResultFilter("Basketball")}} variant={filterButtons.basket}>Basketball</Button>
                <Button size="sm" className='me-2' onClick={()=>{handleResultFilter("Soccer")}} variant={filterButtons.soccer}>Soccer</Button>
              </Col>
            }
          </Col>
        <Col className="col-8"></Col>
      </Row>
      <ul>
        <Row className='mb-5 mt-5 text-center'>
          <Col>Name</Col>
          <Col>Location</Col>
          <Col>Status</Col>
          <Col className="text-center">Looking for Teams</Col>
          <Col className="text-center">Looking for Players</Col>
          <Col className="text-center">Sports Type</Col>
        </Row>
          {
            filteredData.map((list, index) => (
              <li key={index} className='border'>
                <a href={"/" + list.type + "/" + list.rowId} >
                  <Row className='search-list p-2 text-center'>
                    <Col>{list.name}</Col>
                    <Col>{list.location}</Col>
                    <Col>{list.statusDesc}</Col>
                    <Col>{(list.lookingForTeams === "N/A" ? "N/A" : (list.lookingForTeams ? "Yes" : "No"))}</Col>
                    <Col>{(list.lookingForPlayers === "N/A" ? "N/A" : (list.lookingForPlayers ? "Yes" : "No"))}</Col>
                    <Col>{list.sports}</Col>
                  </Row>
                </a>
              </li>
            ))
          }
      </ul>
    </div>
  </div>
  </>
);
}

export default Search;