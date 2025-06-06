import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Role = sequelize.define('Role', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}