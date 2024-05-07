const foodModel = require('../models/index').food;
const Op = require('sequelize').Op;
const path = require('path');
const fs = require('fs');

exports.getAllFood = async (request, response) => {
    try {
        let foods = await foodModel.findAll();
        return response.json({
            success: true,
            data: foods,
            message: "All foods have been loaded"
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        });
    }
}

exports.findFood = async (request, response) => {
    try {
        let keyword = request.params.key;
        let foods = await foodModel.findAll({
            where: {
                [Op.or]: [
                    { makananID: { [Op.substring]: keyword } },
                    { name: { [Op.substring]: keyword } },
                    { spicy_level: { [Op.substring]: keyword } },
                    { price: { [Op.substring]: keyword } }
                ]
            }
        });
        return response.json({
            success: true,
            data: foods,
            message: "Food has retrieved"
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        });
    }
}

const upload = require('./upload-image').single('image');

exports.addFood = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error });
        }
        if (!request.file) {
            return response.json({ message: "Nothing image to Upload" });
        }

        let newFood = {
            name: request.body.name,
            spicy_level: request.body.spicy_level,
            price: request.body.price,
            image: request.file.filename
        };

        try {
            let result = await foodModel.create(newFood);
            return response.json({
                success: true,
                data: result,
                message: "Food has created"
            });
        } catch (error) {
            return response.json({
                success: false,
                message: error.message
            });
        }
    });
}

exports.updateFood = async (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error });
        }

        let makananID = request.params.id;
        let dataFood = {
            name: request.body.name,
            spicy_level: request.body.spicy_level,
            price: request.body.price
        };

        if (request.file) {
            const selectedFood = await foodModel.findOne({
                where: { makananID: makananID }
            });

            if (!selectedFood) {
                return response.json({
                    success: false,
                    message: "Food not found"
                });
            }

            const oldImage = selectedFood.image;
            const pathImage = path.join(__dirname, "../image", oldImage);
            if (fs.existsSync(pathImage)) {
                fs.unlink(pathImage, error => console.log(error));
            }
            dataFood.image = request.file.filename;
        }

        try {
            await foodModel.update(dataFood, { where: { makananID: makananID } });
            return response.json({
                success: true,
                message: "Food has updated"
            });
        } catch (error) {
            return response.json({
                success: false,
                message: error.message
            });
        }
    });
};

exports.deleteFood = async (request, response) => {
    try {
        const makananID = request.params.id;
        const food = await foodModel.findOne({ where: { makananID: makananID } });
        const oldImage = food.image;
        const pathImage = path.join(__dirname, "../image", oldImage);

        if (fs.existsSync(pathImage)) {
            fs.unlink(pathImage, error => console.log(error));
        }

        await foodModel.destroy({ where: { makananID: makananID } });

        return response.json({
            success: true,
            message: "Data food has been deleted"
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        });
    }
}
