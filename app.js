import express from 'express';
import { Sequelize } from 'sequelize';
import session from 'express-session';
import 'dotenv/config';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';

import { getHome } from './controllers/homeController.js';

import fs from 'fs';
import https from 'https';
import http from 'http';

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false,
});

try {
    await sequelize.authenticate();
    console.log('Connected to the database');
} catch (err) {
    console.error('Unable to connect to the database:', err);
}

const app = express();

let httpServer = http.createServer(app);
let httpsServer;

if (process.env.ENABLE_HTTPS === 'true') {
    const privateKey = fs.readFileSync(process.env.SSL_KEY_FILE);
    const certificate = fs.readFileSync(process.env.SSL_CERT_FILE);
    httpsServer = https.createServer({ 
        key: privateKey, 
        cert: certificate 
    }, app);
}

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
})

if (process.env.ENABLE_HTTPS === 'true') {
    app.use((req, res, next) => {
        if (req.secure) {
            next();
        } else {
            res.redirect("https://" + req.headers.host + req.path);
        }
    });
}

app.set('view engine', 'ejs');
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    if (!req.session.bebra) req.session.bebra = Math.random();
    // res.send(`${JSON.stringify(req.session)}`);
    getHome(req, res);
});
app.use((req, res) => {
    return res.status(404).send('Not Found');
});

httpServer.listen(process.env.HTTP_PORT || 3000, () => {
    console.log(`HTTP server started on port ${process.env.HTTP_PORT || 3000}`);
});

httpsServer.listen(process.env.HTTPS_PORT, () => {
    console.log(`HTTPS server started on port ${process.env.HTTPS_PORT}`);
});

const io = new Server(httpsServer);

io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
    const session = socket.request.session;

    console.log(session);
});