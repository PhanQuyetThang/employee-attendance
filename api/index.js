import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';

dotenv.config();

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((error) => {
        console.log(error);
    });

const app = express();

const esp32IP = 'your-esp32-ip-address'; // Replace with your ESP32's IP address
const esp32Port = 80; // Replace with the port your ESP32 is running on
const esp32Endpoint = '/example-endpoint'; // Replace with the desired endpoint on your ESP32

app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.get('/send-request', (req, res) => {
    const options = {
        hostname: esp32IP,
        port: esp32Port,
        path: esp32Endpoint,
        method: 'GET',
    };

    const httpRequest = http.request(options, (httpResponse) => {
        let data = '';

        httpResponse.on('data', (chunk) => {
            data += chunk;
        });

        httpResponse.on('end', () => {
            res.status(200).json({ response: data });
        });
    });

    httpRequest.on('error', (error) => {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    });

    httpRequest.end();
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    return res.status(statusCode).json({
        statusCode,
        success: false, // Inform that the request was failed
        message
    });
});
