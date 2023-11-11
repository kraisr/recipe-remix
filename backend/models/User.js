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
        required: false,
        min: 2,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    username: {
        type: String,
        required: true,
        // unique: true,
        min: 2,
        max: 50,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleSignIn;
        },
        min: 2,
    },
    isEmailVerified: { 
        type: Boolean, 
        default: false 
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    twoFACode: {
        type: String,
    },
    twoFACodeToken: String,
    twoFACodeTokenExpires: Date, 
    passwordResetToken: String,
    passwordResetExpires: Date,
    googleSignIn: {
        type: Boolean,
        required: true,
        default: false,
        min: 2,
        // Add more configuration for password requirements
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bio: {
        type:String,
        required:false,
    },
    link: {
        type:String,
        required:false,
    },
    image: {
        type: String, 
        required: false,
    },
    pantry: [{
        ingredientName: {
            type: String,
            required: true,
        },
    }],
    recipes: [{
        id: {
            type: String,
            required: false,
        },
        totalTime: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: false,
        },
        numberOfServings: {
            type: Number,
            required: false,
        },
        ingredientLines: [String],
        source: {
            recipeUrl: {
                type: String,
                required: false,
            }
        },
        mainImage: {
            type: String,
            required: false,
        },
        instructions: [String],
    }],
    folders: [{
        name: {
            type: String,
            required: true,
        },
        recipes: [{
            id: {
                type: String,
                required: true,
            },
            totalTime: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: false,
            },
            numberOfServings: {
                type: Number,
                required: false,
            },
            ingredientLines: [String],
            source: {
                recipeUrl: {
                    type: String,
                    required: false,
                }
            },
            mainImage: {
                type: String,
                required: false,
            },
            instructions: [String],
        }],
    }],
    filters: {
        vegetarian: {
            type: Boolean,
            default: false,
        },
        vegan: {
            type: Boolean,
            default: false,
        },
        dairy: {
            type: Boolean,
            default: false,
        },
        gluten: {
            type: Boolean,
            default: false,
        },
        keto: {
            type: Boolean,
            default: false,
        },
        kosher: {
            type: Boolean,
            default: false,
        },
        sugar: {
            type: Boolean,
            default: false,
        },
    },
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
        nutAllergies: {
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
    shoppingLists: [{
        id: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: false,
        },
        items: [{
            item: {
                type: String,
                required: false,
            },
            quantity: {
                type: Number,
            },
            unit: { 
                type: String,
            }
        }],
    }],
    
    set2FA: {
        type: Boolean,
        default: false,
    },

    animate: {
        type: Boolean, 
        default: true,
    },
});


const User = mongoose.model("User", userSchema);

export default User;