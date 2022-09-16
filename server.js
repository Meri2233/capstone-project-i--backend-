require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

let DB_URI = "mongodb+srv://learnmaina:ZNYNgrYVtkph1Wgq@cluster0.qzknohd.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(DB_URI, {
    useUnifiedTopology: true,
    useNewURLParser: true,
}).then(() => console.log("Connected to DB"))
    .catch((e) => console.log(e.message))

const authRouter = require("./routes/auth");
const templateRouter = require('./routes/template');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.static('public'))

app.use('/auth', authRouter);
app.use(authenticateRequest);

app.use('/template', templateRouter);

app.listen(8000 || process.env.PORT, () => {
    console.log("Server running")
});

function authenticateRequest(req, res, next) {
    const headerInfo = req.headers['authorization'];

    if(headerInfo === undefined){
        return res.status(401).send('No token provided')
    }
    const token = headerInfo.split(' ')[1];
    try{
        const payload = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.userInfo = payload;
        next()
    }
    catch(e){
        res.status(401).send("Invalid token provided"); 
    }
}