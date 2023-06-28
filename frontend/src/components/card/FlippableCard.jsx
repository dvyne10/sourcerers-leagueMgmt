import './flippableCard.css'; 
import FlipCard from './FlipCard'; 
import { CSSTransition } from 'react-transition-group'; 
import {useState} from 'react'; 
import PropTypes from 'prop-types'; 

const FlippableCard = ({imageUrl, cardText}) => {
    const [showFront, setShowFront] = useState(true);

    return (
        <div className="flippable-card-container">
            <CSSTransition
                in={showFront}
                timeout={300}
                classNames='flip'
            > 
                <FlipCard onClick={()=> {
                    setShowFront((v) => !v);
                }}
                imageUrl={imageUrl}
                cardText={cardText}
                />
            </CSSTransition>
        </div>
    )
}

FlippableCard.propTypes = {
    imageUrl: PropTypes.string,
    cardText: PropTypes.string,
};
export default FlippableCard; 