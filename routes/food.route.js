const express = require('express');
const app = express();
app.use(express.json());
const foodController = require('../controllers/food.controller');
const { authorize } = require("../controllers/auth.controller");

app.post("/",  foodController.addFood);
app.put("/:id",  foodController.updateFood);
app.delete("/:id",  foodController.deleteFood);
app.get("/:key", foodController.findFood);

module.exports = app;
