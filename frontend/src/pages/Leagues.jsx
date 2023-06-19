import Button from 'react-bootstrap/Button'; 
import { useNavigate } from 'react-router-dom';


export default function Leagues() {
  const navigate = useNavigate(); 
  const navigateCreateLeague = () => {
    navigate('/createLeague');
  }
  return (
    <>
    <div className="App" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "50px"}}>
      
      <h1>LEAGUES</h1>
      <Button onClick={navigateCreateLeague} variant="primary">Create League</Button>

    </div>
    </>
  );
}