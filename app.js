import express from 'express';
import { Sequelize } from 'sequelize';
import session from 'express-session';
import 'dotenv/config';
import bodyParser from 'body-parser';
import fs from 'fs';
import https from 'https';
import http from 'http';

import router from './routes/mainRoutes.js';
import { initializeSockets } from './sockets.js';

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
});

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
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

app.use(router);

httpServer.listen(process.env.HTTP_PORT || 3000, () => {
    console.log(`HTTP server started on port ${process.env.HTTP_PORT || 3000}`);
});

if (process.env.ENABLE_HTTPS === 'true') {
    httpsServer.listen(process.env.HTTPS_PORT, () => {
        console.log(`HTTPS server started on port ${process.env.HTTPS_PORT}`);
    });
}

initializeSockets(process.env.ENABLE_HTTPS === 'true' ? httpsServer : httpServer, sessionMiddleware);