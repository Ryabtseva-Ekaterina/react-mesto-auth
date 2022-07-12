import React from 'react';
import Footer from './Footer.js';
import Main from './Main.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/Api';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { CardContext } from '../contexts/CardContext.js';
import {Route, Switch, useHistory} from 'react-router-dom';
import Login from './Login.js';
import Register from './Register.js';
import InfoTooltip from './InfoTooltip.js';
import ProtectedRoute from './ProtectedRoute.js';
import * as auth from '../auth.js';


function App() {

    const [currentUser,setCurrentUser] = React.useState('');
    const [cards, setCards] = React.useState ([]);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({});
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState('');
    const [text, setText] = React.useState();
    const [image, setImage] = React.useState();
    const history = useHistory();


    React.useEffect (() => {
        tokenCheck ();
        api.getProfileInfo().then((userStats)=> {
            setCurrentUser(
               userStats
            )
            })
            .catch ((err) => {
                console.log (err);
            })

        api.getCards().then ((data) => {
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
        console.log (card);
        const isLiked = card.likes.some(item => item._id === currentUser._id );
      
        if (!isLiked) {
            api.likeCard(card._id)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch ((err) => {
                console.log (err);
            })
        } else {
            api.disLikeCard (card._id)
            .then ((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch ((err) => {
                console.log (err);
            })
        } 
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
        .finally (() => {
            //
        });
    }

    function handleLogin (e) {
        e.preventDefault()
        setLoggedIn(true);
    }

    function tokenCheck() {
        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token');
            if (token) {
                auth.getContent(token).then((res) => {
                    if (res){
                        const email = res.data.email
                        setLoggedIn(true);
                        setUserEmail(email);
                    }   
                    history.push('/')
                })
            }
        }
    }

    function deleteToken () {
        localStorage.removeItem('token');
        history.push('/sign-in')
        setLoggedIn(false);
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <CardContext.Provider value={cards}>
                <div className="page">
                    <div className="page__content">

                            <Switch> 

                                <Route exact={true} path="/sign-in">
                                    <Login  handleLogin = {handleLogin}
                                            tokenCheck = {tokenCheck}
                                    />

                                </Route>

                                <Route exact={true} path="/sign-up">
                                    <Register 
                                        onButtonClick = {setIsInfoTooltipOpen}
                                        image = {setImage}
                                        text = {setText}
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
            </CardContext.Provider>
        </CurrentUserContext.Provider>
    );
}

export default App;