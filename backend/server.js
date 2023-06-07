const express = require('express');
const path = require("path");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


app.get('/leagues', (req,res)=>{

    res.send({message: "Welcome to the Leagues page."})
});


app.listen(port, ()=>{
    console.log(`Server listening on ${port}`);
})