var express = require('express');
var router = express.Router();
var auth = require("../modules/config");
let User = require("../models/User");

router.get("/:username" ,async (req,res,next)=> {
    try {
        let username = req.params.username;
        let profile = await User.findOne({username});
        console.log(profile, req.user);
        res.json({profiles : userProfiles(profile, req.user.userId)});
    } catch (error) {
        console.log(error)
        next(error);
    }
});


router.post("/:username/follow",auth.verifyToken,async(req,res,next)=> {
    try {
        let username = req.params.username;
        let followingUser =  await User.findOneAndUpdate({username},{$push: {following: req.user.userId}},{new: true});
        console.log(followingUser);
        res.json({profiles: userProfiles(followingUser)});
    } catch (error) {
        next(error);
    }
});

router.delete("/:username/follow",auth.verifyToken,async(req,res,next)=> {
    try {
        let username = req.params.username;
        let unfollowingUser = await User.findOneAndUpdate({username},{$pull : {following :req.user.userId}},{new: true});
        res.json({profiles: userProfiles(unfollowingUser)});
    } catch (error) {
        next(error);
    }
})

function userProfiles(user, currentUser = null) {
    const following = user.following.includes(currentUser)
    return {
        username : user.username,
        bio : user.bio,
        image: user.image,
        following
    }
}









module.exports = router;