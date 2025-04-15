import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import session from 'express-session';

const app = express();
const port = 3000;

const sequelize = new Sequelize('test', 'kitam', '1234', {
    host: 'localhost',
    dialect: 'postgres'
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
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true,
}));

app.get('/', (req, res) => {
    console.log(req.session)
    if (!req.session.bebra) req.session.bebra = Math.random();
    res.send(`${JSON.stringify(req.session)}`);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});