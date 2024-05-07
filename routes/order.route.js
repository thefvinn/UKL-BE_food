const express = require(`express`)
const app = express()
app.use(express.json())
const orderController = require(`../controllers/order.controller`)


app.post("/",  orderController.addOrder)
app.get("/",  orderController.showHistory)



module.exports = app