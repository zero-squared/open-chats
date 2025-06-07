import 'dotenv/config';

import sequelize from '../models/index.js';
import seed from './seed.js';

await sequelize.sync({ force: true });

await seed();

console.log('Done!');
process.exit();