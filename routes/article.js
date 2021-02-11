const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const slugify = require("slugify");
const auth = require("../modules/config");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { populate } = require("../models/User");


//creating article

router.post("/",auth.verifyToken, async (req,res,next)=> {
    try {
        req.body.article.slug = slugify(`${req.body.article.title}`);
        req.body.article.author = req.user.userId;
        let authorDetail = await User.findById(req.user.userId);
        let createdArticle = await Article.create(req.body.article);
        res.json({articles: articleData(createdArticle,authorDetail)});
    } catch (error) {
        next(error);
    }
});
// feed
router.get("/feed", auth.verifyToken, async(req,res,next)=> {
    try {
        let limit = req.query.limit || 20;
        let offset = req.query.offset || 0;
        let user = await User.findById(req.user.userId);
        let articleList = await Article.find({}).where("author").in([...user.following,user._id]).sort({"createdAt":"desc"}).skip(+offset).limit(+limit).populate("author");
        res.json({articles: articleList.map((article)=> articleData(article,article.author))});
    } catch (error) {
        console.log(error);
        next(error);
    }
})
// geting single article
router.get("/:slug",async (req,res,next)=> {
    try {
        let slug = req.params.slug;
        let article = await Article.findOne({slug}).populate('author');
        res.json({articles: articleData(article,article.author)});
    } catch (error) {
        next(error);
    }
});
// updating article
router.put("/:slug",auth.verifyToken,async (req,res,next)=> {
    try {
        let slug = req.params.slug;
        let updatedArticle = await Article.findOneAndUpdate({slug},req.body.article).populate('author');
        res.json({articles: articleData(updatedArticle,updatedArticle.author)});
    } catch (error) {
        console.log(error)
        next(error);
    }
});
// deleting an article
router.delete("/:slug", auth.verifyToken, async(req,res,next)=> {
    try {
        let slug = req.params.slug;
        let deletedArticle = await Article.findOneAndDelete({slug});
        res.json("article deleted");
    } catch (error) {
        next(error);
    }
});
// list of all the articles
router.get("/",async (req,res,next)=> {
    try {
        let articles = await Article.find({}).populate('author');
        console.log(articles);
        res.json({articles:articles.map((article) => articleData(article,article.author))});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// favorite article

router.post("/:slug/favorite", auth.verifyToken, async (req,res,next)=>{
    try {
        let slug = req.params.slug;
        let isArticleAvailable = await Article.findOne({slug}).populate("author");
        if(!isArticleAvailable) throw new Error("Article Not Found");
        let favoriteArticle = await Article.findOneAndUpdate({slug},{favoritesCount: isArticleAvailable.favoritesCount + 1,$push:{favorited: req.user.userId}},{new: true});
        res.json({article: articleData(favoriteArticle,isArticleAvailable.author,req.user.userId)});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

//unfavorite article

router.delete("/:slug/favorite", auth.verifyToken, async (req,res,next) => {
    try {
        let slug = req.params.slug;
        let isArticleAvailable = await Article.findOne({slug}).populate("author");
        if(!isArticleAvailable) throw new Error("Article Not Found");
        let unfavoriteArticle = await Article.findOneAndUpdate({slug},{favoritesCount: isArticleAvailable.favoritesCount-1,$pull : {favorited: req.user.userId}},{new: true});
        res.json({article: articleData(unfavoriteArticle,isArticleAvailable.author,req.user.userId)});
    } catch (error) {
        console.log(error);
        next(error);
    }
})

function articleData(article,author,currentUser=null) {
    const isFav = article.favorited.includes(currentUser);
    return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        favorited: isFav,
        favoritesCount: article.favoritesCount,
        author: {
            username: author.username,
            bio: author.bio,
            image: author.image,
            following : author.following
        }
    }
}

// creating comment

router.post("/:slug/comments", auth.verifyToken, async (req,res,next)=> {
    try {
        let slug = req.params.slug;
        req.body.comment.author = req.user.userId;
        let createdComment = await  Comment.create(req.body.comment);
        let author = await User.findById(req.user.userId);
        console.log(createdComment,createdComment.author);
        let article = await Article.findOneAndUpdate({slug},{$push : {comment : createdComment._id}},{new:true});
        if(!article) res.json('article not found');
        res.json({comment: commentDetail(createdComment,author)});
    } catch (error) {
        console.log(error);
        next(error);
    }
});
// getting list of comment
router.get("/:slug/comments", async (req,res,next)=> {
    try {
        let slug = req.params.slug;
        let articleComment = await Article.findOne({slug}).populate({path: 'comment', populate:{
            path:'author', model:"User"
        }});
        console.log(articleComment);
        res.json({comment: articleComment.comment.map((comments)=> commentDetail(comments,comments.author))});
    } catch (error) {
        console.log(error);
        next(error);
    }
});
// deleting a comment
router.delete("/:slug/comments/:id",auth.verifyToken, async(req,res,next)=> {
    try {
        let id = req.params.id;
        let slug = req.params.slug;
        let removedCommentId = await Article.findOneAndUpdate({slug},{$pull : {comment: id }});
        let deletedComment = await Comment.findByIdAndDelete(id);
        res.json("comment deleted");
    } catch (error) {
        
    }
})

function commentDetail(comment,author) {
    return {
        body: comment.body,
        author: {
            username: author.username,
            bio: author.bio,
            image: author.image,
            following : author.following
        }
    }
}

module.exports = router;