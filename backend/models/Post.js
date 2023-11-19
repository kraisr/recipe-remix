import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

function commentCount(count) {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + 'k';
  } else {
    return (count / 1000000).toFixed(count % 1000000 === 0 ? 0 : 1) + 'm';
  }
}

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
  comments: [commentSchema],

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

postSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const seconds = Math.floor((now - this.createdAt) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
    return `${seconds}s`;
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days < 7) {
    return `${days}d`;
  } else if (weeks < 4) {
    return `${weeks}w`;
  } else if (months < 12) {
    return `${months}mo`;
  } else {
    return `${years}y`;
  }
});

postSchema.virtual('commentCount').get(function() {
  return commentCount(this.comments.length);
});

// Index creation for the Post schema
postSchema.index({ name: 'text', caption: 'text' });

export { postSchema };

const Post = mongoose.model('Post', postSchema);

export default Post;
