import mongoose from 'mongoose'

const todoSchemaRules ={
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
}


const todoSchema = new mongoose.Schema(todoSchemaRules);

const todoSchemaModel = mongoose.model("todos", todoSchema)

export default todoSchemaModel;