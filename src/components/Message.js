import React from 'react'
import "./Message.css";
import { Avatar } from "@material-ui/core";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';

function Message({ name, text, profilePicSrc, isSender }) {
    return (
        <div className={`message ${isSender && "message--sent"}`}>
            {!isSender && <div className='message__name' > {name} </div>}
            <Avatar variant="square" className="message__avatar" src={profilePicSrc} />
            {isSender ? < ArrowRightIcon className="message__sentArrow" /> : < ArrowLeftIcon className="message__receivedArrow" />}
            <div className="message__info">
                <div className="message__text">{text}</div>
            </div>
        </div>
    )
}

export default Message
