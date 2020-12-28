import React, { useState, useRef, useEffect } from 'react'
import './Chat.css'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PersonIcon from '@material-ui/icons/Person';
import Message from './Message';
import ChatDate from './ChatDate';
import RecordVoiceOverOutlinedIcon from '@material-ui/icons/RecordVoiceOverOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import db from '../firebase'
import firebase from "firebase"
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice'
import { useParams } from 'react-router-dom'

function Chat() {
    const inputRef = useRef(null);
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const user = useSelector(selectUser);
    const { roomId } = useParams();
    const messagesEndRef = useRef(null);

    useEffect(() => {

        const cleanUp = db.collection('rooms').doc(roomId).onSnapshot((snapshot) => {
            if (snapshot.data()) {
                setRoomName(snapshot.data().name)
            }
        });

        const cleanUp2 = db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            });
        return () => {
            cleanUp();
            cleanUp2()
        }
    }, [roomId])


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        db.collection('rooms').doc(roomId).collection('messages').add({
            message: inputRef.current.value,
            name: user.displayName,
            uid: user.uid,
            profilePic: user.photoURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        db.collection('rooms').doc(roomId).update({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        inputRef.current.value = "";
    }


    return (
        <div className="chat">
            <div className="chat__header">
                < ArrowBackIosIcon />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                </div>
                <PersonIcon />

            </div>

            <div className="chat__body">
                {messages.map((message, index) => {
                    const prevMessage = messages[index - 1];
                    const showDate = !prevMessage || (message?.timestamp?.seconds - prevMessage?.timestamp?.seconds) > 60;
                    const dateNow = new Date();
                    const showFullDate = ((dateNow.getDate() !== message.timestamp?.toDate().getDate()) ||
                        (dateNow.getMonth() !== message.timestamp?.toDate().getMonth()) ||
                        dateNow.getYear() !== message.timestamp?.toDate().getYear())
                    return (
                        <>
                            {showDate && <ChatDate date={message.timestamp?.toDate()} showFullDate={showFullDate} />}
                            <Message
                                name={message.name}
                                text={message.message}
                                profilePicSrc={message.profilePic}
                                isSender={message.uid === user.uid} />
                        </>
                    )
                })}

                <div ref={messagesEndRef} />

            </div>

            <div className="chat__footer">
                <RecordVoiceOverOutlinedIcon />
                <form>
                    <input ref={inputRef} type="text" />
                    <button onClick={sendMessage} type="Submit"></button>
                </form>
                <SentimentVerySatisfiedIcon />
                <AddCircleOutlineOutlinedIcon />
            </div>
        </div>
    )
}

export default Chat
