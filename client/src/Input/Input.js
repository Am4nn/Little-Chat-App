import React, { Fragment, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'

export default function Input({ loginHandler }) {

    const [errors, setErrors] = useState(null);
    const [user, setUser] = useState('');
    const [room, setRoom] = useState('');
    const [adminText, setAdminText] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        const isAdminTest = (adminText === 'aman7340101307');
        if (!isAdminTest && (user === 'aman' || user === 'admin')) {
            setErrors("You can't use this username as it is reserved for admin only");
            return;
        }
        if (room !== 'ggwp') {
            setErrors("Room ID is not valid !");
            return;
        }
        loginHandler(user, room, (isAdminTest && (user === 'aman' || user === 'admin')));
        setUser('');
        setRoom('');
    }

    return (
        <Fragment>
            <input type='password' placeholder='Admin ?' style={{
                position: 'absolute'
            }} value={adminText} onChange={e => setAdminText(e.target.value)}></input>

            <Container className="align-items-center d-flex" style={{ height: '100vh' }}>
                <Form onSubmit={handleSubmit} className="w-100">
                    <Form.Group className='mb-2'>
                        <Form.Label style={{ fontWeight: '500', fontSize: '1.5rem' }}>Enter Your Username</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={user}
                            onChange={e => (e.target.value.length <= 8) && setUser(e.target.value.trim())}
                            placeholder='Maximum 8 Characters'
                        />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label style={{ fontWeight: '500', fontSize: '1.5rem' }}>Enter Your Room Id</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={room}
                            onChange={e => setRoom(e.target.value)}
                            placeholder='Must be a valid Room Id !'
                        />
                    </Form.Group>
                    <Button type="submit">Let's Go</Button>
                    {errors && <div style={{
                        color: 'red',
                        fontWeight: '500',
                        opacity: '0.6'
                    }}>{errors}</div>}
                </Form>
            </Container>
        </Fragment>
    )
}
