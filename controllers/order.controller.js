const foodModel = require(`../models/index`).food;
const listModel = require(`../models/index`).order_list;
const detailModel = require(`../models/index`).order_detail;

const Op = require(`sequelize`).Op;

exports.addOrder = async (request, response) => {
  try {
    const today = new Date();

    const dataOrderList = {
      customer_name: request.body.customer_name,
      table_number: request.body.table_number,
      order_date: today.toString(),
    };

    // console.log(dataOrderList);
    const newOrderList = await listModel.create(dataOrderList);

    const banyakFood = request.body.banyakFood;
    /*
        [
            {
                makananID: 1,
                kuantitas: 2
            },
            {
                makananID: 2,
                kuantitas: 3
            }
        ]
        */

    for (let index = 0; index < banyakFood.length; index++) {
      const foodData = await foodModel.findOne({
        where: { makananID: banyakFood[index].makananID },
      });
      // console.log(foodData);
      if (!foodData) {
        return response.json({
          success: false,
          message: "ID food tidak ada di database",
        });
      }
      let newDetail = {
        order_id: newOrderList.listID,
        food_id: foodData.makananID,
        quantity: banyakFood[index].quantity,
        harga: foodData.price * banyakFood[index].quantity,
      };

      await detailModel.create(newDetail);
    }

    return response.json({
      success: true,
      message: "Data inserted",
    });
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

exports.showHistory = async (request, response) => {
  try {
    const jumlahData = await listModel.findAll();
    let a = [];
    for (let index = 1; index <= jumlahData.length; index++) {
      let coba = await listModel.findOne({ where: { listID: index } });
      let coba2 = await detailModel.findAll({ where: { order_id: index } });
      a.push(coba);
      a.push(coba2);
    }

    return response.json({
      success: true,
      data: a,
    });
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};
