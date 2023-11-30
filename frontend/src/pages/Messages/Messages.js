import React, { useState, useEffect } from 'react';
import './messages.css';
import { useParams } from "react-router-dom";



const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    
    const { conversationId } = useParams();
    const token = localStorage.getItem('token');

    let userId = '';

    if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        userId = JSON.parse(window.atob(base64)).id;
    }


    // useEffect(() => {
    //     // This will run once when the component mounts
    //     const fetchData = async () => {
    //       await fetchConversations();
    //       await fetchAllUsers();
    //     };
        
      
    //     fetchData();
    //   }, []);

    useEffect(() => {
        if (token) {
            fetchConversations();
            fetchAllUsers();
        }
    }, [token]);


      useEffect(() => {
        // This will run whenever the conversations change or when the component mounts
        const selectConversation = () => {
          // Find the new conversation based on the conversationId
          const newConversation = conversations.find(convo => convo._id === conversationId);
      
          if (newConversation) {
            setSelectedConversation(newConversation);
            fetchMessages(conversationId);
          }
        };
      
        selectConversation();
      }, [conversationId, conversations]);

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
    
            // Sort conversations
            const sortedData = data.sort((a, b) => {
                const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
                const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
                return dateB - dateA;
            });
    
            setConversations(sortedData);
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

    const handleDeleteChat = async (conversationId) => {
        if (!window.confirm("Are you sure you want to delete this conversation?")) {
            return; // Stop if the user does not confirm
        }

        try {
            const response = await fetch(`http://localhost:8080/message/conversations/${conversationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) throw new Error('Failed to delete chat');
            await fetchConversations(); // Refresh conversations list
            if (selectedConversation?._id === conversationId) {
                setSelectedConversation(null); // Deselect conversation if it was deleted
            }
            setSuccessMessage("Conversation deleted successfully!");
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };
    

    const handleSelectConversation = (conversation) => {
        console.log("Selected conversation:", conversation); // Debugging log
        setSelectedConversation(conversation);
        fetchMessages(conversation._id);
    };

    
    const getOtherParticipant = (participants) => {
        if (!participants || participants.length === 0) {
            console.error("Participants array is empty or undefined");
            return {};
        }
    
        const other = participants.find(p => p?._id?.toString() !== userId.toString());
        console.log('Other participant:', other);
        return other || {};
    };
      
      
    
    const handleStartConversation = async (otherUserEmail) => {
        try {
            const existingConversation = conversations.find(convo => 
                convo.participants.some(participant => participant.email === otherUserEmail)
            );
    
            if (existingConversation) {
                setSelectedConversation(existingConversation);
                fetchMessages(existingConversation._id);
            } else {
                const response = await fetch('http://localhost:8080/message/conversations/start', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ otherUserEmail })
                });
    
                if (!response.ok) throw new Error('Network response was not ok');
                const newConversation = await response.json();
    
                // Fetch additional participant details if needed (pseudo-code)
                // const participantDetails = await fetchParticipantDetails(otherUserEmail);
    
                // Update the conversations list with complete participant details
                setConversations(prevConversations => [...prevConversations, {...newConversation, /* include participant details here */}]);
                setSelectedConversation({...newConversation, /* include participant details here */});
                fetchMessages(newConversation._id);
            }
    
            setSearchTerm('');
            setSearchResults([]);
        } catch (error) {
            console.error("Error handling conversation:", error);
        }
    };
    
    
    // gif api key hF8C3cocUNE8niLuyAlMj8eLPWv8f9hU
    
      const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };


    const handleSendMessage = async () => {
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
            const sentMessage = await response.json();
        
            // Update and sort conversations
            setConversations(prevConversations => {
                const updatedConversations = prevConversations.map(convo => {
                    if (convo._id === selectedConversation._id) {
                        return { ...convo, lastMessage: sentMessage };
                    }
                    return convo;
                });
                return updatedConversations.sort((a, b) => {
                    const lastMessageA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
                    const lastMessageB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
                    return lastMessageB - lastMessageA;
                });
            });
        
            setNewMessage('');
            fetchMessages(selectedConversation._id);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    
    

    
    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }
    
        const filteredConversations = conversations.filter(convo => 
            convo.participants.some(participant => 
                participant.name?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setSearchResults(filteredConversations);
    };
    
    
    

    return (
        <div className="chat-container">
            <div className="conversation-list">
                <div className="search-input-container">
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="search-input"
                    />
                    {searchResults.length > 0 && (
                        <div className="search-suggestions-container">
                            <ul className="search-suggestions-dropdown">
                                {searchResults.map(convo => (
                                    <li key={convo._id} className="suggestion-item"
                                        onClick={() => handleSelectConversation(convo)}>
                                        {convo.participants.map(p => p.name).join(', ')}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                 {conversations.map((conversation) => {
                    const otherParticipant = getOtherParticipant(conversation.participants);
                    const lastMessageContent = conversation.lastMessage ? conversation.lastMessage.content : "No messages yet";
                    const participantName = otherParticipant.username || 'Unknown';
                    const isActive = selectedConversation?._id === conversation._id ? 'active' : '';

                     return (
                        <div key={conversation._id} className={`conversation-item ${isActive}`} onClick={() => handleSelectConversation(conversation)}>
                            <img src={otherParticipant.image || 'default-profile.png'} alt={participantName} className="profile-pic" />
                            <div className="conversation-info">
                                <p className="participant-name">{participantName}</p>
                                <p className="last-message">{lastMessageContent}</p>
                            </div>
                            <button 
                        className="delete-chat-button" 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            handleDeleteChat(conversation._id); 
                        }}>
                        Delete Chat
                    </button>

                        </div>
                    );

                })}
                
            </div>
            <div className="chat-window">
            {selectedConversation && (
                <div className='participant-name-2'>
                    <p className="participant-name">{getOtherParticipant(selectedConversation.participants)?.username || 'Unknown'}</p>
                </div>
            )}
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
                onKeyDown={handleKeyDown}

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


