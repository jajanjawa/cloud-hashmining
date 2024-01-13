require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const api = express.Router();
const Mining = require("./mining");

api.use(express.json());
api.get('/hashmining', Mining.hashmining);

app.use(cors());
app.use(api);
app.listen(8080);
