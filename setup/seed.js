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

    // TODO: remove this from production
    console.log('Creating test chat...');
    const testChat = await sequelize.models.Chat.create({ name: 'Test chat' });

    if (process.env.NODE_ENV === 'development') {
        console.log('Creating placeholder users...')
        const phPasswordHash = await bcrypt.hash('12345', parseInt(process.env.SALT_ROUNDS));
        await sequelize.models.User.create({ username: 'user1', password: phPasswordHash, RoleId: userRole.id });
        await sequelize.models.User.create({ username: 'viuviu', password: phPasswordHash, RoleId: userRole.id });

        console.log('Creating placeholder chats...');
        const phChat1 = await sequelize.models.Chat.create({ name: 'Test chat 1' });
        const phChat2 = await sequelize.models.Chat.create({ name: 'Test chat 2' });
        const phChat3 = await sequelize.models.Chat.create({ name: 'A heated discussion...' });

        console.log('Creating placeholder messages...');
        await sequelize.models.Message.create({ text: 'test message in chat 1', ChatId: phChat1.id, UserId: adminUser.id });
        await sequelize.models.Message.create({ text: 'test message in chat 2', ChatId: phChat2.id, UserId: adminUser.id });
        await sequelize.models.Message.create({ text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae purus tempus erat congue porttitor. Phasellus mattis metus quis diam elementum pharetra. Morbi vestibulum lorem sit amet odio facilisis, eu molestie sem consectetur. Sed et porta diam. Curabitur tempus, dui sit amet maximus pulvinar, sem massa congue turpis, vel feugiat magna neque eget elit. Proin id lectus sem. Donec et ornare orci, nec pellentesque enim. Etiam justo leo, vehicula non metus in, egestas facilisis lorem. In id lobortis ex. Ut euismod elit eget ex ullamcorper, eu varius lectus sagittis. Suspendisse volutpat pretium nisl, vel pretium nibh hendrerit fermentum. Cras quis condimentum tellus.', ChatId: phChat2.id, UserId: adminUser.id });
        await sequelize.models.Message.create({ text: 'another test message in chat 2', ChatId: phChat2.id, UserId: adminUser.id });
        for (let i = 0; i < 500; i++) {
            await sequelize.models.Message.create({ text: `asdfjkhasdf ${i}`, ChatId: phChat3.id, UserId: adminUser.id });
        }
    }
}
