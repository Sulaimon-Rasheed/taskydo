'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "passwordResetLink",{
      type:Sequelize.STRING,
      allowNull:true
    })

    await queryInterface.addColumn("Users", "passwordResetLinkExpiringDate",{
      type:Sequelize.DATE,
      allowNull:true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "passwordResetLink")
    await queryInterface.removeColumn("Users", "passwordResetLinkExpiringDate")
  }
};
