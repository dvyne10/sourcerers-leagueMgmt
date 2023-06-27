import './flippableCard.css'; 
import FlipCard from './FlipCard'; 
import { CSSTransition } from 'react-transition-group'; 
import {useState} from 'react'; 

const FlippableCard = () => {
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
                }}/>
            </CSSTransition>
        </div>
    )
}

export default FlippableCard; 