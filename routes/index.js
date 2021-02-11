var express = require('express');
var router = express.Router();
var auth = require("../modules/config");
let User = require("../models/User");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/user", auth.verifyToken, (req, res, next) => {
   return res.json({... req.user});
});

router.put("/user",auth.verifyToken,async (req,res,next)=> {
   try {
    let updateUser =  await User.findByIdAndUpdate(req.user.userId,req.body.user, {new: true});
    console.log(updateUser);
    res.json({user: userInfo(updateUser)});
   } catch (error) {
     next(error);
   }
});

function userInfo(user) {
  return {
    email: user.email,
    username: user.username,
    bio: user.bio,
    image: user.image
  }
}

module.exports = router;
