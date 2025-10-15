import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

//Configuring dotenv
dotenv.config();

//Express app initialization
const app = express();
app.use(express.json());

// MongoDB connection
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

//Routes
app.use('/api/user', userRoutes);

//Starting the server
const PORT = 5000;
app.listen(PORT, ()=> console.log(`Server is running on ${PORT}`));