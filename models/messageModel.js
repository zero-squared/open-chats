import { DataTypes } from 'sequelize';

export default (sequelize) => {
    sequelize.define('Message', {
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1, 1024]
            }
        }
    });
}