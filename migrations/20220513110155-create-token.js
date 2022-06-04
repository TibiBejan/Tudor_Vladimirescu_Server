export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('token', {
      id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reset_token: {
        type: Sequelize.STRING
      },
      token_generated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      token_expiration_date: {
          type: Sequelize.DATE,
          allowNull: false,
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('token');
  }
}