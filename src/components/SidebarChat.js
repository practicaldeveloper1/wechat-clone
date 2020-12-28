import React, { useEffect, useState } from 'react'
import './SidebarChat.css'
import { Avatar } from '@material-ui/core'
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom'
import db from "../firebase";
import notificationAudio from '../audio/message.mp3'
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice'

function SidebarChat({ id, name }) {
    const user = useSelector(selectUser);
    const { roomId } = useParams();
    const [messages, setMessages] = useState('');
    const [audio] = useState(new Audio(notificationAudio));
    const [initialDataFetched, setInitialDataFetched] = useState(false);
    const [seed, setSeed] = useState('');

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 50));
        const cleanUp = db.collection('rooms')
            .doc(id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .onSnapshot((snapshot) => {
                setMessages(snapshot.docs.map((doc) =>
                    doc.data()))
                setInitialDataFetched(true);
            }
            );
        return () => {
            cleanUp();
        }
    }, [])

    useEffect(() => {
        if (initialDataFetched) {
            if (messages[0]?.uid !== user.uid) {
                audio.play();
            }
        }

    }, [messages])

    return (
        <Link to={`/rooms/${id}`}>
            <div className={`sidebarChat ${id === roomId && "sidebarChat--active"} `}>
                <Avatar variant="square" src={`https://picsum.photos/300/300?random=${seed}`} />
                <div className="sidebarChat__info">
                    <h2>{name}</h2>
                    <p> {messages[0] && `${user.uid === messages[0]?.uid ? 'Me' : messages[0]?.name} : ${messages[0]?.message}`}</p>
                </div>
                <div className="sidebarChat__timestamp">
                    {messages[0]?.timestamp?.toDate().toLocaleDateString()}
                </div>
            </div>
        </Link>
    )
}

export default SidebarChat
