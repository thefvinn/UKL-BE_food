const adminModel = require('../models/index').admin;
const md5 = require('md5');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const secret = 'MajuJaya';

exports.registerAdmin = async (request, response) => {
    try {
        const existingUser = await adminModel.findOne({
            where: { email: request.body.email },
        });

        if (existingUser) {
            return response.json({
                success: false,
                message: "Email is already registered, please submit a different email address",
            });
        }

        let newUser = {
            name: request.body.name,
            email: request.body.email,
            password: md5(request.body.password),
        };

        const result = await adminModel.create(newUser);

        return response.json({
            success: true,
            data: result,
            message: "Registered new user successfully",
        });
    }
    catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};

exports.authenticate = async (request, response) => {
    try {
        let dataLogin = {
            email: request.body.email,
            password: md5(request.body.password)
        };

        let dataUser = await adminModel.findOne({
            where: dataLogin
        });

        if (dataUser) {
            let payload = JSON.stringify(dataUser);
            console.log(payload);
            let token = jwt.sign(payload, secret);

            return response.json({
                success: true,
                logged: true,
                message: "Login Berhasil", // Perbaikan penulisan pesan
                token: token,
                data: dataUser
            });
        }

        return response.json({
            success: false,
            logged: false,
            message: "Authentication Failed. Invalid username or password" // Perbaikan penulisan pesan
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        });
    }
};

exports.authorize = (request, response, next) => {
    const authHeader = request.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        let verifiedUser = jwt.verify(token, secret);
        if (!verifiedUser) {
            return response.json({
                success: false,
                auth: false,
                message: "User Unauthorized"
            });
        }
        request.user = verifiedUser; // payload
        next();
    } else {
        return response.json({
            success: false,
            auth: false,
            message: "User Unauthorized"
        });
    }
};
