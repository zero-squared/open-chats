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
await sequelize.models.User.create({ username: 'admin', password: passwordHash, RoleId: adminRole.id });

console.log('Creating placeholder chats...');
const phChat1 = await sequelize.models.Chat.create({ name: 'Test chat 1' });
const phChat2 = await sequelize.models.Chat.create({ name: 'Test chat 2' });

console.log('Creating placeholder messages...');
await sequelize.models.Message.create({ text: 'test message in chat 1', ChatId: phChat1.id, UserId: adminUser.id });
await sequelize.models.Message.create({ text: 'test message in chat 2', ChatId: phChat2.id, UserId: adminUser.id });
await sequelize.models.Message.create({ text: 'another test message in chat 2', ChatId: phChat2.id, UserId: adminUser.id });

console.log('Done!');
process.exit();