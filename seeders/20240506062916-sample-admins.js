'use strict';

const md5 = require('md5'); // Mengimpor modul md5
const now = new Date(); // Mendefinisikan varAiabel now dengan tanggal dan waktu saat ini

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('admins', [{
      email: "admin@smktelkom-mlg.sch.id",
      password: md5("admin123"), // Menggunakan md5 untuk mengenkripsi password
      createdAt: now,
      updatedAt: now
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admins', null, {}); // Menghapus semua data dari tabel users
  }
};
