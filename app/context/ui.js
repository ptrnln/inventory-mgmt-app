import { createContext, use, useContext, useState } from "react";
import { Box, Typography, TextField, Button, Modal, Stack } from "@mui/material";
import { firestore, } from '@/firebase'
import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    deleteDoc,
    getDoc,
    where,
    or
  } from 'firebase/firestore'

export const UIContext = createContext();

export function UIProvider({ children }) {
    const [sessionModalOpen, setSessionModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');  
    const [sessionStatus, setSessionStatus] = useState('inactive');
    const [sessionErrors, setSessionErrors] = useState({});
    const [newItemModalOpen, setNewItemModalOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState(0);
    const [newItemErrors, setNewItemErrors] = useState({});
    return (
        <UIContext.Provider value={{
            sessionModalOpen: [sessionModalOpen, setSessionModalOpen],
            email: [email, setEmail],
            username: [username, setUsername],
            sessionStatus: [sessionStatus, setSessionStatus],
            sessionErrors: [sessionErrors, setSessionErrors],
            newItemModalOpen: [newItemModalOpen, setNewItemModalOpen],
            newItemName: [newItemName, setNewItemName],
            newItemQuantity: [newItemQuantity, setNewItemQuantity],
            newItemErrors: [newItemErrors, setNewItemErrors]
        }}>
            <UIComponent>
                {children}
            </UIComponent>
        </UIContext.Provider>
    )
}

function UIComponent({ children }) {
    const { sessionModalOpen,
        email,
        username,
        sessionStatus,
        sessionErrors,
        newItemModalOpen,
        newItemName,
        newItemQuantity,
        newItemErrors } = useUIContext();
    const [getSessionModalOpen, setSessionModalOpen] = sessionModalOpen; 
    const [getEmail, setEmail] = email;
    const [getUsername, setUsername] = username;
    const [getSessionStatus, setSessionStatus] = sessionStatus;
    const [getSessionErrors, setSessionErrors] = sessionErrors;
    const [getNewItemModalOpen, setNewItemModalOpen] = newItemModalOpen;
    const [getNewItemName, setItemName] = newItemName;
    const [getNewItemQuantity, setNewItemQuantity] = newItemQuantity;
    const [getNewItemErrors, setNewItemErrors] = newItemErrors;

    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    

    async function credentialHandler(credential) {
        const user = await getUserByCredential(credential);
        if(user) {
            // login
            const { email, username } = user;
            setEmail(email);
            setUsername(username);
            setSessionStatus('password');
        } else {
            // set error
            setSessionErrors({ credential: 'User not found' });
    
        }
    }

    async function login(password) {
        // login
        setSessionStatus('pending');
    }

    let form;

    switch(getSessionStatus) {
        case 'inactive':
        case 'credential':
            form = (
                <Stack width="80%" direction={'column'} spacing={2}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Login
                    </Typography>
                    <TextField
                        id="credential"
                        label="Email/Username"
                        variant="outlined"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                    />
                    <Button onClick={(e) => credentialHandler(credential)}>Submit</Button>
                </Stack>
            )
            break;
        case 'password':
            form = (
                <Stack width="80%" direction={'column'} spacing={2}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Password
                    </Typography>
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={(e) => login(password)}>Submit</Button>
                </Stack>
            )
            break;
        case 'pending':
            form = (
                <Stack width="80%" direction={'column'} spacing={2}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Password
                    </Typography>
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        value={password}
                        disabled={'disabled'}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button disabled={'disabled'} onClick={(e) => credentialHandler(credential)}>Submit</Button>
                </Stack>
            )
            break;
        case 'success':
            form = (
                <Stack width="80%" direction={'column'} spacing={2}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Success
                    </Typography>
                    <Typography>
                        You have successfully logged in
                    </Typography>
                </Stack>
            )
            break;
        case 'error':
            form = (
                <Stack width="80%" direction={'column'} spacing={2}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Password
                    </Typography>
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {getSessionErrors.credential && getSessionErrors.credential.map((error) =>
                        <Typography id="modal-errors" variant="p"color={'red'}>{error}</Typography>
                    )}
                    <Button onClick={(e) => credentialHandler(credential)}>Submit</Button>
                </Stack>
            )
            break;
    }


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        justifyContent: 'center',
        display: 'flex',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };   
    return (
            <>
                <Button 
                    variant="contained" 
                    onClick={() => setSessionModalOpen(true)}
                    position={'fixed'}
                    top={0}
                    left={0}>
                    Sign Up/In
                </Button>
                <Button
                        variant="outlined"
                        onClick={() => {
                            addItem(newItemName)
                            setItemName('')
                            setOpen(false)
                        }}
                        >
                        Add Item
                </Button>
                <Modal
                    open={getSessionModalOpen}
                    onClose={() => setSessionModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        {form}
                    </Box>
                </Modal>
                <Modal
                    open={getNewItemModalOpen}
                    onClose={e => setNewItemModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Item
                    </Typography>
                    <Stack width="100%" direction={'row'} spacing={2}>
                        <TextField
                        id="outlined-basic"
                        label="Item"
                        variant="outlined"
                        fullWidth
                        value={newItemName}
                        onChange={(e) => setItemName(e.target.value)}
                        />
                    </Stack>
                    </Box>
                </Modal>
            {children}
        </>
    )
}

export function useUIContext() {
    return useContext(UIContext);
}

async function getUserByCredential(credential) {
    // fetch user by email or username
    debugger
    const snapshot = query(
        collection(firestore, 'users'), 
        or(
            where('email', '==', credential), 
            where('username', '==', credential)
        )
    );
    const docSnap = await getDocs(snapshot);

    let result;
    docSnap.forEach(doc => {
        result = doc.data();
    })
    return result;
}




