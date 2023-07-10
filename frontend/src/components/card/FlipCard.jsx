import './flipCard.css';
import './flipTransition.css';
import PropTypes from 'prop-types'; 
import { Link, useNavigate} from 'react-router-dom';
import Button from 'react-bootstrap/Button'; 

const FlipCard = ({onClick, imageUrl, cardText}) => {
    const navigate = useNavigate();

    const handleLeagueDetails = () => {
      navigate('/league/123'); 
    };

    const teams = [
        {id: '1', name: 'Dragon Fire', logo: '/dragon.jpg'},
        {id: '2', name: 'Real Madrid', logo: '/madrid.png'},
        {id: '3', name: 'Manchester United', logo: '/manchester.png'},
        {id: '4', name: 'We Go Together', logo: '/barcelona.png'}
    ];

    return (
        <div className="card-wrapper" onClick={onClick}>
            <div className="card-back">
                Teams
                <table>
                    <tbody>
                        {teams.map((team) => (
                            <tr className="team-row" key={team.id}>
                                <td className="logo-container">
                                    <img className="team-logo" src={team.logo} alt={team.name} />
                                </td>
                                <td className="team-link">
                                    <Link className="team-link" to={`/team/${team.id}`}>{team.name}</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Button onClick={handleLeagueDetails} style={{marginTop: '50%', backgroundColor: '#D1E8E2', color: '#2C3531', borderColor: '#2C3531'}} className="league-detail-btn">League Details</Button>
            </div>
    
            <div className="card-front" style={{backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover'}}>
                {cardText}
                <div className="overlay">
                    Click to flip!
                </div>
            </div>
        </div>
    );
}

FlipCard.propTypes = {
    onClick: PropTypes.func,
    imageUrl: PropTypes.string,
    cardText: PropTypes.string
}; 

export default FlipCard; 
