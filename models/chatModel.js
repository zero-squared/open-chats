import { DataTypes } from 'sequelize';

// TODO Add localized chat names?
export default (sequelize) => {
    sequelize.define('Chat', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}