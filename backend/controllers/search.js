import User from '../models/User.js';
import Post from '../models/Post.js';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";


dotenv.config(); // This should be at the top of your main file, not inside the function.

export const searchCommunity = async (req, res) => {
  const { term } = req.query;
  const searchRegex = new RegExp(term, 'i'); // 'i' for case-insensitive search
  console.log(term);
  try {
    let users = await User.find({
      $or: [
        { firstName: { $regex: searchRegex } },
        { lastName: { $regex: searchRegex } },
        { username: { $regex: searchRegex } },
      ],
    }).select('firstName lastName username _id');

    let posts = await Post.find({
      $or: [
        { name: { $regex: searchRegex } },
        { caption: { $regex: searchRegex } },
        // Search within string array directly without specifying a field
        { ingredients: { $regex: searchRegex } },
      ],
    }).select('name image caption createdAt ratings _id');

    // Sign a token for each user
    users = users.map((user) => {
      const userObject = user.toObject(); // Convert to a plain JavaScript object
      // Sign the token with only the _id payload and your secret
      // const token = jwt.sign({ _id: userObject._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return { ...userObject, token }; // Spread the userObject and add the token
    });

    // Now users contain tokens, you can send them along with posts.
    res.json({ users, posts });
  } catch (error) {
    console.error("Error during search: ", error);
    res.status(500).send({ message: 'Error during search', error: error.toString() });
  }
};
