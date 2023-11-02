const query = `
      query RecipeSearch($ingredientNames, $selectedDietaryTags) {
        recipeSearch(
          filter: {
            must: [
              { ingredients: $ingredientNames },
              $selectedDietaryTags
            ]
          }
        ) {
          edges {
            node {
              id
              name
              ingredients {
                name
              }
              ingredientLines
              totalTime
              tags
              maxPrepTime
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

import fetch from "node-fetch";



export const searchIngredients = async (req, res) => {
    // console.log("searchIngredients endpoint hit");


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

        // console.log("Data from Suggestic API:", data);

        res.json(data);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



export const searchRecipes = async (req, res) => {
    // console.log("searchRecipes endpoint hit");
    try {
        
        const ingredientList = req.body.ingredientNames;
        // console.log("ingredient list:", ingredientList);
       // const dietaryTag = req.body.dietaryTag; 
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

        const text = await response.text();
        console.log("Response Text:", text);

        // Try parsing the response
        const data = JSON.parse(text);
        
        const matchedRecipes = data.data.searchRecipesByIngredients.edges.map(edge => edge.node);
        
        console.log("Data from Suggestic API:", data);
        console.log("matched recipes: ", matchedRecipes);

        res.json(data);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

export const recipeSearch = async (req, res) => {
  try {
    console.log("we're in recipe search wow")
    console.log(req.body);
    const ingredientList = req.body.ingredientNames;
    console.log('Receiving ingredientNames was successful! Here they are:', ingredientList);
    const selectedDietaryTags = req.body.dietaryTags; // Assuming this is how you receive the selected dietary tags
    console.log('Retreiving dietary tags was successful! Here they are:', selectedDietaryTags);

    const query = `
      query RecipeSearch( $ingredientNames: [String!], $selectedDietaryTags: [String]) {
        recipeSearch(
          filter: {
            must: [
              { ingredients: $ingredientNames },
              { tags: $selectedDietaryTags}
            ]
          }
        ) {
          edges {
            node {
              id
              name
              ingredients {
                name
              }
              ingredientLines
              totalTime
              tags
              
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

    const variables = {
      ingredientNames: ingredientList,
      selectedDietaryTags: selectedDietaryTags, // Pass selected dietary tags here
    };

    const response = await fetch("https://production.suggestic.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.SUGGESTIC_TOKEN}`,
        "sg-user": process.env.SUGGESTIC_USER_ID,
      },
      body: JSON.stringify({ query, variables }), // Pass variables in the request body
    });
  
    const text = await response.text();
    console.log("Response Text:", text);

    // Try parsing the response
    const data = JSON.parse(text);

    const matchedRecipes = data.data.recipeSearch.edges.map((edge) => edge.node);

    console.log("Data from Suggestic API:", data);
    console.log("Matched recipes: ", matchedRecipes);

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error RAHHH", details: error.message });
  }
};

  
export const searchAllRecipes = async (req, res) => {
    console.log("searchAllRecipes endpoint hit");
    try {
        const searchTerm = req.body.searchTerm; // Assuming you'll send the search term in the request body

        // Create a GraphQL query to search for recipes by name
        const query = `
        {
            searchRecipeByNameOrIngredient(query: "${searchTerm}") {
            onPlan {
                id
                name
                servingWeight
                author
            }
            otherResults {
                id
                name
                servingWeight
                author
            }
            }
        }
        `;


        const variables = {
            searchTerm
        };
        //console.log("search: ", searchTerm);

        const response = await fetch("https://production.suggestic.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${process.env.SUGGESTIC_TOKEN}`,
                "sg-user": process.env.SUGGESTIC_USER_ID
            },
            body: JSON.stringify({ query, variables })
        });

        const data = await response.json();
        console.log("data: ", data);
        // const matchedRecipes = data.data.searchRecipeByNameOrIngredient.edges.map(edge => edge.node);
        const searchResult = data.data.searchRecipeByNameOrIngredient;
        
        const recipeNames = searchResult.onPlan.map(result => result.name);
        console.log("name:", recipeNames);


        // Now you can work with the array of recipe names
   

        res.json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



