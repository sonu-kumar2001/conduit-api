const mongoose = require("mongoose");

module.exports = {
    connect : () => {
        mongoose.connect("mongodb://localhost/conduit",{useNewUrlParser: true, useUnifiedTopology: true},(err)=> {
            console.log(err ? err : "connected to database");
        })
    }
}