const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
dotenv = require('dotenv/config');
const fileUpload = require('express-fileupload');

const app = express();

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const imageRoutes = require('./routes/upload');
app.use(cors());
app.options('*',cors());
app.use(morgan('dev'));
app.use(fileUpload({useTempFiles:true}));

app.use(express.json())
app.use('/auth',userRoutes);
app.use('/post',postRoutes);
app.use('/image',imageRoutes);
const db = process.env.DB;
mongoose.connect(db,{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=> console.log("mongoDB'ye başarılı şekilde bağlanıldı")).catch((err)=> console.log(err));


const port = process.env.PORT | 8000;
app.listen(port,()=> console.log(`nodejs server ${port} portundan ayaklandı.`));