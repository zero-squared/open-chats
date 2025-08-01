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

// TODO Refactor foreign key names
// User
sequelize.models.User.belongsTo(sequelize.models.Role, {
    foreignKey: {
        allowNull: false,
    }
});

sequelize.models.User.hasMany(sequelize.models.Message);

// Role
sequelize.models.Role.hasMany(sequelize.models.User, {
    foreignKey: {
        allowNull: false,
    }
});

// Chat
sequelize.models.Chat.hasMany(sequelize.models.Message);

// Message
sequelize.models.Message.belongsTo(sequelize.models.Chat, {
    foreignKey: {
        allowNull: false,
    }
});

sequelize.models.Message.belongsTo(sequelize.models.User, {
    foreignKey: {
        allowNull: false,
    }
});

// Label
sequelize.models.Label.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: 'authorUserId',
        allowNull: false
    },
});
sequelize.models.Label.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: 'targetUserId',
        allowNull: false
    },
});

await sequelize.sync();

export default sequelize;