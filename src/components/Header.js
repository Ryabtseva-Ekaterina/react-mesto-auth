import React from 'react';
import logo from '../images/logo.svg';

function Header (props) {

    return (
        <header className="header">
            <img  className="header__logo" src={logo} alt="лого"/>
            {props.children}
            <button className="header__button" onClick={props.onClick}>{props.text}</button>
        </header>             
    );
}

export default Header;