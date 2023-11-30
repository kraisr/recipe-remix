import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  conversation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conversation'
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  content: { 
    type: String, 
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'gif'],
    default: 'text'
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  } 
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;