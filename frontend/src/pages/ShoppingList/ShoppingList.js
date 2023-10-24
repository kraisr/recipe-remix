import React, { useState } from 'react';
import './shoppingList.css';
import { Typography, Button, IconButton, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const ShoppingList = () => {
  const [shoppingLists, setShoppingLists] = useState([{ title: 'Shopping List 1', items: [] }]);
  const [missingIngredients, setMissingIngredients] = useState(['Missing Ingredient 1']);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const [editType, setEditType] = useState(null);

  const addShoppingList = () => {
    setShoppingLists([...shoppingLists, { title: `Shopping List ${shoppingLists.length + 1}`, items: [] }]);
  };

  const addMissingIngredient = () => {
    setMissingIngredients([...missingIngredients, `Missing Ingredient ${missingIngredients.length + 1}`]);
  };

  const deleteShoppingList = (index) => {
    const updatedLists = [...shoppingLists];
    updatedLists.splice(index, 1);
    setShoppingLists(updatedLists);
  };

  const deleteMissingIngredient = (index) => {
    const updatedIngredients = [...missingIngredients];
    updatedIngredients.splice(index, 1);
    setMissingIngredients(updatedIngredients);
  };

  const deleteItemInShoppingList = (listIndex, itemIndex) => {
    const updatedLists = [...shoppingLists];
    updatedLists[listIndex].items.splice(itemIndex, 1);
    setShoppingLists(updatedLists);
  };

  const handleEdit = (index, type) => {
    setIsEditing(true);
    setEditType(type);
    setEditIndex(index);
    if (type === 'shoppingList') {
      setEditedTitle(shoppingLists[index].title);
    } else if (type === 'missingIngredient') {
      setEditedTitle(missingIngredients[index]);
    } else {
      setEditedTitle(shoppingLists[selectedListIndex].items[index]);
    }
  };

  const handleSaveEdit = (index) => {
    if (editType === 'shoppingList') {
      const updatedLists = [...shoppingLists];
      updatedLists[index].title = editedTitle;
      setShoppingLists(updatedLists);
    } else if (editType === 'missingIngredient') {
      const updatedIngredients = [...missingIngredients];
      updatedIngredients[index] = editedTitle;
      setMissingIngredients(updatedIngredients);
    } else {
      const updatedLists = [...shoppingLists];
      updatedLists[selectedListIndex].items[index] = editedTitle;
      setShoppingLists(updatedLists);
    }
    setIsEditing(false);
    setEditIndex(-1);
    setEditType(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(-1);
    setEditType(null);
  };

  const addIngredientToShoppingList = (ingredient) => {
    const updatedLists = [...shoppingLists];
    updatedLists[selectedListIndex].items.push(ingredient);
    setShoppingLists(updatedLists);
  };

  return (
    <div>
      <div className="shopping-list-title">
        <Typography variant="h4">Shopping Lists</Typography>
        <Button variant="contained" color="primary" onClick={addShoppingList}>
          + Add Shopping List
        </Button>
      </div>

      {shoppingLists.map((list, index) => (
        <div key={index} className="shopping-list">
          <div className="list-header">
            {isEditing && editIndex === index && editType === 'shoppingList' ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <Button onClick={() => handleSaveEdit(index)}>Save</Button>
                <Button onClick={handleCancelEdit}>Cancel</Button>
              </>
            ) : (
              <>
                <Typography variant="h6">{list.title}</Typography>
                <IconButton onClick={() => handleEdit(index, 'shoppingList')}>
                  <EditIcon />
                </IconButton>
                <Button color="error" onClick={() => deleteShoppingList(index)}>
                  Delete
                </Button>
              </>
            )}
          </div>

          {list.items.map((item, itemIndex) => (
            <div key={itemIndex} className="shopping-list-item">
              {isEditing && editIndex === itemIndex && editType === 'item' ? (
                <>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <Button onClick={() => handleSaveEdit(itemIndex)}>Save</Button>
                  <Button onClick={handleCancelEdit}>Cancel</Button>
                </>
              ) : (
                <>
                  <Typography variant="body1">{item}</Typography>
                  <IconButton onClick={() => handleEdit(itemIndex, 'item')}>
                    <EditIcon />
                  </IconButton>
                  <Button color="error" onClick={() => deleteItemInShoppingList(index, itemIndex)}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="missing-ingredients-title">
        <Typography variant="h4">Missing Ingredients</Typography>
        <Button variant="contained" color="primary" onClick={addMissingIngredient}>
          + Add Missing Ingredient
        </Button>
      </div>

      <Select value={selectedListIndex} onChange={(e) => setSelectedListIndex(e.target.value)}>
        {shoppingLists.map((list, index) => (
          <MenuItem key={index} value={index}>
            {list.title}
          </MenuItem>
        ))}
      </Select>

      {missingIngredients.map((ingredient, index) => (
        <div key={index} className="missing-ingredient">
          {isEditing && editIndex === index && editType === 'missingIngredient' ? (
            <>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <Button onClick={() => handleSaveEdit(index)}>Save</Button>
              <Button onClick={handleCancelEdit}>Cancel</Button>
            </>
          ) : (
            <>
              <Typography variant="body1">{ingredient}</Typography>
              <IconButton onClick={() => handleEdit(index, 'missingIngredient')}>
                <EditIcon />
              </IconButton>
              <Button color="error" onClick={() => deleteMissingIngredient(index)}>
                Delete
              </Button>
              <Button color="primary" onClick={() => addIngredientToShoppingList(ingredient)}>
                Add to List
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShoppingList;
