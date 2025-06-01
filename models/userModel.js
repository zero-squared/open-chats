import { DataTypes } from 'sequelize';

export default (sequelize) => {
    sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
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