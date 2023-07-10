import './flipCard.css';
import './flipTransition.css';
import PropTypes from 'prop-types'; 
import { Link} from 'react-router-dom';


const FlipCard = ({onClick, imageUrl, cardText}) => {


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
            
            </div>
    
            <div className="card-front" style={{backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover'}}>
                <Link className="card-text" to={`/league/123`}>{cardText}</Link>
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
