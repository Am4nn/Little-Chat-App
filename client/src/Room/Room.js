import { React, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { TextField, Button, Box, IconButton } from '@mui/material'
import { ContentCopy } from '@mui/icons-material'
import copy from 'copy-to-clipboard'
import { SERVER_LINK } from '../serverlink';

let msgWasSent = false;

const Room = ({ user, room, isAdmin, logoutHandler }) => {

    const [count, setCount] = useState(0);
    const [socket, setSocket] = useState(null);
    const [currentMsg, setCurrentMsg] = useState('');
    const [conversations, setConversations] = useState([]); // conversation = [{ msg, user }]

    useEffect(() => {
        const newSocket = io(
            SERVER_LINK,
            { query: { id: user } }
        )
        newSocket.on('first-connection', conversations => setConversations(conversations));
        setSocket(newSocket);
        newSocket.on('recieve-msg', (msg, user) => {
            setConversations(prev => [...prev, { msg, user }]);
        });
        newSocket.on('count', count => setCount(count));

        return () => newSocket.close();
    }, [user]);

    /** @param {Event} event */
    const sendMsgHandler = event => {
        event.preventDefault();
        if (!socket || !currentMsg) return;
        const currmsgreal = currentMsg;
        socket.emit('send-message', currmsgreal, user);
        setConversations(prev => [...prev, { msg: currmsgreal, user }]);
        setCurrentMsg('');
        msgWasSent = true;
    }

    const lastMsgRef = useCallback(node => {
        if (node && msgWasSent) {
            node.scrollIntoView({ smooth: true });
            msgWasSent = false;
        }
    }, []);

    const hideHandler = () => {
        socket.emit('hide');
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 0.5rem',
            height: '95vh',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>Room : {room}</div>
                <div>User : {user}</div>
                <div>Active Users : {count}</div>
                {isAdmin && <div>Admin</div>}
                <button onClick={logoutHandler} style={{ border: 'unset', background: 'unset', textDecoration: 'underline', textDecorationColor: 'blue', color: 'blueviolet', textDecorationThickness: '2px', padding: '0 1px' }}>Logout</button>
                {isAdmin && <button onClick={hideHandler} style={{ border: 'unset', background: 'unset', textDecoration: 'underline', textDecorationColor: 'blue', color: 'blueviolet', textDecorationThickness: '2px', padding: '0 1px' }}>Hide</button>}
            </div>

            <div style={{
                border: '1px solid rgba(0,0,0,0.2)',
                flexGrow: '1',
                overflowY: 'scroll',
                backgroundColor: 'rgb(0 0 0 / 0.05)'
            }}>
                {conversations.map((convo, indx) => {
                    return (
                        <div ref={(indx === conversations.length - 1) ? lastMsgRef : null} key={indx} style={{
                            padding: '0 5px',
                            margin: '2px 0',
                            maxWidth: '50%',
                            width: 'fit-content',
                            marginLeft: (convo.user === user ? 'auto' : null)
                        }}>

                            <div style={{
                                border: '1px solid rgba(0,0,0,0.2)',
                                borderRadius: '5px',
                                padding: '0 5px',
                                backgroundColor: 'rgb(255 255 255)',
                                whiteSpace: "pre-line"
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: (convo.user === user ? 'flex-end' : 'flex-start'),
                                }}>

                                    <div style={{
                                        opacity: '0.5',
                                        backgroundColor: 'rgb(255 255 255)',
                                    }}>
                                        {(convo.user === user) ? 'you' : convo.user}
                                    </div>
                                    <IconButton
                                        onClick={() => copy(convo.msg)}
                                        aria-label='Copy'
                                        size='small'
                                        style={{ marginLeft: 'auto' }}
                                    >
                                        <ContentCopy />
                                    </IconButton>
                                </div>
                                <div style={{ borderTop: '1px solid rgb(0,0,0)' }}>{convo.msg}</div>

                            </div>
                        </div>
                    )
                })}
            </div>

            <Box style={{
                display: 'flex',
                marginBottom: '1rem',
                marginTop: '0.2rem',
                width: '100%'
            }}>
                <TextField
                    style={{
                        flexGrow: 1
                    }}
                    id="msg-textarea"
                    placeholder="Message"
                    multiline
                    value={currentMsg}
                    onChange={event => setCurrentMsg(event.target.value)}
                />
                <Button
                    size='large'
                    variant='contained'
                    onClick={sendMsgHandler}
                >Send</Button>
            </Box >
        </div>
    );
}

export default Room;

/* <input multiple type='text' style={{
    width: '100%',
    fontSize: '1.2rem'
}} value={currentMsg}
    // onKeyDown={keyDownHandler}
    onChange={event => setCurrentMsg(event.target.value)
    }></input> */