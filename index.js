const express=require('express');
const dotenv = require('dotenv');


const app=express();
dotenv.config();

app.get('/',(req,resp)=>{
    resp.send('app is working fine');
});


const PORT = process.env.PORT || 5000 ;
app.listen(PORT,console.log(`app server is running on ${PORT}`));