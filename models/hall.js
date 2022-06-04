import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Hall extends Model {
    static associate({HallStaff, HallRoom, User}) {
        this.hasMany(User, { foreignKey: 'hallId', foreignKeyConstraint: true, allowNull: false, onDelete: "CASCADE" })
        this.hasMany(HallStaff, { foreignKey: 'hallId', foreignKeyConstraint: true, allowNull: false, onDelete: "CASCADE" });
        this.hasMany(HallRoom, { foreignKey: 'hallId', foreignKeyConstraint: true, allowNull: false, onDelete: "CASCADE" });
    }

    toJSON() {
        return { ...this.get(), id: undefined }
    }
  };

  Hall.init({
    id: {
      allowNull: false,
      autoIncrement: true, 
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    hall_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hall_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_students: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    students_in_room: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    min_grade: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    max_grade: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    facilities: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bathroom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    universities: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hall_adress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hall_latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    hall_longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: false,
    }},
    {
      sequelize,
      tableName: 'hall',
      modelName: 'Hall',
    }
  );

  return Hall;
};