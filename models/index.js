import { Sequelize } from 'sequelize';

import User from './userModel.js';

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

User(sequelize);

await sequelize.sync();

export default sequelize;