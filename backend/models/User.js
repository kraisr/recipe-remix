import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fistName: {
        type: String,
        required: [true, "Your first name is required"],
        min: 2,
        max: 50,
    },
    lastName: {
        type: String,
        required: [true, "Your last name is required"],
        min: 2,
        max: 50,
    },
    email: {
        type: String,
        required: [true, "Your email is required"],
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
        min: 8,
        // Add more configuration for password requirements
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash the password before saving the user model

// userSchema.pre("save", async function () {
//     this.password = await bcrypt.hash(this.password, 12);
// });


const User = mongoose.model("User", userSchema);

// module.exports = User;

export default User;