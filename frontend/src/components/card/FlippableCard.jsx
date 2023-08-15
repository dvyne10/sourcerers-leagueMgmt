import './flippableCard.css'; 
import FlipCard from './FlipCard'; 
import { CSSTransition } from 'react-transition-group'; 
import { useState } from 'react'; 
import PropTypes from 'prop-types'; 

const FlippableCard = ({ imageUrl, cardText, teams, leagueId }) => {
    const [showFront, setShowFront] = useState(true);

    return (
        <div className="flippable-card-container">
            <CSSTransition
                in={showFront}
                timeout={300}
                classNames='flip'
            > 
                <FlipCard
                    onClick={() => {
                        setShowFront((v) => !v);
                    }}
                    imageUrl={imageUrl}
                    cardText={cardText}
                    teams={teams}
                    leagueId={leagueId}
                    style={{
                        width: '100%',  // Set width as needed
                        height: 'auto', // Maintain aspect ratio
                        borderRadius: '50%',
                    }}
                />
            </CSSTransition>
        </div>
    )
}

FlippableCard.propTypes = {
    imageUrl: PropTypes.string,
    cardText: PropTypes.string,
    teams: PropTypes.arrayOf(
        PropTypes.shape({
            teamId: PropTypes.string.isRequired,
            teamName: PropTypes.string.isRequired,
        })
    ).isRequired,
    leagueId: PropTypes.string,
};

export default FlippableCard;
