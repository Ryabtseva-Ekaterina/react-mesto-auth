import React, { useState, useEffect } from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';
import Footer from './Footer.js';
import Main from './Main.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import Login from './Login.js';
import Register from './Register.js';
import InfoTooltip from './InfoTooltip.js';
import ProtectedRoute from './ProtectedRoute.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import api from '../utils/api.js';
import * as auth from '../utils/auth.js';
import union from '../images/Union.png';
import union_err from '../images/Union_error.png';


function App() {

    const [currentUser,setCurrentUser] = useState('');
    const [cards, setCards] = useState ([]);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [text, setText] = useState();
    const [image, setImage] = useState();
    const history = useHistory();

    useEffect (() => {
        tokenCheck()
        if (!loggedIn){
            api.getProfileInfo()
            .then((userStats)=> {
                setCurrentUser(
                userStats
                )
            })
            .catch ((err) => {
                    console.log (err);
            })

        api.getCards().
            then ((data) => {
                setCards(
                        data.map((card) => ({
                            _id: card._id,
                            link: card.link,
                            name: card.name,
                            likes: card.likes,
                            owner: card.owner
                        }))
                    )
            })
            .catch ((err) => {
                    console.log (err);
            })
        } 
    }, []);
    
    function closeAllPopup () {
       setIsEditAvatarPopupOpen(false);
       setIsAddPlacePopupOpen(false);
       setIsEditProfilePopupOpen(false);
       setSelectedCard({});
       setIsInfoTooltipOpen(false);
    }

    function handleUpdateUser (data) {
        api.updateUserInfo(data)
            .then((userStats) => {
                setCurrentUser(
                    userStats
                )
                closeAllPopup(setIsEditAvatarPopupOpen)
        })
            .catch ((err) => {
                console.log (err);
            })
    }

    function handleUpdateAvatar (data) {
        api.updateUserAvatar(data)
            .then((userStats) => {
                setCurrentUser(
                    userStats
                )
                closeAllPopup(setIsEditProfilePopupOpen)
            })
            .catch ((err) => {
                console.log (err);
            })
    }
    
    function handleCardLike(card) {
        const isLiked = card.likes.some(item => item._id === currentUser._id );
        const action = isLiked ? api.disLikeCard(card._id) : api.likeCard (card._id); 
      
        action
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch ((err) => {
                console.log (err);
            })
    } 

    function handleCardDelete (card) {
        api.deleteCard (card, card._id)
            .then (() => {
                const result = cards.filter ( item => item._id != (card._id) );
                setCards (result);
            }) 
            .catch ((err) => {
                console.log (err);
            })
    }

    function handleAddPlaceSubmit (data) {
        api.createNewCard (data)
            .then((newCard) => {
                setCards([newCard, ...cards])
                closeAllPopup(setIsAddPlacePopupOpen)
            })
            .catch ((err) => {
                console.log (err);
            })
    }

    function handleLogin (e) {
        e.preventDefault()
        setLoggedIn(true);
    }

    function tokenCheck() {
        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token');
            if (token) {
                auth.getContent(token)
                    .then((res) => {
                        if (res){
                            const email = res.data.email
                            setLoggedIn(true);
                            setUserEmail(email);
                        }   
                        history.push('/')
                    })
                    .catch ((err) => console.log(err));
            }
        }
    }

    function deleteToken () {
        localStorage.removeItem('token');
        history.push('/sign-in')
        setLoggedIn(false);
    }

    function register(email, password) {
        auth.register(email, password)
            .then((res) => {
                if (res) {
                    history.push('./sign-in');
                    setIsInfoTooltipOpen(true);
                    setText('Вы успешно зарегистрировались!')
                    setImage(union) 
                } else {
                    setIsInfoTooltipOpen(true);
                    setText('Что-то пошло не так! Попробуйте ещё раз.')
                    setImage(union_err)
                }
            })
            .catch ((err) => console.log(err));
    }

    function authorize(email, password) {
        auth.authorize(email, password)
            .then ((data) => {
                if (data.token) {
                    tokenCheck()
                    history.push('/')
                }
            })
            .catch (err => console.log(err));
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            
                <div className="page">
                    <div className="page__content">

                            <Switch> 

                                <Route exact={true} path="/sign-in">
                                    <Login  
                                        authorize = {authorize}
                                        handleLogin = {handleLogin}   
                                    />

                                </Route>

                                <Route exact={true} path="/sign-up">
                                    <Register 
                                        onButtonClick = {register}
                                    />
                                </Route>

                                <ProtectedRoute exact={true} path ="/"
                                    loggedIn = {loggedIn}
                                    onEditAvatar={setIsEditAvatarPopupOpen}
                                    onEditProfile={setIsEditProfilePopupOpen} 
                                    onAddPlace={setIsAddPlacePopupOpen} 
                                    onCardClick={setSelectedCard}
                                    cards={cards}
                                    onCardLike={handleCardLike}
                                    onCardDelete={handleCardDelete}
                                    component={Main}
                                    userData={userEmail}
                                    onDeleteToken={deleteToken}>
                                </ProtectedRoute>

                            </Switch>

                            <Footer />

                            <EditAvatarPopup
                                isOpen={isEditAvatarPopupOpen}
                                onClose={closeAllPopup}
                                onUpdateAvatar={handleUpdateAvatar} 
                            />

                            <EditProfilePopup 
                                isOpen={isEditProfilePopupOpen} 
                                onClose={closeAllPopup} 
                                onUpdateUser={handleUpdateUser}
                            /> 
                                    
                            <AddPlacePopup
                                isOpen={isAddPlacePopupOpen}
                                onClose={closeAllPopup}
                                onAddPlace={handleAddPlaceSubmit}
                            />

                            <PopupWithForm 
                                name='delete-form' 
                                title='Вы уверены?'
                                buttonText='Да'> 
                            </PopupWithForm>

                            <ImagePopup  card = {selectedCard} onClose = {closeAllPopup}/>

                            <InfoTooltip 
                                isOpen={isInfoTooltipOpen}
                                onClose={closeAllPopup}
                                image={image}
                                text={text}
                            />

                    </div>
                </div>

        </CurrentUserContext.Provider>
    );
}

export default App;