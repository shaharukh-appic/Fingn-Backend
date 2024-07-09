// 'use strict';

// module.exports = {
//   async up(queryInterface, Sequelize) {
    
//     await queryInterface.createTable('adminonbordings', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       email: {
//         type: Sequelize.STRING
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });

//     await queryInterface.createTable('dsaonbordings', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       email: {
//         type: Sequelize.STRING
//       },
//       mobileNumber: {
//         type: Sequelize.BIGINT
//       },
//       mobileOtp: {
//         type: Sequelize.INTEGER,
//         defaultValue: 123456
//       },
//       emailOtp: {
//         type: Sequelize.INTEGER,
//         defaultValue: 123456
//       },
//       adminStatus: {
//         type: Sequelize.BOOLEAN,
//         defaultValue: true
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('adminonbordings');
//     await queryInterface.dropTable('dsaonbordings');
//   }
// };
