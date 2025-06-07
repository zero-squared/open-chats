import { DataTypes } from 'sequelize';

export default (sequelize) => {
    sequelize.define('Chat', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}