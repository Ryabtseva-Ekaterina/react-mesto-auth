import React from 'react';
import Card from '../components/Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Header from './Header.js';


function Main ({onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardLike, onCardDelete, cards, userData, onDeleteToken}) {

    const user = React.useContext(CurrentUserContext);
    const email = userData;

    function onSignOut () {
        onDeleteToken();
    }
    
    return (
        <main>
            <Header 
                text = 'Выйти'
                onClick = {onSignOut}>
                <p className= "header__text">{email}</p>
            </Header>        

            <section className="profile">
                <div className="profile__avatar">
                    <button 
                        className="profile__avatar-button" 
                        type="button" 
                        aria-label="Изменить_аватар"/>
                    <img 
                        className="profile__avatar-image" 
                        style={{ backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover' }} 
                        onClick={()=> {onEditAvatar(true)}}/>
                </div>
                <div className="profile__intro">
                    <h1 className="profile__intro-name">{user.name}</h1>
                    <button 
                        className="profile__intro-edit-button" 
                        type="button" 
                        aria-label="Редактировать" 
                        onClick={()=> {onEditProfile(true)}}/>
                    <p className="profile__intro-description">{user.about}</p>
                </div>
                <button 
                    className="profile__add-button" 
                    type="button" 
                    aria-label="Добавить" 
                    onClick={()=> {onAddPlace(true)}}/>
            </section>

            <section className="elements">
                <ul className="elements__cards">
                    {cards.map((card) => (
                        <Card 
                            key = {card._id}
                            _id = {card._id}
                            link = {card.link}
                            name = {card.name}
                            likes = {card.likes}
                            owner = {card.owner}
                            onCardClick={onCardClick}
                            onCardLike={onCardLike}
                            onCardDelete={onCardDelete}
                        />
                    ))}
                </ul>
            </section>

        </main>  
    );
}

export default Main;