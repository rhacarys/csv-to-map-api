module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Points', // name of Source model
      'FileId', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Files', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Points', // name of Source model
      'FileId' // key we want to remove
    );
  }
};