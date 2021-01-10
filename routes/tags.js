const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

router.get("/", async (req,res,next)=> {
    try {
        let tags = await Article.distinct("tagList");
        res.json({tags: tags});
    } catch (error) {
        next(error);
    }

})

module.exports = router;