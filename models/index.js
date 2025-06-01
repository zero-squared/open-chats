import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false,
});

try {
    await sequelize.authenticate();
    console.log('Connected to the database');
} catch (e) {
    console.error('Unable to connect to the database:', e);
}

const basename = path.basename(import.meta.filename); // This file name without path
const modelFiles = fs.readdirSync('./models').filter(file => file.endsWith('.js') && file !== basename);

for (const modelFile of modelFiles) {
    try {
        const model = (await import(`./${modelFile}`)).default;
        model(sequelize);
    } catch (e) {
        throw new Error(`Failed to load ${modelFile}: ${e}`);
    }
}

await sequelize.sync(process.env.NODE === 'development');

export default sequelize;