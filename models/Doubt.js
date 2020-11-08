require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const doubtSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    doubt:{
        type:String,
        required:true
    }
})

const doubtModel = mongoose.model('doubt',doubtSchema)

module.exports = doubtModel