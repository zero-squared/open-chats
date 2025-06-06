import express from 'express';
import session from 'express-session';
import 'dotenv/config';
import bodyParser from 'body-parser';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import i18nextBackend from 'i18next-fs-backend';

import fs from 'fs';
import https from 'https';
import http from 'http';

import router from './routes/mainRoutes.js';
import { initializeSockets } from './sockets/index.js';
import './models/index.js';

const app = express();

let httpServer = http.createServer(app);
let httpsServer;

if (process.env.NODE_ENV === 'production') {
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

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.secure) {
            next();
        } else {
            res.redirect("https://" + req.headers.host + req.path);
        }
    });
}

await i18next
    .use(i18nextBackend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        preload: ['en', 'ru'],
        saveMissingTo: 'current',
        saveMissing: process.env.NODE_ENV === 'development',
        backend: {
            loadPath: 'locales/{{lng}}/translation.json',
            addPath: 'locales/{{lng}}/translation.missing.json',
            ident: 4,
        },
        detection: {
            lookupQuerystring: 'lang',
            order: ['querystring', 'cookie', 'header'],
            caches: ['cookie']
        }
    });

app.use(i18nextMiddleware.handle(i18next));
app.set('view engine', 'ejs');
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

app.use(router);

httpServer.listen(process.env.HTTP_PORT || 3000, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`HTTP server started on port ${process.env.HTTP_PORT || 3000}: http://localhost:${process.env.HTTP_PORT || 3000}`);
    } else {
        console.log(`HTTP server started on port ${process.env.HTTP_PORT || 3000}`);
    }
});

if (process.env.NODE_ENV === 'production') {
    httpsServer.listen(process.env.HTTPS_PORT, () => {
        console.log(`HTTPS server started on port ${process.env.HTTPS_PORT}`);
    });
}

initializeSockets(process.env.NODE_ENV === 'production' ? httpsServer : httpServer, sessionMiddleware);