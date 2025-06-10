import { DataTypes } from 'sequelize';

export default (sequelize) => {
    sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [4, 30],
                is: {
                    args: /^[a-zA-Z0-9_-]+$/,
                    msg: 'errors.usernameValidation'
                }
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