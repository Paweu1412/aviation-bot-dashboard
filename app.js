const express = require('express');
const path = require('path');
const app = express();

const mysql = require('mysql');

const publicPath = path.join('./client/build');

const routes = express.Router();

app.use(express.static(publicPath), routes);

app.listen(7070);

const databasePool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gradus'
});

routes.get('/login', (req, res) => {
})
