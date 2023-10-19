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
        
        const ingredientList = req.body;
        console.log(ingredientList);
        const query = `
        {
            searchRecipesByIngredients(
              mustIngredients: ${ingredientList}
            ) {
              edges {
                node {
                  name
                  ingredients {
                    name
                  }
                 ingredientLines
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



