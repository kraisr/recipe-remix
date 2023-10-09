import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongoDB/connect.js";
import authRoutes from "./routes/auth.js";
import suggesticRoutes from "./routes/suggesticRoutes.js";
import bodyParser from "body-parser";

dotenv.config();
// import { GraphQLClient } from 'graphql-request';
// import axios from 'axios';


// create express app
const app = express(); 

/* add middlewares */
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cors());

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



