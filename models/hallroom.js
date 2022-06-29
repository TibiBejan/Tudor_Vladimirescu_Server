
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class HallRoom extends Model {
    static associate({Hall, User}) {
      // this.belongsTo(Hall, { foreignKey: 'hallId', foreignKeyConstraint: true, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" });
      // this.belongsTo(User, { foreignKey: 'userId', foreignKeyConstraint: true, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" });
      this.belongsTo(Hall, { foreignKeyConstraint: true, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" });
      this.belongsTo(User, { foreignKeyConstraint: true, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" });
    }
  };

  HallRoom.init({
    id: {
      allowNull: false,
      autoIncrement: true, 
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rent_per_month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    beds_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }},
    {
      sequelize,
      tableName: 'hallRoom',
      modelName: 'HallRoom',
    }
  );

  return HallRoom;
};