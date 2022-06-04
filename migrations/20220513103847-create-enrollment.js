export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('enrollment', {
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
      universityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      university: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      year_of_study: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type_of_study: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      grade: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      financial_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      student_gender: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('enrollment');
  }
}
