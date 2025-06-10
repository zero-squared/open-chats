import { DataTypes } from 'sequelize';

// TODO Add username validation
export default (sequelize) => {
    sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [4, 30]
            }
        },
        avatarUrl: {
            type: DataTypes.STRING
        },
        avatarFileId: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}