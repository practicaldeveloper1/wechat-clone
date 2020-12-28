import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import SearchIcon from '@material-ui/icons/Search';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SidebarChat from './SidebarChat';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import ExploreIcon from '@material-ui/icons/Explore';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';
import { auth } from "../firebase";
import { useDispatch } from 'react-redux';
import { logout } from '../features/userSlice';
import db from "../firebase";
import firebase from "firebase";

function Sidebar() {
    const dispatch = useDispatch();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const cleanUp = db.collection('rooms')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>
                setRooms(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                }))
                )
            );
        return () => {
            cleanUp();
        }

    }, [])

    const createChat = () => {
        const roomName = prompt("Please enter a name for chat room");
        if (roomName) {
            db.collection("rooms").add({
                name: roomName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        }
    }

    const SidebarOption = ({ Icon, IconOnHover, caption, onClick }) => (
        <>
            <div className="sidebar__option">
                <div className="sidebar__option--noHover"><Icon /></div>
                <div className="sidebar__option--hover"><IconOnHover onClick={onClick} /></div>
                <span className="sidebar__caption"> {caption} </span>
            </div>

        </>
    )

    const signOut = async () => {
        await auth.signOut();
        dispatch(logout());
    }

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <h3>WeChat</h3>
                <div className="sidebar__headerIcons">
                    <SearchIcon />
                    <AddCircleOutlineIcon onClick={createChat} />
                </div>
            </div>
            <div className="sidebar__chats">
                {rooms.map(room => (
                    <SidebarChat key={room.id} id={room.id} name={room.data.name} />
                ))}
            </div>

            <div className="sidebar__footer">
                <SidebarOption Icon={ChatBubbleOutlineIcon}
                    IconOnHover={ChatBubbleIcon} caption='Chats' />
                <SidebarOption Icon={PeopleOutlineIcon}
                    IconOnHover={PeopleIcon} caption='Contacts' />
                <SidebarOption Icon={ExploreOutlinedIcon}
                    IconOnHover={ExploreIcon} caption='Discover' />
                <SidebarOption Icon={PersonOutlineIcon}
                    IconOnHover={PersonIcon} caption='Logout' onClick={signOut} />
            </div>
        </div>
    )
}

export default Sidebar
