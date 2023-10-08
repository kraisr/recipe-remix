import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongoDB/connect.js";
import authRoutes from "./routes/auth-routes.js";
import suggesticRoutes from "./routes/suggesticRoutes.js";

dotenv.config();
// import { GraphQLClient } from 'graphql-request';
// import axios from 'axios';


// create express app
const app = express(); 

/* add middlewares */
app.use(cors());
app.use(express.json({ limit: '50mb' }));

/* add routes */
app.use("/auth", authRoutes);

/* SUGGESTIC API */
app.use('/api', suggesticRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// define a callback function with request and response parameters
app.get('/', (req, res) => {
  res.send({ message: 'Hello World!' });
});

/* start express server */

//////

// axios.post('https://production.suggestic.com/graphql', {
//     query: `
//     {
//       ingredientSearch(query: "butter") {
//           edges {
//               node {
//                   ... on EdamamFoodResult {
//                       id
//                       label
//                       databaseId
//                   }
//               }
//           }
//       }
//     }
//     `,
//     headers: {
//         Authorization: "Token " + process.env.SUGGESTIC_TOKEN,
//         "sg-user": process.env.SUGGESTIC_USER_ID
//     }
// })
// .then(response => {
//     console.log('GraphQL Endpoint is accessible:', response.status);
// })
// .catch(error => {
//     console.error('Error accessing GraphQL Endpoint:', error.message);
// });



// // SUGGESTIC API

//  // Create a GraphQL client with headers
//  const graphqlEndpoint = 'https://production.suggestic.com/graphql';
//  const client = new GraphQLClient(graphqlEndpoint, {
//      headers: {
//          Authorization: "Token " + process.env.SUGGESTIC_TOKEN,
//          "sg-user": process.env.SUGGESTIC_USER_ID
//      },
//  });
 
// app.get('/suggestic-recipes', async (req, res) => {
//   try {

//     // Define your GraphQL query

//     //create a variable to put in the array of mustIngredients
//     const query = `
//     {
//       ingredientSearch(query: "butter") {
//           edges {
//               node {
//                   ... on EdamamFoodResult {
//                       id
//                       label
//                       databaseId
//                   }
//               }
//           }
//       }
//   }
//     `;

   

//     // Execute the GraphQL query
//     const data = await client.request(query);

//     // Send the GraphQL response to the frontend
//     res.json(data);
//   } catch (error) {
//     console.error('Error executing GraphQL query:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// start express server

const startServer = async () => {
  try {
    // connect to MongoDB using .env variable
    connectDB(process.env.MONGO_URL);

    app.listen(8080, () => console.log('Server is running on port http://localhost:8080'));
  } catch (error) {
    console.log(error);
  }
}





startServer();



