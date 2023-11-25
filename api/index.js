import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser'
import path from 'path'

dotenv.config();

mongoose.connect(process.env.MONGO)

    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((error) => {
        console.log(error)
    });


const __dirname = path.resolve()
const app = express();

app.use(express.json());
app.use(cookieParser())

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    return res.status(statusCode).json({
        statusCode,
        success: false, //Inform that the request was failed
        message
    })
})