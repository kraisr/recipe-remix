import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema ({
    id: {

    },
    ingredients: [{
        ingredientName: {
            type: String,
            required:true,
        }
    }],
    instructions: {
        type: String,
        required: true,
    }, 

    image: {
        type: String,
        required:true,
    }
    
})

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;