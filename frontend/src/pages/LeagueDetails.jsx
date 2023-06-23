import Button from 'react-bootstrap/Button'; 
import { useNavigate } from 'react-router-dom';

const LeagueDetails = () => {

  const navigate = useNavigate(); 
  const navigateUpdateLeague = () => { navigate('/updateleague/648e9013466c1c995745907c') }   // temp id only

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "50px"}}>
      
      <h1>LEAGUE DETAILS PAGE</h1>
      <Button onClick={navigateUpdateLeague} variant="primary">Update League</Button>
    </div>
  );
}

export default LeagueDetails;