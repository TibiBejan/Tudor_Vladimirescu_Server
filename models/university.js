import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class University extends Model {
    static associate({Enrollment}) {
      this.hasMany(Enrollment, { foreignKey: 'universityId', foreignKeyConstraint: true, allowNull: false, onDelete: "CASCADE" });
    }
  };
  
  University.init({
    id: {
      allowNull: false,
      autoIncrement: true, 
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rector: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    halls: {
      type: DataTypes.JSON,
      allowNull: false,
    }},
    {
      sequelize,
      tableName: 'university',
      modelName: 'University',
    }
  );

  return University;
}