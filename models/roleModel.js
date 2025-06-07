import { DataTypes } from 'sequelize';

export default (sequelize) => {
    sequelize.define('Role', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}