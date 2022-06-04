export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hall', {
      id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      hall_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      hall_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_rooms: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_students: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      students_in_room: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      min_grade: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      max_grade: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      facilities: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bathroom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      universities: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      hall_adress: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      hall_latitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      hall_longitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      contact_number: {
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
    await queryInterface.dropTable('hall');
  }
}