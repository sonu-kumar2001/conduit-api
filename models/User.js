const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {hash,compare} = require("bcrypt");

let userSchema = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true, match: /@/},
    password: {type: String, required: true},
    bio: {type: String},
    image: {type: String},
    following: [{type: Schema.Types.ObjectId, ref:"User"}]
},{timestamps: true});

userSchema.pre("save", function(next) {
    if(this.password) {
        hash(this.password,12,(err,hash)=> {
            if(err) return next(err);
            this.password = hash;
            next();
        })
    } else next();
})

module.exports = mongoose.model("User",userSchema);