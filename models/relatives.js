import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Relatives extends Model {
    static associate({User}) {
      // this.belongsTo(User, { foreignKey: 'userId', foreignKeyConstraint: true, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
      this.belongsTo(User, { foreignKeyConstraint: true, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
    }
  };

  Relatives.init({
    id: {
      allowNull: false,
      autoIncrement: true, 
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true
    },
    relation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    }}, 
    {
    sequelize,
      tableName: 'relatives',
      modelName: 'Relatives',
    }
  );

  return Relatives;
}