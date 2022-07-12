import React from "react";
import {Link, useHistory} from 'react-router-dom';
import * as auth from '../auth.js';
import Header from "./Header.js";
import union from '../images/Union.png';
import union_err from '../images/Union_error.png';

function Register (props) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    let history = useHistory(); 

    function handleChangeEmail (e) {
        setEmail (e.target.value)
    }

    function handleChangePassword (e) {
        setPassword (e.target.value)
    }

    function handleSubmit (e) {
        e.preventDefault();
        auth.register(email, password). then((res) => {
            if (res) {
               history.push('./sign-in');
               props.onButtonClick(true);
               props.text('Вы успешно зарегистрировались!')
               props.image(union) 
            } else {
                props.onButtonClick(true);
                props.text('Что-то пошло не так! Попробуйте ещё раз.')
                props.image(union_err)
            }
        })
    }

    function onLogin () {
        history.push('/sign-in');
    }
  
  
    return (
        <section>

            <Header 
                text= 'Войти'
                onClick = {onLogin}/>

            <div className="register">

                <h3 className="authorize__title">Регистрация</h3>    
                <form className=" popup__container-form authorize__form" name='login-form' noValidate onSubmit={handleSubmit}>
                    
                    <input
                        id="email-input" 
                        value= {email}

                        onChange={handleChangeEmail} 
                        className="popup__container-form-input authorize__form-input" 
                        type="email" 
                        name="email"
                        placeholder="Email"
                        minLength="2" 
                        maxLength="40" 
                        required />
        
                     <input 
                        id="password-input"
                        value={password}
                        onChange={handleChangePassword} 
                        className="popup__container-form-input authorize__form-input" 
                        type="password" name="password" 
                        placeholder="Пароль" 
                        minLength="2" 
                        maxLength="200" 
                        required />

                    <button 
                        className="popup__container-form-button authorize__form-button" 
                        type="submit">
                        Зарегистрироваться
                    </button>

                    <p className="register__text">Уже зарегистрированы? 
                        <Link to='sign-in' className="register__link"> Войти</Link>
                    </p>

                </form>            
            </div>
        </section>
    );
}

export default Register;