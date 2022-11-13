import mongoose from 'mongoose'

const login_schema = new mongoose.Schema({
    name: { type: String, default: 'user_default', unique: true },
    password: { type: String },
    filePath: { type: String },
  })
  
const file_schema = new mongoose.Schema({
  name:{type:String},
  path:{type:String}
})