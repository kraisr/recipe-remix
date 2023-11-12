import mongoose from 'mongoose';


const ConversationSchema = new mongoose.Schema({
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' }],

  lastMessage: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message', 
    default: null }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
