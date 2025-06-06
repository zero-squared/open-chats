import 'dotenv/config';
import bcrypt from 'bcryptjs';

import sequelize from '../models/index.js';

await sequelize.sync({ force: true });

console.log('Creating roles...');
await sequelize.models.Role.create({ name: 'user' });
await sequelize.models.Role.create({ name: 'moderator' });
const adminRole = await sequelize.models.Role.create({ name: 'admin' });

console.log('Creating default admin user...');
const passwordHash = await bcrypt.hash('admin', parseInt(process.env.SALT_ROUNDS));
const adminUser = await sequelize.models.User.create({ username: 'admin', password: passwordHash });
await adminUser.setRole(adminRole);

console.log('Done!');
process.exit();