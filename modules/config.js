const jwt = require("jsonwebtoken");

module.exports = {
    generateJwt : async (user)=> {
        let payload = {userId: user.id, email: user.email};
        let token = await jwt.sign(payload,process.env.SECRET);
        return token;
    },
    verifyToken : async (req,res,next)=> {
        let token = req.headers.authorization;
        if(token) {
            try {
                let payload = await jwt.verify(token,process.env.SECRET);
                req.user = payload;
                next();
            } catch (error) {
               res.status(401).json({error});
            }
        } else return res.status(401).json({err: "token required"});
    },
    currentUserLoggedIn : async (req,res,next)=> {
        let token = req.headers.authorization;
        if(token) {
            try {
                let payload = await jwt.verify(token,process.env.SECRET);
                req.user = payload;
                next();
            } catch (error) {
               res.status(401).json({error});
            }
        } else {
            req.user = {}
            next();
        }
    }

}

