import React from 'react';

function PopupWithForm ({name, title, isOpen, children, onClose, buttonText, onSubmit}) {

    return (
        <section className={`popup popup_type_${name} ${(isOpen?'popup_opened':'')}`}>
            <div className="popup__container">
                <button 
                    className="popup__close-button edit-popup__close-button" 
                    type="button"
                    ria-label="Закрыть" 
                    onClick={onClose} />

                <form className="popup__container-form edit-popup__form" name={name} noValidate onSubmit= {onSubmit}>

                    <h3 className="popup__container-form-title">{title}</h3>

                    {children}

                    <button 
                        className="popup__container-form-button edit-avatar-popup__submit-button" 
                        type="submit">
                        {buttonText}
                    </button>

                </form>
            </div>
        </section>
    );
}

export default PopupWithForm;