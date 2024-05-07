const md5 = require(`md5`)
const jwt = require(`jsonwebtoken`)
const adminModel = require(`../models/index`).admin
const secret = `MajuJaya`

const authenticate = async (request, response) => {
    let dataLogin = {
        email: request.body.email,
        password: md5(request.body.password)
    }
    /** check data adminname and password on admin's table */
    let dataAdmin = await adminModel.findOne({
        where: dataLogin
    })
    /** if data admin exists */
    if (dataAdmin) {
        /** set payload for generate token.
        * payload is must be string.
        * dataAdmin is object, so we must convert to string.
        */
        let payload = JSON.stringify(dataAdmin)
        console.log(payload)
        /** generate token */
        let token = jwt.sign(payload, secret)
        /** define response */
        return response.json({
            success: true,
            logged: true,
            message: `Authentication Success`,
            token: token,
            a: "secret",
            data: dataAdmin
        })
    }
    /** if data admin is not exists */
    return response.json({
        success: false,
        logged: false,
        message: `Authentication Failed. Invalid adminname or password`
    })
}


const authorize = (request, response, next) => {
    /** get "Authorization" value from request's header */
    const authHeader = request.headers.authorization;
    /** check nullable header */
    try {
        if (authHeader) {
            /** when using Bearer Token for authorization,
            * we have to split `headers` to get token key.
            * valus of headers = `Bearers tokenKey`
            */
            const token = authHeader.split(' ')[1];
            console.log(token);
            /** verify token using jwt */
            let verifiedAdmin = jwt.verify(token, secret);
            console.log("1");
            console.log(verifiedAdmin);
            if (!verifiedAdmin) {
                return response.json({
                    success: false,
                    auth: false,
                    message: `Admin Unauthorized`
                })
            }
            console.log(verifiedAdmin);
            request.admin = verifiedAdmin; // payload
            
            /** if there is no problem, go on to controller */
            next();
        } else {
            return response.json({
                success: false,
                auth: false,
                message: `Admin Unauthorized`
            })
        }
    } catch (error) {
        return response.json({
            success: false,
            auth: "s",
            message: error.message
        })
    }
    
}

module.exports = { authenticate, authorize }