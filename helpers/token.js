const jwt = require('jsonwebtoken');
exports.createToken = (payload,expired) => {
    const token = jwt.sign(payload,process.env.SECRET_KEY,{
        expiresIn:expired
    })

    return token;
}