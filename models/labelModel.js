import { DataTypes } from 'sequelize';

export default (sequelize) => {
    sequelize.define('Label', {
        text: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}