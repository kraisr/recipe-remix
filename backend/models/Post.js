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
  ingredients: [{
    type: String,
    required: false,
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, min: 0, max: 5 },
  }],
  difficulty: {
    type: String,
    required: false,
  },
  tags: [{
    type: String,
    required: false,
  }],
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual field for average rating
postSchema.virtual('averageRating').get(function() {
  let average = 0;
  if (this.ratings.length > 0) {
    const sum = this.ratings.map(rating => rating.value).reduce((acc, value) => acc + value, 0);
    average = sum / this.ratings.length;
  }
  return average.toFixed(2);
});

// Index creation for the Post schema
postSchema.index({ name: 'text', caption: 'text' });

const Post = mongoose.model('Post', postSchema);
export default Post;
