import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function Card (props) {

    const user = React.useContext(CurrentUserContext);
    const isOwn = props.owner._id === user._id;
    const cardDeleteButtonVisible = (`${isOwn ? 'elements__card-delete-button_visible elements__card-delete-button' : 'elements__card-delete-button'}`)
    const isLiked = props.likes.some(i => i._id === user._id);
    const cardLikeButtonClassName = (`${isLiked ? 'elements__card-like-button_active' : 'elements__card-like-button'}`); 
    

    function handleCardClick() {
        props.onCardClick(props);
    }

    function handleCardLike() {
        props.onCardLike(props);
    }

    function handleCardDelete() {
        props.onCardDelete(props);
    }
    return (
        <li className="elements__card">
            <img 
                className="elements__card-image" 
                src ={props.link} 
                alt = {props.name} 
                onClick={handleCardClick}/>
            <h2 className="elements__card-title">{props.name}</h2>
            <div className="elements__card-like">
                <button 
                    className={cardLikeButtonClassName} 
                    type="button" 
                    aria-label="Лайк" 
                    onClick={handleCardLike}/>
                <p className="elements__card-like-counter">{props.likes.length}</p>
            </div>
            <button 
                className={cardDeleteButtonVisible}  
                type="button" 
                aria-label="Корзина" 
                onClick={handleCardDelete}/>
        </li>
    );
}

export default Card;