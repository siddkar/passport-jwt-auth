import bcrypt from 'bcrypt';
import { mongoose } from '../config';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email id is mandatory'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is mandatory'],
    },
    firstName: {
        type: String,
        required: [true, 'First name is mandatory'],
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is mandatory'],
    },
    dob: {
        type: Date,
    },
    phone: {
        type: Number,
        unique: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
    dateOfCreation: {
        type: Date,
        default: Date.now,
    },
});

// This is called a pre-hook, before the user information is saved in the database
// this function will be called, we'll get the plain text password, hash it and store it
UserSchema.pre('save', async (next) => {
    // the more higher the salt round more the security, but makes application slow
    const hash = await bcrypt.hash(this.password, 20);
    this.password = hash;
    next();
});

// We'll use this later on to make sure that the user trying to log in has the correct credentials
UserSchema.methods.isValidPassword = async (password) => {
    // Hashes the password sent by the user for login and checks if the hashed password stored in the
    // database matches the one sent. Returns true if it does else false.
    const compare = await bcrypt.compare(password, this.password);
    return compare;
};

export default mongoose.model('User', UserSchema);
