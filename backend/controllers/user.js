import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const getUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
    
        const user = await User.findById(userId).select('-password');
    
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export const editRecipe = async (req, res) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      
      const updatedRecipe = {
          id: req.body.id,
          totalTime: req.body.totalTime,
          name: req.body.name,
          numberOfServings: req.body.numberOfServings,
          ingredientLines: req.body.ingredientLines,
          source: { recipeUrl: req.body.recipeUrl },
          mainImage: req.body.mainImage,
          instructions: req.body.instructions,
      };

      // Find the user and update the specific recipe in the user's recipes attribute
      const updatedUser = await User.findOneAndUpdate(
          { _id: userId, "recipes.id": updatedRecipe.id },
          { "$set": { "recipes.$": updatedRecipe } },
          { new: true }
      ).select('-password');

      if (!updatedUser) {
          return res.status(400).json({ error: "Error updating the recipe or recipe not found" });
      }

      res.status(200).json({ message: `${updatedRecipe.name} saved successfully!` });
  } catch (err) {
      console.error("Error in editRecipe function:", err);
      res.status(500).json({ error: err.message });
  }
};

export const deleteRecipe = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const recipe = req.body.recipe;

        const updatedRecipe = await User.findByIdAndUpdate(
            userId,
            { $pull: { recipes: { name: recipe.name } } },
            { new: true }
        ).select('-password');

        if (!updatedRecipe) {
            return res.status(400).json({ error: "Error updating recipes" });
        }

        res.status(200).json({ message: "recipe deleted successfully" });
    } catch (err) {
        console.error("Error in deleteRecipe function:", err);
        res.status(500).json({ error: err.message });
    }
};


export const saveRecipes = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const recipe = {
            id: req.body.id,
            totalTime: req.body.totalTime,
            name: req.body.name,
            numberOfServings: req.body.numberOfServings,
            ingredientLines: req.body.ingredientLines,
            source: { recipeUrl: req.body.recipeUrl },
            mainImage: req.body.mainImage,
            instructions: req.body.instructions,
        };

        const updatedUser = await User.findOneAndUpdate(
            // Check to make sure the recipe with the same id doesn't exist for the user
            { _id: userId, "recipes.id": { $ne: recipe.id } },
            { $addToSet: { recipes: recipe } }, // Use $addToSet here to ensure uniqueness, but the query condition above should already handle it
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(400).json({ error: "Error updating user recipes or recipe already exists" });
        }

        res.status(200).json({ message: "Recipe added successfully" });
    } catch (err) {
        console.error("Error in saveRecipe function:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getRecipes = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        res.status(200).json(user.recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//addIngredient to pantry
export const addIngredient = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const ingredient = req.body.ingredientName;

        const updatedPantry = await User.findOneAndUpdate(
            { _id: userId, "pantry.ingredientName": { $ne: ingredient } },
            { $addToSet: { pantry: { ingredientName: ingredient } } },
            { new: true }
        ).select('-password');

        // console.log(updatedPantry);

        if (!updatedPantry) {
            return res.status(400).json({ error: "Error updating pantry or ingredient already exists" });
        }

        res.status(200).json({ message: "Ingredient added successfully" });
    } catch (err) {
        console.error("Error in addIngredient function:", err);
        res.status(500).json({ error: err.message });
    }
};


//getting ingredient to display in the pantry
export const getFromPantry = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        res.status(200).json(user.pantry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
//deleting the ingredient from pantry
export const deleteIngredient = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const ingredient = req.body.ingredientName;

        const updatedPantry = await User.findByIdAndUpdate(
            userId,
            { $pull: { pantry: { ingredientName: ingredient } } },
            { new: true }
        ).select('-password');

        if (!updatedPantry) {
            return res.status(400).json({ error: "Error updating pantry, ingredient in pantry" });
        }

        res.status(200).json({ message: "Ingredient deleted successfully" });
    } catch (err) {
        console.error("Error in deleteIngredient function:", err);
        res.status(500).json({ error: err.message });
    }
};


// Function to update user information
export const updateUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
      
        const updatedUserData = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedUserData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(400).json({ error: "User does not exist" });
        }

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updatePreferences = async (req, res) => {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const userId = decoded.id;

        const { 
            email,
            preferences
        } = req.body;

        const updatedUser = await User.findOne({ email });
        //console.log(updatedUser);
        if (!updatedUser) {
            return res.status(400).json({ error: "User does not exist" });
        }

        updatedUser.preferences = preferences;
        await updatedUser.save();

        res.status(200).json({ message: "Preferences updated successfully", user: updatedUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const mode = async (req, res) => {
    try {
        // console.log(req.body);
        const { email, mode } = req.body;

        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
        return res.status(404).json({ error: "User not found" });
        }

        // Update the specific preference name with the updated value
        user.mode = mode;

        // Save the updated user object
        const updatedUser = await user.save();

        // console.log(`Updated mode to ${mode} successfully`);
        //console.log(`Updated ${preferenceName} preference to ${updatedValue} successfully`);

        return res.status(200).json(updatedUser);
            
    } catch (error) {
    // console.error("Error updating preference:", error);
    return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const reminder = async (req, res) => {
    try {
      const { email, reminder } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
        // Update the specific preference name with the updated value
        user.reminder = reminder;
  
        if (!reminder) {
            user.reminderSetting.everydayAt.bool = false;
            //console.log(`Updated user.reminderSetting.everydayAt.bool`);
        }

        // Save the updated user object
        const updatedUser = await user.save();
  
        // console.log(`Updated reminder to ${reminder} successfully`);
        //console.log(`Updated ${preferenceName} preference to ${updatedValue} successfully`);
  
        return res.status(200).json(updatedUser);
      
    } catch (error) {
      console.error("Error updating preference:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
export const reminderSetting = async (req, res) => {
    try {
        const { email, preferenceEmail, everydayAt, everyHour, everydayAtTime, everyHourTime } = req.body;
        // console.log("email is ", email);
        // console.log("preferenceEmail is ", preferenceEmail);
        // console.log("data.reminderSetting.everydayAt is ", everydayAt);
        // console.log("data.reminderSetting.everyHour is ", everyHour);
        // console.log("data.reminderSetting.everydayAt.time is ", everydayAtTime);
        // console.log("data.reminderSetting.everyHour.time is ", everyHourTime);
        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update the everydayAt and everydayAtTime fields
        user.reminderSetting.email = preferenceEmail;
        user.reminderSetting.everydayAt.bool = everydayAt;
        //user.reminderSetting.everyHour.bool = everyHour;
        user.reminderSetting.everydayAt.time = everydayAtTime;
        //user.reminderSetting.everyHour.time = everyHourTime;

        // Save the updated user object
        const updatedUser = await user.save();

        // console.log(`Updated preferenceEmail to ${preferenceEmail}`);
        // console.log(`Updated everydayAt to ${everydayAt} and everydayAtTime to ${everydayAtTime} successfully`);
        // console.log(`Updated everyHour to ${everyHour} and everydayAtTime to ${everyHourTime} successfully`);

        return res.status(200).json(updatedUser);
        
    } catch (error) {
        console.error("Error updating reminderSetting:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}  

export const retreiveDietaryTags = async (req, res) =>  {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(400).json({ error: "User does not exist" });
    }
    res.status(200).json(user.filters);
} catch (err) {
    res.status(500).json({ error: err.message });
}

}



export const deleteAccount = async (req, res) => {
    try {
        const { email } = req.body;
        // console.log("email is ", email);

        // Find and delete user
        // const result = await User.deleteOne({ email });
        const result = await User.deleteOne("x");       // [MODIFY] For presentation purposes

        // Check if deletion was successful
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'User account deleted successfully.' });
        } else {
            res.status(400).json({ error: 'No account found with the provided email address.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'User information retrieval failed' });
    }
}

export const createShoppingList = async (req, res) => {
  try {
    const { email, newList } = req.body;

    const user = await User.findOne({ email }); // Find the user by email

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Create a new shopping list
    const newShoppingList = {
      id: newList.id,
      title: newList.title,
      items: [],
    };

    user.shoppingLists.push(newShoppingList); // Push the new shopping list to the user's array
    await user.save();

    // Log the ID and name of the newly created shopping list
    // console.log("New Shopping List Name:", newShoppingList.title);
    // console.log("New Shopping List ID:", newShoppingList.id);

    // Print all shopping lists in the schema
    user.shoppingLists.forEach((list) => {
      // console.log("Shopping List Name:", list.title);
      // console.log("Shopping List ID:", list.id);
    });

    res.status(200).json({ message: "Shopping list created successfully" });
  } catch (err) {
    console.error("Error in createShoppingList function:", err);
    res.status(500).json({ error: err.message });
  }
};


export const deleteShoppingList = async (req, res) => {
  try {
    const { email, listId } = req.body;

    // console.log("Deleting shopping list with ID:", listId); // Print the listId

    const user = await User.findOne({ email }); // Find the user by email

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Find the index of the shopping list with the specified listId
    const listIndex = user.shoppingLists.findIndex((list) => list.id.toString() === listId.toString());

    if (listIndex === -1) {
      // console.log("Shopping list not found");
      return res.status(404).json({ error: "Shopping list not found" });
    }

    // console.log("List index found:", listIndex); // Print the list index

    // Remove the shopping list with the specified listId
    user.shoppingLists.splice(listIndex, 1);

    await user.save();

    res.status(200).json({ message: "Shopping list deleted successfully" });
  } catch (err) {
    console.error("Error in deleteShoppingList function:", err);
    res.status(500).json({ error: err.message });
  }
};


  
  export const getShoppingLists = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: "User does not exist" });
      }
  
      // Assuming the shopping lists are stored in the 'shoppingLists' property of the user document
      const shoppingLists = user.shoppingLists;
  
      // console.log("Shopping Lists:");
      shoppingListInfo.forEach((list) => {
        console.log("ID:", list.id, "Name:", list.name);
      });
  
      res.status(200).json(shoppingLists);
    } catch (err) {
      console.error("Error in getShoppingLists function:", err);
      res.status(500).json({ error: err.message });
    }
  };
  
  
  export const editShoppingList = async (req, res) => {
    try {
      const { email, listId, newListName } = req.body;
  
      // console.log("Editing shopping list with ID:", listId, "New name:", newListName);
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: "User does not exist" });
      }
  
      console.log("Before Update - Shopping Lists:");
      user.shoppingLists.forEach((list) => {
        console.log("List ID:", list.id, "Name:", list.title); // Print the list ID and name
      });
    
      const listIndex = user.shoppingLists.findIndex((list) => list.id.toString() === listId.toString());
  
      if (listIndex === -1) {
        console.log("Shopping list not found");
        return res.status(404).json({ error: "Shopping list not found" });
      }
  
      console.log("List index found:", listIndex); // Print the list index
  
      user.shoppingLists[listIndex].title = newListName;
  
      console.log("Editing shopping list with ID:", listId, "Old name:", user.shoppingLists[listIndex].title, "New name:", newListName);
  
      console.log("After Update - Shopping Lists:");
      user.shoppingLists.forEach((list) => {
        console.log("List ID:", list.id, "Name:", list.title); // Print the list ID and name
      });
  
      await user.save();
  
      res.status(200).json({ message: "Shopping list edited successfully" });
    } catch (err) {
      console.error("Error in editShoppingList function:", err);
      res.status(500).json({ error: err.message });
    }
  };
  

// Add missing ingredient to default shopping list
export const addMissingIngredient = async (req, res) => {
  try {
    const { email, item, quantity, unit } = req.body;  // Assuming unit is also passed in req.body

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the shopping list by title "All Missing Ingredients"
    const shoppingList = user.shoppingLists.find(
      (list) => list.title === "All Missing Ingredients"
    );

    if (!shoppingList) {
      // If the specific list doesn't exist, we could optionally create one. 
      // For now, we'll just return an error.
      return res.status(404).json({ error: 'Shopping list not found' });
    } else {
      // Check if the item already exists in the list
      const existingItem = shoppingList.items.find(
        (listItem) => listItem.item === item
      );

      if (existingItem) {
        // If the item exists, increment its quantity by the provided quantity.
        existingItem.quantity += quantity;
      } else {
        // If the item doesn't exist, add it to the list.
        shoppingList.items.push({ item, quantity, unit });
      }
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Item added to the shopping list successfully' });
  } catch (err) {
    console.error('Error in addMissingIngredient function:', err);
    res.status(500).json({ error: err.message });
  }
};



// Add item to shopping list
export const addToShoppingList = async (req, res) => {
  try {
    const { email, listId, item, quantity } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // console.log(
    //   'Adding to shopping list with ID:',
    //   listId,
    //   'item name:',
    //   item,
    //   'quantity:',
    //   quantity
    // );

    const listIndex = user.shoppingLists.findIndex(
      (list) => list.id.toString() === listId.toString()
    );

    if (listIndex === -1) {
      console.log('Shopping list not found');
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    console.log('List index found:', listIndex); // Print the list index

    // Find the shopping list by listId
    const shoppingList = user.shoppingLists[listIndex];

    // Add the item with quantity to the shopping list
    shoppingList.items.push({ item, quantity });

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Item added to the shopping list successfully' });
  } catch (err) {
    console.error('Error in addToShoppingList function:', err);
    res.status(500).json({ error: err.message });
  }
};

export const editInShoppingList = async (req, res) => {
  try {
    const { email, listId, itemBeforeEdit, itemAfterEdit, quantity, unit } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // console.log(
    //   "Editing in shopping list with ID:",
    //   listId,
    //   "Item before edit:",
    //   itemBeforeEdit,
    //   "Item after edit:",
    //   itemAfterEdit
    // );

    const listIndex = user.shoppingLists.findIndex(
      (list) => list.id.toString() === listId.toString()
    );

    if (listIndex === -1) {
      console.log("Shopping list not found");
      return res.status(404).json({ error: "Shopping list not found" });
    }

    console.log("List index found:", listIndex); // Print the list index

    // Find the shopping list by listId
    const shoppingList = user.shoppingLists[listIndex];

    const itemIndex = shoppingList.items.findIndex(
      (item) => item.item === itemBeforeEdit
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ error: "Item not found in the shopping list" });
    }

    // Update the item name, quantity, and unit in the shopping list
    shoppingList.items[itemIndex].item = itemAfterEdit;
    shoppingList.items[itemIndex].quantity = quantity;
    shoppingList.items[itemIndex].unit = unit;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: `Item "${itemBeforeEdit}" edited to "${itemAfterEdit}" with quantity "${quantity}" and unit "${unit}" in the shopping list successfully`,
    });
  } catch (err) {
    console.error("Error in editInShoppingList function:", err);
    res.status(500).json({ error: err.message });
  }
};

    
  

  export const deleteFromShoppingList = async (req, res) => {
    try {
      const { email, listId, itemName } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // console.log("deleting to shopping list with ID:", listId, "item name:", itemName);
  
      // Find the shopping list by listId
      const shoppingList = user.shoppingLists.find((list) => list.id === listId);
  
      if (!shoppingList) {
        return res.status(404).json({ error: "Shopping list not found" });
      }
  
      // Remove the item with the specified itemName from the shopping list
      shoppingList.items = shoppingList.items.filter((item) => item.item !== itemName);
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: `Item "${itemName}" deleted from the shopping list successfully` });
    } catch (err) {
      console.error("Error in deleteFromShoppingListByName function:", err);
      res.status(500).json({ error: err.message });
    }
  };

  export const createFolder = async (req, res) => {
    console.log(req.body);
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const newFolder = {
            name: req.body.name,
            recipes: req.body.recipes || []
        };

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { folders: newFolder } },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ error: "Error creating folder" });
        }

        res.status(200).json({ message: "Folder created successfully", folder: newFolder });
    } catch (err) {
        console.error("Error in createFolder function:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getFolders = async (req, res) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await User.findById(userId, 'folders');
      res.status(200).json(user.folders);
  } catch (err) {
      console.error("Error in getFolders function:", err);
      res.status(500).json({ error: err.message });
  }
};

export const addRecipeToFolder = async (req, res) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      
      const folderName = req.body.folderName;
      const recipe = req.body.recipe;

      const user = await User.findOneAndUpdate(
          { _id: userId, "folders.name": folderName },
          { $addToSet: { "folders.$.recipes": recipe } },
          { new: true }
      );

      if (!user) {
          return res.status(400).json({ error: "Error adding recipe to folder" });
      }

      res.status(200).json({ message: "Recipe added successfully to folder" });
  } catch (err) {
      console.error("Error in addRecipeToFolder function:", err);
      res.status(500).json({ error: err.message });
  }
};
export const removeRecipeFromFolder = async (req, res) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const folderName = req.body.folderName;
      const recipeId = req.body.recipeId; // This is the id of the recipe you want to remove

      const user = await User.findOneAndUpdate(
          { _id: userId, 'folders.name': folderName },
          { $pull: { 'folders.$.recipes': { _id: recipeId } } }, // This pulls the recipe with the provided ID from the recipes array in the folder
          { new: true }
      );

      if (!user) {
          return res.status(400).json({ error: "Error removing recipe from folder" });
      }

      res.status(200).json({ message: "Recipe removed from folder successfully" });
  } catch (err) {
      console.error("Error in removeRecipeFromFolder function:", err);
      res.status(500).json({ error: err.message });
  }
};

export const deleteFolder = async (req, res) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const folderName = req.body.folderName;

      const user = await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { folders: { name: folderName } } },
          { new: true }
      );

      if (!user) {
          return res.status(400).json({ error: "Error deleting folder" });
      }

      res.status(200).json({ message: "Folder deleted successfully" });
  } catch (err) {
      console.error("Error in deleteFolder function:", err);
      res.status(500).json({ error: err.message });
  }
};