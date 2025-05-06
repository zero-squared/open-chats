import { DataTypes } from 'sequelize';

export default (sequelize) => {
    sequelize.define('User', {
        username: DataTypes.STRING,
        password: DataTypes.STRING
    });
}