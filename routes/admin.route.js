const express = require('express');
const app = express();
app.use(express.json());
const adminController = require('../controllers/admin.controller');

// Menambahkan endpoint untuk register admin dengan otorisasi
app.post('/', adminController.registerAdmin);

// Menambahkan endpoint untuk login admin
app.post('/auth', adminController.authenticate);

module.exports = app;
