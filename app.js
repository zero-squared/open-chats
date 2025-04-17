import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import session from 'express-session';
import 'dotenv/config';
import fs from 'fs';
import https from 'https';
import http from 'http';

const app = express();
const port = process.env.PORT || 3000;

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false,
});
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// const Wish = sequelize.define("Wish", {
//     title: DataTypes.INTEGER,
//     quantity: DataTypes.INTEGER,
// });

//await sequelize.sync();

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
}));

app.get('/', (req, res) => {
    console.log(req.session)
    if (!req.session.bebra) req.session.bebra = Math.random();
    res.send(`${JSON.stringify(req.session)}`);
});

let server;

if (process.env.NODE_ENV === 'production') {
    const privateKey = fs.readFileSync(process.env.SSL_KEY_FILE);
    const certificate = fs.readFileSync(process.env.SSL_CERT_FILE);
    server = https.createServer({ 
        key: privateKey, 
        cert: certificate 
    }, app);
} else {
    server = http.createServer(app);
}

server.listen(port, () => {
    console.log(`Web server started on ${port}`);
});