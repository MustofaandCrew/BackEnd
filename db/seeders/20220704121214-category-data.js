"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Categories", [
      {
        nama: "Elektronik",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama: "Buku",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama: "Fashion Pria",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama: "Fashion Wanita",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama: "Kecantikan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama: "Kesehatan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama: "Olahraga",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama: "Otomotif",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama: "Perawatan Tubuh",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama: "Rumah Tangga",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
