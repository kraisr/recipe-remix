import fetch from "node-fetch";



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

export const searchRecipes = async (req, res) => {
    console.log("searchRecipes endpoint hit");
    try {
        
        const ingredientList = req.body.ingredientNames;
        console.log("ingredient list:", ingredientList);
        
        const query = `
        query SearchRecipes($ingredientNames: [String]!) {
            searchRecipesByIngredients(
              mustIngredients: $ingredientNames
            ) {
              edges {
                node {
                  name
                  ingredients {
                    name
                  }
                  ingredientLines
                  id
                  totalTime
                  numberOfServings
                  source {
                    recipeUrl
                  }
                  mainImage
                  instructions

                }
              }
            }
        }
        `;
// databaseId

        const variables = {
            ingredientNames: ingredientList
        };

        const response = await fetch("https://production.suggestic.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${process.env.SUGGESTIC_TOKEN}`,
                "sg-user": process.env.SUGGESTIC_USER_ID
            },
            body: JSON.stringify({ query,  variables})
        });

        const data = await response.json();
        const matchedRecipes = data.data.searchRecipesByIngredients.edges.map(edge => edge.node);
        
        console.log("Data from Suggestic API:", data);
        console.log("matched recipes: ", matchedRecipes);

        res.json(data);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



