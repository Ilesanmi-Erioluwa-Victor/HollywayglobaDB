import mongoose, { Document, Model, Schema } from 'mongoose';


interface adminModel extends Document {
    email: string;
    username: string;
    password: string;
}

const adminSchema = new Schema<adminModel>({
    email: {
        type: String,
        required : true
    },

    username: {
        type : String,
        required : true
    },

    password : {
        type : String,
        required : true
    }
}, {
    timestamps : true
})


