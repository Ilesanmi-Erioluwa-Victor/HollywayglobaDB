import mongoose, { Document, Model, Schema } from 'mongoose';


interface adminModel extends Document {
    email: string;
}
