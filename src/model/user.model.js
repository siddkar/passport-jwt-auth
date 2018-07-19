import { mongoose } from '../config';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username should be unique'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is mandatory'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    age: {
        type: Number,
    },
    contact: {
        type: Number,
        unique: true,
    },
    city: {
        type: String,
    },
});

export default mongoose.model('User', userSchema);
