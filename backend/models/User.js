import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Your email is required"],
        unique: true,
    },
    fistName: {
        type: String,
        required: [true, "Your first name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Your last name is required"],
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash the password before saving the user model
userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
