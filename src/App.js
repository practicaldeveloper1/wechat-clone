import React, { useEffect } from 'react';
import './App.css';
import Chat from './components/Chat';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice'
import { useDispatch } from 'react-redux';
import { auth } from "./firebase";
import { login } from './features/userSlice';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch(login({
          email: authUser.email,
          uid: authUser.uid,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL
        })
        );
      }
    })
    return () => { unsubscribe() }
  }, []);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
          <div className="app__body">
            <Router>
              <Switch>
                <Route path="/rooms/:roomId">
                  <Sidebar />
                  <Chat />
                </Route>
                <Route path="/">
                  <Sidebar />
                </Route>
              </Switch>
            </Router>
          </div>
        )}
    </div>
  )

}
export default App;
