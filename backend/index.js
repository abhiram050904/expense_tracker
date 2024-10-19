const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const { readdirSync, existsSync } = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

const loadRoutes = () => {
    if (existsSync('./routes')) {
        readdirSync('./routes').forEach((route) => {
            app.use('/api/v1', require('./routes/' + route));
        });
    } else {
        console.error('Routes folder does not exist');
    }
};

loadRoutes();

const AuthRouter = require('./routes/userRoutes');
app.use('/api/v1/auth', AuthRouter);

const server = () => {
    console.log('Connecting to database...');
    db();
    
    console.log('Starting server...');
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
};

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

server();
