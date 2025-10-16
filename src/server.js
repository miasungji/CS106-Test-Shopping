//1. Load environment variables from .env file
require('dotenv').config();

//2. Import required modules 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

//3. create an express application
const app = express();

//4. middlewares (to run before routes)
app.use(cors()); //allow request from other origins
app.use(express.json()); //parse json body (POST request)
app.use(express.static('public')); //serve files from public folder

//5. import routes
const marketRoutes = require('./routes/market_routes');

//6. use routes 
app.use('/api/market', marketRoutes);

//7. Get variables from .env
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

//8 connect to mongoDB using mongoose 
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('mongoDB connected');
        //9. Start the server after DB is connected
        app.listen(PORT, () => {
            console.log(`server running on http://localhost${PORT}`)
        });
    })
    .catch((err) => {
        console.log('mongoDB connection failed', err.message);
    });

//10 test
app.get('/api/health', (req, res) => {
    res.json({ ok: true, time: new Date() });
});
