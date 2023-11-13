import React, { useState, useEffect } from 'react';
import './messages.css';


const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [showStartConversationModal, setShowStartConversationModal] = useState(false);
    const [selectedUserForConversation, setSelectedUserForConversation] = useState('');

    const token = localStorage.getItem('token');
    let userId = '';
    if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        userId = JSON.parse(window.atob(base64)).id;
    }


    useEffect(() => {
        fetchConversations();
        fetchAllUsers(); // Fetch all users for new conversation 
    }, []);

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await fetch('http://localhost:8080/message/users', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setAllUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await fetch('http://localhost:8080/message/conversations', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await fetch(`http://localhost:8080/message/messages/${conversationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation._id);
    };


    const handleStartConversation = async () => {
        try {
          if (!token) throw new Error('No token found');
          const response = await fetch('http://localhost:8080/message/conversations/start', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ otherUserEmail: selectedUserForConversation })
          });
    
          if (!response.ok) throw new Error('Network response was not ok');
          const newConversation = await response.json();
          setSelectedConversation(newConversation); // Set the new conversation as selected
          fetchConversations(); // Refresh conversation list
          setShowStartConversationModal(false); // Hide the start conversation modal
          setMessages([]); // Clear previous messages if any
        } catch (error) {
          console.error("Error starting new conversation:", error);
        }
      };


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await fetch('http://localhost:8080/message/messages', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    conversationId: selectedConversation._id,
                    content: newMessage
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            setNewMessage('');
            fetchMessages(selectedConversation._id);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const filteredConversations = conversations.filter(conversation =>
        conversation.participants.some(participant =>
            participant.name && participant.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    

    const handleCloseModal = () => {
        setShowStartConversationModal(false);
        setSelectedUserForConversation('');
    };


    return (
        <div className="chat-container">
            <div className="conversation-list">
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setSearchTerm(e.target.value || '')}

                />
                <button onClick={() => setShowStartConversationModal(true)}>Start New Conversation</button>
                {showStartConversationModal && (
                    <div className="start-conversation-modal">
                        <select
                            value={selectedUserForConversation}
                            onChange={(e) => setSelectedUserForConversation(e.target.value || '')}
                        >
                            <option value="">Select a User</option>
                            {allUsers.map(user => (
                                <option key={user._id} value={user.email}>{user.username}</option>
                            ))}
                        </select>

                        <button onClick={handleStartConversation}>Start Conversation</button>
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                )}
                {filteredConversations.map(conversation => (
                    <div key={conversation._id}>
                        Conversation with {conversation.participants.map(p => p.name).join(', ')}
                    </div>
                ))}

            </div>
            <div className="chat-window">
                {selectedConversation ? (
                    <>
                    <div className="message-list">
                        {messages.map(message => (
                            <div key={message._id} className={`message-bubble ${message.sender._id === userId ? 'sent' : 'received'}`}>
                                <img src={message.sender.image} alt={message.sender.username} className="profile-pic" />
                                {message.content}
                            </div>
                        ))}
                    </div>
                    <div className="message-input-container">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>    
                ) : (
                    <div className="start-message-prompt">
                      Select a conversation to start messaging!
                    </div>
                  )}
                </div>
              </div>
            );
          };

export default Messages;