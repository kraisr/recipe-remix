import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongoDB/connect.js";
import authRoutes from "./routes/auth-routes.js";

// Load environment variables from .env file
dotenv.config();

// create express app
const app = express(); 

/* add middlewares */
app.use(cors());
app.use(express.json({ limit: '50mb' }));

/* add routes */
app.use("/auth", authRoutes);

// define a callback function with request and response parameters
app.get('/', (req, res) => {
  res.send({ message: 'Hello World!' });
});

/* start express server */
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