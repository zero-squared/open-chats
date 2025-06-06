import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Chat = sequelize.define('Chat', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}