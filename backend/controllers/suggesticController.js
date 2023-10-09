import fetch from "node-fetch";
import User from "../models/User.js"; // Import the User model



export const searchIngredients = async (req, res) => {
    console.log("searchIngredients endpoint hit");


    try {
        const searchTerm = req.body.query;

        const query = `
        {
            ingredientSearch(query: "${searchTerm}") {
                edges {
                    node {
                        ... on EdamamFoodResult {
                            label
                        }
                    }
                }
            }
        }
        `;
// databaseId
//id

        const response = await fetch("https://production.suggestic.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${process.env.SUGGESTIC_TOKEN}`,
                "sg-user": process.env.SUGGESTIC_USER_ID
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        console.log("Data from Suggestic API:", data);

        res.json(data);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



export const addIngredientToPantry = async (req, res) => {
    const { userId, ingredient } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.pantry.push({ ingredientName: ingredient });
        await user.save();

        res.json({ message: "Ingredient added to pantry successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

export const getPantryIngredients = async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ pantry: user.pantry });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


