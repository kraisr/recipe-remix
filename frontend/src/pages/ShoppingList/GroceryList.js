import React, { useState, useEffect } from 'react';
import './shoppingList.css';
//import './print-styles.css'; // Import the print-specific CSS

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


const GroceryList = () => {
  const [userEmail, setUserEmail] = useState('');
  const [lastListNumber, setLastListNumber] = useState(0);

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
  
  const handlePrint = () => {
    if (selectedListId !== null) {
      const list = shoppingLists.find((list) => list.id === selectedListId);
      if (list) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
  
        iframe.contentDocument.open();
        iframe.contentDocument.write(`
          <html>
            <head>
              <title>${list.title}</title>
              <style>
                /* Add your CSS styles here */
                body {
                  font-family: Arial, sans-serif;
                  margin: 10px;
                }
                .print-header {
                  text-align: center;
                }
                .print-list-name {
                  font-size: 24px;
                  font-weight: bold;
                }
                .print-ingredients ul {
                  list-style-type: none;
                  padding: 0;
                }
                .print-ingredients li {
                  margin-bottom: 5px;
                }
              </style>
            </head>
            <body>
              <div class="print-header">
                <div class="print-list-name">${list.title}</div>
              </div>
              <div class="print-ingredients">
                <ul>
                  ${list.items
                    .map(
                      (item) =>
                        `<li>${item.item} - ${item.quantity} ${item.unit}</li>`
                    )
                    .join('')}
                </ul>
              </div>
            </body>
          </html>
        `);
        iframe.contentDocument.close();
  
        iframe.contentWindow.print();
  
        document.body.removeChild(iframe);
      }
    }
  };

  const handleQuantityChange = (listId, itemIndex, newQuantity) => {
    const updatedLists = [...shoppingLists];
    const list = updatedLists.find(list => list.id === listId);
    
    if (list && list.items[itemIndex]) {
        list.items[itemIndex].quantity = newQuantity;
        setShoppingLists(updatedLists);
    } else {
        console.error("List or item not found for updating quantity.");
    }
};

const handleUnitChange = (listId, itemIndex, newUnit) => {
  const updatedLists = [...shoppingLists];
  const list = updatedLists.find(list => list.id === listId);
  
  if (list && list.items[itemIndex]) {
      list.items[itemIndex].unit = newUnit;
      setShoppingLists(updatedLists);
  } else {
      console.error("List or item not found for updating unit.");
  }
};


  useEffect(() => {
    const fetchUserGroceryList = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
  
        const response = await fetch("http://localhost:8080/user/user", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
  
        // Transform the shopping lists data to include the items structure
        const transformedShoppingLists = data.shoppingLists.map((list) => ({
          ...list,
          items: list.items.map((item) => ({
            item: item.item,
            quantity: item.quantity,
            unit: item.unit
          })),
        }));
  
        setUserEmail(data.email);
        setShoppingLists(transformedShoppingLists);
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };
    fetchUserGroceryList();
    fetchShoppingListNames();
  }, []);
  
  useEffect(() => {
    if (selectedListId !== null) {
      const selectedList = shoppingLists.find((list) => list.id === selectedListId);
      if (selectedList) {
        console.log(`Selected Shopping List: ${selectedList.title}`);
      }
    }
  }, [selectedListId, shoppingLists]);

  const fetchShoppingListNames = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/getShoppingLists", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      // Assuming the response contains an array of shopping lists
      const data = await response.json();
  
      // Extract the list numbers from the titles and find the greatest number
      const listNumbers = data.map((list) => {
        const match = list.title.match(/^New List (\d+)$/);
        return match ? parseInt(match[1]) : 0;
      });
      const greatestNumber = Math.max(...listNumbers);
  
      // Set the last list number in the state
      setLastListNumber(greatestNumber);
    } catch (error) {
      // Handle errors: show a message to the user, log, etc.
      console.error("Error fetching shopping list names:", error);
    }
  };

  
  const addShoppingList = async () => {
    const maxListNumber = Math.max(
      ...shoppingLists.map((list) => {
        const match = list.title.match(/^New List (\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
    );
  
    const newList = {
      id: Date.now(),
      title: `New List ${maxListNumber + 1}`,
      items: [],
    };
  
    const requestBody = {
      email: userEmail,
      newList: newList,
    };
  
    console.log("Request Body:", requestBody);

    try {
      const response = await fetch("http://localhost:8080/user/createShoppingList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Pass the requestBody as JSON string
      });
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Update the local state after a successful request
      setShoppingLists([...shoppingLists, newList]);
      setSelectedListId(newList.id);
  
      // Optional: Update UI to reflect changes
      // For example, show a success message to the user
      console.log("Shopping list created successfully!");
  
    } catch (error) {
      // Handle errors: show a message to the user, log, etc.
      console.error('Error creating shopping list:', error);
    }
  };

  const deleteShoppingList = async (listId) => {
    const updatedLists = shoppingLists.filter((list) => list.id !== listId);
    setShoppingLists(updatedLists);
    if (listId === selectedListId) {
      setSelectedListId(null);
    }
    const requestBody = {
      email: userEmail,
      listId: listId,
    };
    try {
      const response = await fetch("http://localhost:8080/user/deleteShoppingList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Pass the requestBody as JSON string
      });
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Optional: Update UI to reflect changes
      // For example, show a success message to the user
      console.log("Shopping list deleted successfully!");
  
    } catch (error) {
      // Handle errors: show a message to the user, log, etc.
      console.error('Error deleting shopping list:', error);
    }
  };
  
  const handleEditListName = async () => {
    const updatedLists = shoppingLists.map((list) =>
  list.id === selectedListId ? { ...list, id: selectedListId, title: newListName } : list
);
    setShoppingLists(updatedLists);
    setEditListNameMode(false);
    const requestBody = {
      email: userEmail,
      listId: selectedListId,
      newListName: newListName,
    };

    console.log("Request Body:", requestBody);

    try {
      const response = await fetch("http://localhost:8080/user/editShoppingList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Pass the requestBody as JSON string
      });
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Optional: Update UI to reflect changes
      // For example, show a success message to the user
      console.log("Shopping list edit successfully!");
  
    } catch (error) {
      // Handle errors: show a message to the user, log, etc.
      console.error('Error editing shopping list:', error);
    }
  };

  const deleteItemFromList = async (listId, itemId) => {
    const updatedLists = [...shoppingLists];
    const list = updatedLists.find((list) => list.id === listId);
    if (list) {
      const itemToDelete = list.items[itemId]; // Define itemToDelete within the if block
      list.items = list.items.filter((item) => item !== itemToDelete);
      setShoppingLists(updatedLists);
      // Reset editing states if the item being deleted is currently being edited
      if (editedList === listId && editedItems[listId] === itemId) {
        setEditedList(null);
        setEditedItems({ ...editedItems, [listId]: undefined });
        setEditedListValue('');
      }
  
      const requestBody = {
        email: userEmail,
        listId: selectedListId,
        itemName: itemToDelete.item, // Pass the item name to be deleted
      };
  
      console.log("Request Body:", requestBody);
  
      try {
        const response = await fetch("http://localhost:8080/user/deleteFromShoppingList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody), // Pass the requestBody as a JSON string
        });
  
        // Check if the response is ok (status 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Optional: Update UI to reflect changes
        // For example, show a success message to the user
        console.log("Item deleted from the shopping list successfully!");
      } catch (error) {
        // Handle errors: show a message to the user, log, etc.
        console.error('Error deleting item from shopping list:', error);
      }
    }
  };
  
  
  const addItemToList = async (listId) => {
    if (newItems[listId].trim() === '') return;
    const updatedLists = [...shoppingLists];
    const list = updatedLists.find((list) => list.id === listId);
    if (list) {
      const newItemName = newItems[listId];
      const newItem = { item: newItemName, quantity: 1 }; // Create the item object
      list.items.push(newItem);
      setShoppingLists(updatedLists);
      setNewItems({ ...newItems, [listId]: '' });
      // Reset the editing states when a new item is added
      setEditedList(null);
      setEditedItems({ ...editedItems, [listId]: undefined });
      setEditedListValue('');
      console.log(`Added "${newItemName}" to List ID ${listId}`);
    }
    const requestBody = {
      email: userEmail,
      listId: selectedListId,
      item: newItems[listId], // Use newItemValue as an array
      quantity: 1, // Assuming quantity is always 1 for now
    };
  
    console.log("Request Body:", requestBody);
  
    try {
      const response = await fetch("http://localhost:8080/user/addToShoppingList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Pass the requestBody as a JSON string
      });
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Optional: Update UI to reflect changes
      // For example, show a success message to the user
      console.log("Item added to the shopping list successfully!");
    } catch (error) {
      // Handle errors: show a message to the user, log, etc.
      console.error('Error adding item to shopping list:', error);
    }
  };
  
  const editItemInList = async (listId, itemId) => {
    const updatedLists = [...shoppingLists];
    const list = updatedLists.find((list) => list.id === listId);
    if (list) {
      const itemBeforeEdit = list.items[itemId].item; // Get the item name before edit
      list.items[itemId].item = editedListValue; // Update the item name
      setShoppingLists(updatedLists);
      setEditedItems({ ...editedItems, [listId]: '' });
      setEditedList(null);
      setEditedListValue(''); // Reset the edited item value after updating
      const itemAfterEdit = editedListValue; // Get the item name after edit
  
      const requestBody = {
        email: userEmail,
        listId: listId,
        itemBeforeEdit: itemBeforeEdit,
        itemAfterEdit: itemAfterEdit,
        quantity: list.items[itemId].quantity, // Add this line
        unit: list.items[itemId].unit    // Add this line
      };
  
      console.log("Request Body:", requestBody);
  
      try {
        const response = await fetch("http://localhost:8080/user/editInShoppingList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody), // Pass the requestBody as a JSON string
        });
  
        // Check if the response is ok (status 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Optional: Update UI to reflect changes
        // For example, show a success message to the user
        console.log("Item edited in the shopping list successfully!");
      } catch (error) {
        // Handle errors: show a message to the user, log, etc.
        console.error('Error editing item in shopping list:', error);
      }
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
    backgroundColor: "#e57373",
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#e53935",
    },
  }}
>
  + New List
</Button>
<Button
        variant="outlined"
        onClick={handlePrint} 
        sx={{
          ml: 1,
          borderColor: "#e57373",
          color: "#e57373",
          "&:hover": {
            backgroundColor: "transparent",
            color: "#e53935",
          },
        }}
      >
        Print
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
            setEditedListValue(item.item);
        }
    }}
    sx={itemHoverStyle}
>
    {/* Use a grid layout to align items with specified proportions */}
    <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 1fr 1fr 2fr', alignItems: 'center' }}>
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
                    item.item
                )
            }
        />
        
        {editedList === selectedListId && editedItems[selectedListId] === itemIndex ? (
            <React.Fragment>
                <IconButton
                    onClick={() => editItemInList(selectedListId, itemIndex)}
                    sx={{ mr: '1px', ml: '1px' }}
                >
                    <CheckCircleIcon color="#000" />
                </IconButton>
                <IconButton
                    onClick={() => deleteItemFromList(selectedListId, itemIndex)}
                >
                    <DeleteIcon color="error" />
                </IconButton>
            </React.Fragment>
        ) : (
            <>
                <div></div> {/* Placeholder for save button */}
                <div></div> {/* Placeholder for delete button */}
            </>
        )}

        {/* Quantity Dropdown */}
        <Select
            value={item.quantity}
            onChange={(e) => handleQuantityChange(selectedListId, itemIndex, e.target.value)}
        >
            {[...Array(10).keys()].map(num => (
                <MenuItem key={num + 1} value={num + 1}>
                    {num + 1}
                </MenuItem>
            ))}
        </Select>
        
        {/* Unit Dropdown */}
        <Select
            value={item.unit}
            onChange={(e) => handleUnitChange(selectedListId, itemIndex, e.target.value)}
        >
            {["count", "ounce", "gram", "liter", "kg"].map(unit => (
                <MenuItem key={unit} value={unit}>
                    {unit}
                </MenuItem>
            ))}
        </Select>
    </div>
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

export default GroceryList;