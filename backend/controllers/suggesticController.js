import { GraphQLClient } from 'graphql-request';
import fetch from 'node-fetch';


// const graphqlEndpoint = 'https://production.suggestic.com/graphql';
// const client = new GraphQLClient(graphqlEndpoint, {
//     headers: {
//         Authorization: "Token " + process.env.SUGGESTIC_TOKEN,
//         "sg-user": process.env.SUGGESTIC_USER_ID
//     },
// });


// export const searchIngredients = async (req, res) => {
//     console.log("searchIngredients function called");
//     try {
//         const searchTerm = req.body.query; // Assuming you send ingredients as an array in the request body

//         const query = `
//         {
//             ingredientSearch(query: "${searchTerm}") {
//                 edges {
//                     node {
//                         ... on EdamamFoodResult {
//                             id
//                             label
//                             databaseId
//                         }
//                     }
//                 }
//             }
//         }
//         `;

//         const data = await client.request(query);
//         res.json(data);

//     } catch (error) {
//         console.error('Detailed Error:', error);
//         console.error('Error Stack:', error.stack);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
// };

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

        const response = await fetch('https://production.suggestic.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${process.env.SUGGESTIC_TOKEN}`,
                'sg-user': process.env.SUGGESTIC_USER_ID
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        console.log("Data from Suggestic API:", data);

        res.json(data);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
