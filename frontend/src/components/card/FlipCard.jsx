import './flipCard.css';
import './flipTransition.css';
import PropTypes from 'prop-types'; 

const FlipCard = ({onClick, imageUrl, cardText}) => {
    console.log("Flip card being rendered"); 
    return (
        <div className="card" onClick={onClick}>
            <div className="card-back">
                Teams
                <div className="team-link">
                    <a href="https://teamwebsite.com">Dragon Fire</a>
                </div>
                <div className="team-link">
                    <a href="https://teamwebsite.com">Real Madrid</a>
                </div>
                <div className="team-link">
                    <a href="https://teamwebsite.com">Manchester United</a>
                </div>
                <div className="team-link">
                    <a href="https://teamwebsite.com">We Go Together</a>
                </div>
            </div>
            <div className="card-front" style={{backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover'}}>
                {cardText}
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