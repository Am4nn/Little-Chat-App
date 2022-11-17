import React from 'react';
import Room from './Room/Room';
import Input from './Input/Input';
import useLocalStorage from './hooks/useLocalStorage';

const App = () => {
    const [user, setUser] = useLocalStorage('user', null);
    const [room, setRoom] = useLocalStorage('room', null);
    const [isAdmin, setIsAdmin] = useLocalStorage('admin', false);

    const logoutHandler = () => {
        setUser(null);
        setRoom(null);
        setIsAdmin(false);
    }
    const loginHandler = (user, room, isAdmin) => {
        setUser(user);
        setRoom(room);
        setIsAdmin(isAdmin);
    }

    if (!user || !room) return (
        <Input
            loginHandler={loginHandler}
        />
    );
    else return (
        <Room
            user={user}
            room={room}
            isAdmin={isAdmin}
            logoutHandler={logoutHandler}
        />
    );
}

export default App;
