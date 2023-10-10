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
        required: function() {
            return !this.googleSignIn;
        },
        min: 2,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    googleSignIn: {
        type: Boolean,
        required: true,
        default: false,
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