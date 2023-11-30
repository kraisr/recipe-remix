import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';



export const getAllUsers = async (req, res) => {
    try {
        // Select only the email and username fields
        const users = await User.find().select('email username -_id');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  };
  
export const getConversations = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        })
        .populate('participants', 'username image _id') // include image and _id here
        .populate('lastMessage'); // populate last message

        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        await Conversation.findByIdAndDelete(conversationId);
        await Message.deleteMany({ conversation: conversationId });
        res.status(200).json({ message: 'Conversation deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




export const getMessages = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        
        const messages = await Message.find({ conversation: conversationId })
                                     .populate('sender', 'username image'); // Populating sender's username and image

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const senderId = decoded.id;

        const newMessage = new Message({
            conversation: req.body.conversationId,
            sender: senderId,
            content: req.body.content,
            createdAt: new Date(),
            messageType: req.body.isGif ? 'gif' : 'text' // Determine if message is a GIF
        });

        // Save the new message
        const savedMessage = await newMessage.save();

        // Update the conversation's last message
        await Conversation.findByIdAndUpdate(
            req.body.conversationId,
            { lastMessage: savedMessage._id },
            { new: true }
        );

        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const startConversation = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { otherUserEmail } = req.body;


        const otherUser = await User.findOne({ email: otherUserEmail });
        if (!otherUser) {
            return res.status(404).json({ error: "User not found" });
        }


        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUser._id] }
        });

        if (!conversation) {
            // Create a new conversation
            conversation = new Conversation({
                participants: [userId, otherUser._id]
            });
            await conversation.save();
        }

        res.status(201).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};