const jwt = require("jsonwebtoken");

module.exports = {
    generateJwt : async (user)=> {
        let payload = {userId: user.id, email: user.email};
        let token = await jwt.sign(payload,process.env.SECRET);
        return token;
    }
}