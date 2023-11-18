require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const profileRoutes = require('./routes/profileRoutes');
const authRouter = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const contactRoutes = require('./routes/contactRoutes');
const groupRoutes = require('./routes/groupRoutes');
const authMiddleware = require('./middlewares/auth');

// express app
const app = express ()

app.use(cors());
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/assets', express.static(__dirname+'/assets'));

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/auth', authRouter);
app.use('/api/user', userRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/group', groupRoutes);
app.use(authMiddleware);
app.use('/api/profile',profileRoutes);

//connect to mongodb
mongoose.connect(process.env.MONGO_URI).then(()=>{
    // listen for requests 
    app.listen(process.env.PORT,()=>{
        console.log('listening for requests on port 4000!')
    })
}).catch((error)=>{console.log(error)})