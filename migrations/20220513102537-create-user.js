export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('user', {
    id: {
      allowNull: false,
      autoIncrement: true, 
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    hallId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password_changed_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('users');
}
