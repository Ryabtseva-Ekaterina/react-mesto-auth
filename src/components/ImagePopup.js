import React from 'react';

function ImagePopup ({card, onClose}) {

    return (
        <section className= {`popup zoom-popup ${(card.link ? 'popup_opened' : '')}`} >
            <div className="zoom-popup__container">
                <button 
                    className="popup__close-button zoom-popup__close-button" 
                    type="button" 
                    aria-label="Закрыть" 
                    onClick={onClose}/>
                <img className="zoom-popup__card" alt="user_place" src={card.link}/>
                <h2 className="zoom-popup__card-title">{card.name}</h2>
            </div>
        </section>
    );
}

export default ImagePopup;