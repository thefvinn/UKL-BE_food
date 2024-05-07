const express = require(`express`)
const app = express()
const cors = require(`cors`)
app.use(cors())


const admin = require(`./routes/admin.route`)
app.use(`/admin`, admin)

const food = require(`./routes/food.route`)
app.use(`/food`, food)

const order = require(`./routes/order.route`)
app.use(`/order`, order)

const PORT = 5555
app.listen(PORT, () => {
    console.log(`Server of Ticket Sales runs on port ${PORT}`)
})