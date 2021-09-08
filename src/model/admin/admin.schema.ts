import { Schema, model } from 'mongoose';

const AdminSchema = new Schema({
    email: String,
    username: String,
    password: String,
});

export const Admin = model('admin', AdminSchema);