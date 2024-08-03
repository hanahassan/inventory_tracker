"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import {
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  setDoc,
  doc
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [containerHeight, setContainerHeight] = useState(20); // Initial height

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);

    // Adjust the container height based on the number of items
    const newHeight = Math.min(50 + inventoryList.length * 50, 300); // Increase height by 50px per item, max 300px
    setContainerHeight(newHeight);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
      bgcolor="#090b24"
    >
      <Box width="1000px" height="100px" bgcolor="#13162e" display="flex" alignItems="center" justifyContent="space-between" px={5} border='1px solid #333'>
        <Typography variant="h3" color='#bfbfbf'>Inventory Items</Typography>
        <Button 
            variant="contained"
            sx={{ backgroundColor: '#464682' }}
            onClick={() => {
              handleOpen();
            }}>Add New Item</Button> 
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%,-50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}>
            </TextField>
            <Button 
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}>Add</Button>
          </Stack>
        </Box>
      </Modal> 
      <Box border='1px solid #333' bgcolor="#13162e" pb="10px">
        <Box width="582px" display="flex" flexDirection="row" justifyContent="space-between" px={4.8} pt={2} pb={2}>
          <Typography variant='h4' color='#bfbfbf' textAlign='center'>
            Item
          </Typography>
          <Typography variant='h4' color='#bfbfbf' textAlign='center' >
            Quantity
          </Typography>
        </Box>
        <Stack
          width='1000px'
          height={containerHeight}
          spacing={2}
          overflow="auto"
          sx={{ transition: "height 0.5s ease-in-out" }}
        >
          {inventory.map(({ name, quantity }) => (
            <Box key={name} width="100%" minHeight="50px" display="flex" alignItems="center" justifyContent="space-between" bgcolor='#13162e' px={5}>
              <Typography variant='h5' color='#919191' textAlign='center' width="1px">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant='h5' color='#919191' textAlign='center' pl={3}>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  sx={{ backgroundColor: '#464682' }}
                  onClick={() => {
                    addItem(name);
                  }} >
                    Add
                </Button>
                <Button 
                  variant="contained" 
                  sx={{ backgroundColor: '#464682' }}
                  onClick={() => {
                    removeItem(name);
                  }} >
                    Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>  
    </Box>
  );
}
