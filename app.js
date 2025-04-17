import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import session from 'express-session';
import 'dotenv/config';
import 'fs';

const app = express();
const port = process.env;

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

await sequelize.sync();

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
    const privateKey = fs.readFileSync(process.env.SSL_KEY_FILE, 'utf8');
    const certificate = fs.readFileSync(process.env.SSL_CERT_FILE, 'utf8');
    server = https.createServer({ key: privateKey, cert: certificate }, app);
}

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });