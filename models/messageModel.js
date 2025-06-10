import { DataTypes } from 'sequelize';
import { MESSAGE_MAX_LENGTH } from '../utils/config.js';

export default (sequelize) => {
    sequelize.define('Message', {
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1, MESSAGE_MAX_LENGTH]
            }
        }
    });
}