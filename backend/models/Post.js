import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  name: String, 
  image: String,
  caption: String,
  isCustom: Boolean,
  customRecipe: {
    image: String,
    name: String,
    ingredients: [String],
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const Post = mongoose.model('Post', postSchema);
export default Post;
