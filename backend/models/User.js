import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 2,
        // Add more configuration for password requirements
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    pantry: [{
        ingredientName: {
            type: String,
            required: true,
        },
    }],

});

// Hash the password before saving the user model

// userSchema.pre("save", async function () {
//     this.password = await bcrypt.hash(this.password, 12);
// });


const User = mongoose.model("User", userSchema);

// module.exports = User;

export default User;