import bcrypt from 'bcryptjs';

import sequelize from '../models/index.js';

export default async () => {
    console.log('Creating roles...');
    const userRole = await sequelize.models.Role.create({ name: 'user' });
    const moderatorRole = await sequelize.models.Role.create({ name: 'moderator' });
    const adminRole = await sequelize.models.Role.create({ name: 'admin' });
    
    console.log('Creating default admin user...');
    const adminPasswordHash = await bcrypt.hash('admin', parseInt(process.env.SALT_ROUNDS));
    const adminUser = await sequelize.models.User.create({ username: 'admin', password: adminPasswordHash, RoleId: adminRole.id });
    
    if (process.env.NODE_ENV === 'development') {
        console.log('Creating placeholder users...')
        const phPasswordHash = await bcrypt.hash('12345', parseInt(process.env.SALT_ROUNDS));
        await sequelize.models.User.create({ username: 'user1', password: phPasswordHash, RoleId: userRole.id });
        await sequelize.models.User.create({ username: 'viuviu', password: phPasswordHash, RoleId: userRole.id });
        await sequelize.models.User.create({ username: 'femboy_uwu', password: phPasswordHash, RoleId: moderatorRole.id });

        console.log('Creating placeholder chats...');
        const phChat1 = await sequelize.models.Chat.create({ name: 'Test chat 1' });
        const phChat2 = await sequelize.models.Chat.create({ name: 'Test chat 2' });
        
        console.log('Creating placeholder messages...');
        await sequelize.models.Message.create({ text: 'test message in chat 1', ChatId: phChat1.id, UserId: adminUser.id });
        await sequelize.models.Message.create({ text: 'test message in chat 2', ChatId: phChat2.id, UserId: adminUser.id });
        await sequelize.models.Message.create({ text: 'another test message in chat 2', ChatId: phChat2.id, UserId: adminUser.id });
    }
}
