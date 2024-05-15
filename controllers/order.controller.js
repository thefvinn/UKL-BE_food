const foodModel = require(`../models/index`).food;
const listModel = require(`../models/index`).order_list;
const detailModel = require(`../models/index`).order_detail;

const Op = require(`sequelize`).Op;

exports.addOrder = async (request, response) => {
  try {
    let a = request.body.order_date
    // const today = new Date(a);
    // const finalhari = today.toDateString

    const dataOrderList = {
      customer_name: request.body.customer_name,
      table_number: request.body.table_number,
      order_date: a,
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
    const jumlahData = await listModel.findAll({
      include: [
        {
          model: detailModel,
          as: "orderDetail",
        },
      ],
    });


    return response.json({
      success: true,
      data: jumlahData,
    });
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};
