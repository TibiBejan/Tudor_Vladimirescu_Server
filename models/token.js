import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Token extends Model {
    static associate({User}) {
      this.belongsTo(User, { foreignKey: 'userId', foreignKeyConstraint: true, allowNull: false, onDelete: "CASCADE" });
    }
  };

  Token.init({
    id: {
      allowNull: false,
      autoIncrement: true, 
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    reset_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    token_generated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    token_expiration_date: {
      type: DataTypes.DATE,
      allowNull: false,
    }},
    {
      sequelize,
      tableName: 'token',
      modelName: 'Token',
    }
  );

  return Token;
}