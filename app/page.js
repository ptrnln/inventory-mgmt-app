'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { UIProvider } from './context/ui'



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState({});
  const [open, setOpen] = useState(false);
  const [edits, setEdits] = useState({});
  const [newQuantities, setNewQuantities] = useState({});
  // const [newItemName, setItemName] = useState('');
  

  // const [getSessionModalOpen, setSessionModalOpen] = sessionModalOpen;
  // const [getEmail, setEmail] = email;
  // const [getUsername, setUsername] = username;
  // const [getSessionStatus, setSessionStatus] = sessionStatus;
  // const [getSessionErrors, setSessionErrors] = sessionErrors;
  // const [getNewItemModalOpen, setNewItemModalOpen] = newItemModalOpen;
  // const [getNewItemName, setItemName] = newItemName;
  // const [getNewItemQuantity, setNewItemQuantity] = newItemQuantity;
  // const [getNewItemErrors, setNewItemErrors] = newItemErrors;

  const auth = getAuth();

  const updateEdits = () => {
    inventory.forEach((item) => {
      setEdits(edits[item.name] = false)
    })
  }

  const updateQuantities = () => {
    Object.keys(edits).forEach((itemName) => {
      if(inventory[itemName] && !newQuantities[itemName]) {
        newQuantities[itemName] = inventory[itemName].quantity
      }
    })
  }

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = {}
    docs.forEach((doc) => {
      inventoryList[doc.id] = doc.data()
    })
    setInventory(inventoryList)
  }

  
  
  const removeItem = async (item) => {
    if(window.confirm(`Are you sure you want to remove this item?`)) {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if(docSnap.exists()) await deleteDoc(docRef)
      await updateInventory()
    }
  }

  const saveQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.name)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()) {
      await setDoc(docRef, { "quantity": Number(item.quantity) })
    }
    setEdits({ ...edits, [item.name]: false })
    updateInventory();
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  
  useEffect(() => {
    updateInventory();
  }, [])
  
  useEffect(() => {
    if(inventory.length > 0) {
      updateEdits();
    }
  }, [inventory])

  useEffect(() => {
    if(Object.keys(edits).length > 0) {
      updateQuantities();
    }
  },[inventory, edits])
  

  return (
    <UIProvider>
      <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          { Object.keys(inventory).map((name) => {
            const { quantity } = inventory[name]
            return (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                { name.charAt(0).toUpperCase() + name.slice(1) }
              </Typography>
              {
                edits[name] ?
                  <>
                    <Typography variant='h3' color={'#333'} textAlign={'center'}>
                      Quantity: 
                    </Typography>
                      <input
                        type="number"
                        value={newQuantities[name] || quantity}
                        onChange={(e) => setNewQuantities({ ...newQuantities, [name]: e.target.value })}
                      ></input>
                    <Button variant="outlined" onClick={() => saveQuantity({ "name": name, "quantity": newQuantities[name] || quantity } )}>
                      Save
                    </Button>
                  </>
                  :
                  <>
                    <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                      Quantity: {quantity}
                    </Typography>
                    <Button variant="outlined" onClick={() => setEdits({ ...edits, [name]: true})}>
                      Edit
                    </Button>
                  </>
              }
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
            )
          })}
        </Stack>
      </Box>
    </Box>
  </UIProvider>
  )
}