"use client";
import Image from "next/image";
import NavBar from "./NavBar";
import { useState, useEffect, useRef } from "react";
import { firestore, storage } from "@/firebase";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Camera } from "react-camera-pro";
import {
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  setDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage"; // Import storage functions

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [quantityNumber, setQuantityNumber] = useState("");
  const [containerHeight, setContainerHeight] = useState(20);

  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateItemName, setUpdateItemName] = useState("");
  const [oldItemName, setOldItemName] = useState("");
  const [updateQuantityNumber, setUpdateQuantityNumber] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [cameraOpen, setCameraOpen] = useState(false);
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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

    const newHeight = Math.min(50 + inventoryList.length * 50, 300);
    setContainerHeight(newHeight);
    setImage(null)
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

  const addItem = async (item, quantityToAdd, imageUrl) => {
    const itemUpp = item.charAt(0).toUpperCase() + item.slice(1);
    const docRef = doc(collection(firestore, "inventory"), itemUpp);
    const docSnap = await getDoc(docRef);

    const quantityToAddNum = Number(quantityToAdd);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + quantityToAddNum, imageUrl });
    } else {
      await setDoc(docRef, { quantity: quantityToAddNum, imageUrl });
    }

    await updateInventory();
  };

  const add1Item = async (item, quantityToAdd) => {
    const itemUpp = item.charAt(0).toUpperCase() + item.slice(1);
    const docRef = doc(collection(firestore, "inventory"), itemUpp);
    const docSnap = await getDoc(docRef);

    const quantityToAddNum = Number(quantityToAdd);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + quantityToAddNum });
    } else {
      await setDoc(docRef, { quantity: quantityToAddNum });
    }

    await updateInventory();
  };

  const updateItem = async (olditem, item, quantityToAdd) => {
    const itemUpp = item.charAt(0).toUpperCase() + item.slice(1);
    const quantityToAddNum = Number(quantityToAdd);
  
    // Reference to the old document
    const oldDocRef = doc(collection(firestore, "inventory"), olditem);
  
    // Get the old document data
    const oldDocSnap = await getDoc(oldDocRef);
  
    if (!oldDocSnap.exists()) {
      console.error(`Document with ID ${olditem} does not exist.`);
      return;
    }
  
    // Extract imageUrl from the old document data
    const { imageUrl } = oldDocSnap.data() || {};
  
    if (olditem !== itemUpp) {
      // Create a new document with the updated item name
      const newDocRef = doc(collection(firestore, "inventory"), itemUpp);
      await setDoc(newDocRef, {
        quantity: quantityToAddNum,
        name: itemUpp,
        imageUrl: imageUrl,
      });
  
      // Delete the old document
      await deleteDoc(oldDocRef);
    } else {
      // If item name hasn't changed, just update the quantity
      await setDoc(oldDocRef, {
        quantity: quantityToAddNum,
        name: itemUpp,
        imageUrl: imageUrl,
      }, { merge: true });
    }
  
    // Clear the form and update inventory
    setOldItemName("");
    setUpdateItemName("");
    setUpdateQuantityNumber("");
    await updateInventory();
  };  
  

  const handleUpdateOpen = (name, quantity) => {
    setOldItemName(name);
    setUpdateItemName(name);
    setUpdateQuantityNumber(quantity);
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => setUpdateOpen(false);

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCameraClose = () => {
    setCameraOpen(false);
    setImage(null);
  };

  const handleTakePhoto = () => {
    const photo = camera.current.takePhoto();
    setImage(photo);
    setCameraOpen(false);
  };

  const handleSaveImage = async (itemName) => {
    if (!image) return null;

    const imageRef = ref(storage, `images/${itemName}.jpg`); // Use itemName for the image name
    try {
      await uploadString(imageRef, image, "data_url");
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return null;
    }
  };

  const handleAddItem = async () => {
    const imageUrl = await handleSaveImage(itemName);
    addItem(itemName, quantityNumber, imageUrl);
    setItemName("");
    setQuantityNumber(1);
    handleClose();
  };

  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="#090b24"
    >
      <Box position="fixed" top={0} width="100%">
        <NavBar />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        mt={8}
      >
        <Box
          width="1000px"
          height="100px"
          bgcolor="#13162e"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={5}
          border="1px solid #333"
        >
          <Typography variant="h3" color="#bfbfbf">
            Inventory Items
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#464682" }}
            onClick={handleOpen}
          >
            Add New Item
          </Button>
        </Box>
        <TextField
          variant="outlined"
          placeholder="Search Items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mt: 2,
            width: "1000px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#2e2e2e",
              },
              "&:hover fieldset": {
                borderColor: "#2e2e2e",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2e2e2e",
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "grey",
            },
          }}
        />
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
                inputProps={{ maxLength: 15 }}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{ min: 1 }}
                value={quantityNumber}
                onChange={(e) => setQuantityNumber(e.target.value)}
              />
            </Stack>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={2}
            >
              <Button
                variant="contained"
                sx={{ backgroundColor: "#464682" }}
                onClick={() => setCameraOpen(true)}
              >
                Open Camera
              </Button>
              {image && (
                <Image
                  src={image}
                  alt="Taken photo"
                  layout="responsive"
                  width={200}
                  height={400}
                  style={{ marginTop: "10px" }}
                />
              )}
            </Box>
            <Button variant="outlined" onClick={handleAddItem}>
              Add
            </Button>
          </Box>
        </Modal>
        <Modal open={updateOpen} onClose={handleUpdateClose}>
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
            <Typography variant="h6">Update Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                inputProps={{maxLength: 15}}
                value={updateItemName}
                onChange={(e) => setUpdateItemName(e.target.value)}
              />
              <TextField
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{ min: 1 }}
                value={updateQuantityNumber}
                onChange={(e) => setUpdateQuantityNumber(Number(e.target.value))
                }
              />
              <Button
                variant="outlined"
                onClick={async () => {
                  updateItem(oldItemName, updateItemName, updateQuantityNumber);
                  handleUpdateClose();
                }}
              >
                Update
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Modal open={cameraOpen} onClose={handleCameraClose}>
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
            <Box display="flex" flexDirection="column" alignItems="center">
              <Camera ref={camera} />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleTakePhoto}
              >
                Take Photo
              </Button>
              {image && (
                <Image
                  src={image}
                  alt="Taken photo"
                  layout="responsive"
                  width={600}
                  height={400}
                />
              )}
            </Box>
          </Box>
        </Modal>
        <Box border="1px solid #333" bgcolor="#13162e" pb="10px" mt={2}>
          <Box
            width="582px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            px={4.8}
            pt={2}
            pb={2}
          >
            <Typography variant="h4" color="#bfbfbf" textAlign="center">
              Item
            </Typography>
            <Typography variant="h4" color="#bfbfbf" textAlign="center">
              Quantity
            </Typography>
          </Box>
          <Box width={1000} height="5px" bgcolor="#090b24" mb={2}></Box>
          <Stack
            width="1000px"
            height={containerHeight}
            spacing={2}
            overflow="auto"
            sx={{ transition: "height 0.5s ease-in-out" }}
          >
            {filteredInventory.map(({ name, quantity, imageUrl }) => (
              <Box
                key={name}
                width="100%"
                minHeight="50px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#13162e"
                px={5}
              >
                <Box width="70px" display="flex" alignItems="left">
                  <Typography variant="h5" color="#919191">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                </Box>
                <Box width="70px" display="flex" justifyContent="left">
                  {imageUrl && (
                    <Box sx={{ width: 60, height: 40, position: "relative" }}>
                      <Image
                        src={imageUrl}
                        alt={name}
                        layout="fill"
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                  )}
                </Box>
                <Box width="100px" display="flex" justifyContent="left">
                  <Typography variant="h5" color="#919191" textAlign="center">
                    {quantity}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#464682" }}
                    onClick={() => add1Item(name, 1)}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#464682" }}
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#464682" }}
                    onClick={() => handleUpdateOpen(name, quantity)}
                  >
                    Update
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
