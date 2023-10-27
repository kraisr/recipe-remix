import React, { useState } from 'react';
import './shoppingList.css';
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmptyIcon from '@mui/icons-material/Inbox';


const ShoppingList1 = () => {
  const [shoppingLists, setShoppingLists] = useState([
    { id: 1, title: 'test', items: ['Milk', 'Bread', 'Eggs'] },
    { id: 2, title: 'test2', items: ['a', 'a', 'a'] },
  ]);
  const [newItems, setNewItems] = useState({});
  const [editedItems, setEditedItems] = useState({});
  const [editedList, setEditedList] = useState(null);
  const [selectedListId, setSelectedListId] = useState(null);
  const [editedListValue, setEditedListValue] = useState('');
  const [editListNameMode, setEditListNameMode] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleEditListName = () => {
    const updatedLists = shoppingLists.map(list =>
      list.id === selectedListId ? { ...list, title: newListName } : list
    );
    setShoppingLists(updatedLists);
    setEditListNameMode(false);
  };
  

  const addShoppingList = () => {
    const newList = {
      id: Date.now(),
      title: 'New List',
      items: [],
    };
    setShoppingLists([...shoppingLists, newList]);
  };

  const deleteShoppingList = (listId) => {
    const updatedLists = shoppingLists.filter((list) => list.id !== listId);
    setShoppingLists(updatedLists);
    if (listId === selectedListId) {
      setSelectedListId(null);
    }
  };

  const deleteItemFromList = (listId, itemId) => {
    const updatedLists = [...shoppingLists];
    const list = updatedLists.find((list) => list.id === listId);
    if (list) {
      list.items = list.items.filter((item, index) => index !== itemId);
      setShoppingLists(updatedLists);
      // Reset editing states if the item being deleted is currently being edited
      if (editedList === listId && editedItems[listId] === itemId) {
        setEditedList(null);
        setEditedItems({ ...editedItems, [listId]: undefined });
        setEditedListValue(''); 
      }
    }
  };
  
  const addItemToList = (listId) => {
    if (newItems[listId].trim() === '') return;
    const updatedLists = [...shoppingLists];
    const list = updatedLists.find((list) => list.id === listId);
    if (list) {
      list.items.push(newItems[listId]);
      setShoppingLists(updatedLists);
      setNewItems({ ...newItems, [listId]: '' });
      // Reset the editing states when a new item is added
      setEditedList(null);
      setEditedItems({ ...editedItems, [listId]: undefined });
      setEditedListValue(''); 
    }
  };
  

  const editItemInList = (listId, itemId) => {
    const updatedLists = [...shoppingLists];
    const list = updatedLists.find((list) => list.id === listId);
    if (list) {
      list.items[itemId] = editedListValue;
      setShoppingLists(updatedLists);
      setEditedItems({ ...editedItems, [listId]: '' });
      setEditedList(null);
      setEditedListValue(''); // Reset the edited item value after updating
    }
  };

  const handleKeyPress = (event, listId, itemId) => {
    if (event.key === 'Enter') {
      editItemInList(listId, itemId);
    }
  };
  
  const handleListNameKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleEditListName();
    }
  };

  const textFieldStyles = {
    bgcolor: "#e7ede6",
    width: '88%',
    "& label.Mui-focused": {
      color: "#000",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#a1c298",
      },
      "&:hover fieldset": {
        borderColor: "#88b083",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6b9466",
      },
    }
  };

  const itemHoverStyle = {
    borderRadius: '8px',
    cursor: 'pointer',
    "&:hover": {
      backgroundColor: '#d9e0d8', // Slightly darker background on hover
    },
  };

  return (
    <div>
      <Box
        sx={{
          background: '#a1c298',
          borderRadius: '8px',
          p: 2,
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Shopping Lists
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 2,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          {
          editListNameMode ? (
            <Box sx={{ width: '48%', display: 'flex', alignItems: 'center' }}>
              <TextField
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                sx={{
                  bgcolor: "#e7ede6",              
                  "& label.Mui-focused": {
                    color: "#000",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#a1c298",
                    },
                    "&:hover fieldset": {
                      borderColor: "#88b083",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6b9466",
                    },
                  }
                }}
                fullWidth
                autoFocus
              />
            </Box>
          ) : (
            <FormControl
              variant="outlined"
              style={{ width: '48%' }}
            >
              <InputLabel>Select a List</InputLabel>
              <Select
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
                label="Select a List"
                sx={{
                  bgcolor: "#e7ede6",
                  "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                          borderColor: "#a1c298", // Default border color
                      },
                      "&:hover fieldset": {
                          borderColor: "#88b083", // Border color on hover
                      },
                  },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: "#000 !important", // Border color when focused
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000 !important", // Border color when focused
                  }
              }}
            >
            <MenuItem value={null}>Select a List</MenuItem>
            {shoppingLists.map((list) => (
                <MenuItem key={list.id} value={list.id}>
                    {list.title}
                </MenuItem>
            ))}
            </Select>
          </FormControl>
        )}
        <IconButton
          onClick={() => {
            if (editListNameMode) {
              handleEditListName(); // Save the new list name if we're in edit mode
            } else {
              setEditListNameMode(true); // Otherwise, switch to edit mode
              const currentListName = shoppingLists.find(list => list.id === selectedListId)?.title || '';
              setNewListName(currentListName);
            }
          }}
          sx={{
            color: "#757575", 
            "&:hover": {
              backgroundColor: "transparent", 
              color: "#616161", 
            },
          }}
        >
          {editListNameMode ? <CheckCircleIcon /> : <EditIcon />}
        </IconButton>

        <IconButton
          onClick={() => deleteShoppingList(selectedListId)}
          sx={{
            color: "#000", // Grey color for delete icon
            "&:hover": {
              backgroundColor: "transparent", // No background color on hover for better visibility of the icon
              color: "#9E9E9E", // Darker grey on hover
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          onClick={addShoppingList}
          sx={{
            width: '38%',
            backgroundColor: "#e57373", // Choose a color that indicates danger/caution
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#e53935", // Darken the color on hover
            },
          }}
        >
          + New List
        </Button>
        </Box>
      </Box>

      {selectedListId !== null && (
        <Box
          sx={{
            background: '#a1c298',
            borderRadius: '8px',
            p: 2,
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '8px',
              p: 2,
              width: '100%',
            }}
          >

            <Box
              sx={{
                background: '#e7ede6', 
                borderRadius: '8px', 
                p: 2,
                width: '80%',
              }}
            >
            <List>
                {shoppingLists
                  .find((list) => list.id === selectedListId)
                  .items.map((item, itemIndex) => (
                    <ListItem 
                      key={itemIndex}
                      onClick={() => {
                        if (editedList !== selectedListId || editedItems[selectedListId] !== itemIndex) {
                          setEditedList(selectedListId);
                          setEditedItems({
                            ...editedItems,
                            [selectedListId]: itemIndex,
                          });
                          setEditedListValue(item);
                        }
                      }}
                      sx={itemHoverStyle}
                    >
                      <ListItemText
                        primary={
                          editedList === selectedListId && editedItems[selectedListId] === itemIndex ? (
                            <TextField
                              value={editedListValue}
                              onChange={(e) => setEditedListValue(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, selectedListId, itemIndex)}
                              InputProps={{ disableUnderline: true }}
                              sx={textFieldStyles}
                              autoFocus
                            />
                          ) : (
                            item
                          )
                        }
                      />
                      <ListItemSecondaryAction>
                        {editedList === selectedListId && editedItems[selectedListId] === itemIndex && (
                          <React.Fragment>
                            <IconButton
                              edge="end"
                              onClick={() => editItemInList(selectedListId, itemIndex)}
                              sx={{ mr: '1px', ml: '1px' }}
                            >
                              <CheckCircleIcon color="#000" />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => deleteItemFromList(selectedListId, itemIndex)}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </React.Fragment>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                ))}
                {/* Placeholder for empty list */}
                {shoppingLists.find((list) => list.id === selectedListId).items.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No items in this list" />
                    <EmptyIcon color="action" />
                  </ListItem>
                )}
              </List>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '8px',
                p: 2,
                width: '50%',
              }}
            >
              <TextField
                label="Add Item"
                value={newItems[selectedListId] || ''}
                sx={{
                  ...textFieldStyles,
                  width: '100%',
                }}
                onChange={(e) =>
                  setNewItems({ ...newItems, [selectedListId]: e.target.value })
                }
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => addItemToList(selectedListId)}
                sx={{
                  mt: 2,
                  backgroundColor: "#e57373", // Choose a color that indicates danger/caution
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#e53935", // Darken the color on hover
                  },
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default ShoppingList1;