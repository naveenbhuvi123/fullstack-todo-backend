import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import taskRoutes from "./routes/taskRoutes.js";  //  Correct
import authRoutes from "./routes/authRoutes.js";  //  Correct



dotenv.config(); // Load environment variables
const app = express();
app.use(cors());
app.use(express.json()); // Parse incoming JSON data

const mongoDB_URI = process.env.MONGO_URI;


try {
    mongoose.connect(mongoDB_URI).then(() => {
        console.log("✅ MongoDB connected successfully");
    });
} catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit process if DB connection fails
}



app.use('/api',taskRoutes);  // 
app.use("/api", authRoutes);





// Starting  Server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`🚀 Server fully running on port ${PORT}`));


export default app;
