const express=require('express');
const dotenv = require('dotenv');
const cors = require('cors')

const app=express();
app.use(express.json()); 
app.use(cors());

dotenv.config();

app.get('/getdata',(req,resp)=>{
    resp.send('app is working fine');
});


const PORT = process.env.PORT || 5000 ;
app.listen(PORT,console.log(`app server is running on ${PORT}`));