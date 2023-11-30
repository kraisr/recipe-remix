import express from 'express';
import { startConversation, getConversations, getMessages, sendMessage, getAllUsers, deleteConversation } from '../controllers/messagesController.js';

const router = express.Router();

router.get("/conversations", getConversations);
router.get("/messages/:conversationId", getMessages);
router.post("/messages", sendMessage);
router.post("/conversations/start", startConversation);
router.get("/users", getAllUsers);
router.delete("/conversations/:conversationId", deleteConversation);




export default router;
