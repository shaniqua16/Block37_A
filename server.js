
const express = require ('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(require("morgan")("dev"));
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.get('/', (req, res)=> {
    res.send({message: 'Server is running'});
});

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});