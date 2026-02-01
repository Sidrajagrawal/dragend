const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const indexRoute = require('./routes/index');
const connectDB = require('./models/index');
const passport = require('passport');

require('dotenv').config()
require('./config/passport')(passport);
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect Database
connectDB(MONGO_URL);


app.use(cors({
    origin: ['http://localhost:5173',
        'https://dragend-h8cjcqdsfcc8gaex.centralindia-01.azurewebsites.net'
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(cookieParser());
app.use(passport.initialize());

//Base API
app.use('/api', indexRoute)

//Testing Route
app.get('/', (req, res) => {
    res.send("<h1>Welcome to Backendless</h1>")
})

app.listen(PORT, () => { console.log(`Server Running at ${PORT}/`) });