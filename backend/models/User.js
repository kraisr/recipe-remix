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
    preferences: {
        lactoseIntolerance: {
            type: Boolean,
            default: false,
        },
        glutenIntolerance: {
            type: Boolean,
            default: false,
        },
        vegetarianism: {
            type: Boolean,
            default: false,
        },
        veganism: {
            type: Boolean,
            default: false,
        },
        kosher: {
            type: Boolean,
            default: false,
        },
        keto: {
            type: Boolean,
            default: false,
        },
        diabetes: {
            type: Boolean,
            default: false,
        },
        dairyFree: {
            type: Boolean,
            default: false,
        },
        others: {
            type: Boolean,
            default: false,
        },
    },
    mode: {
        type: Boolean,
        default: false,
    },
    reminder: {
        type: Boolean,
        default: false,
    },
    reminderSetting: {
        email: {
            type: String,
            default: "",
        },
        everydayAt: {
            bool: {
                type: Boolean,
                default: false,
            },
            time: {
                type: String,
                default: '',
            },        
        },  
        everyHour: {
            bool: {
                type: Boolean,
                default: false,
            },
            time: {
                type: String,
                default: '',
            },        
        },      
    },    

});

// Hash the password before saving the user model

// userSchema.pre("save", async function () {
//     this.password = await bcrypt.hash(this.password, 12);
// });


const User = mongoose.model("User", userSchema);

// module.exports = User;

export default User;