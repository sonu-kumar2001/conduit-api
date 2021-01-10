const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let articleSchema = new Schema({
    slug: {type: String},
    title: {type: String,required: true},
    description: {type: String,required:true},
    body: {type: String,required: true},
    tagList: [{type: String}],
    favorited: [{type: String}],
    favoritesCount: {type:Number, default: 0},
    author:{type: Schema.Types.ObjectId, ref:"User",required:true},
    comment: [{type:Schema.Types.ObjectId, ref:"Comment"}]
},{timestamps: true});

module.exports = mongoose.model("Article",articleSchema);