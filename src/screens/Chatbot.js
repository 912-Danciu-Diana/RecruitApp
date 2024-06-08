import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
    const { chatbot, profile } = useContext(AuthContext);
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleUserInput = event => {
        setUserInput(event.target.value);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const sendMessage = async () => {
        if (userInput.trim()) {
            const newHistory = [...chatHistory, { type: 'user', text: userInput }];
            setChatHistory(newHistory);
            try {
                const response = await chatbot(userInput);
                setChatHistory([...newHistory, { type: 'bot', text: response.reply }]);
            } catch (error) {
                console.error("Chatbot interaction failed:", error);
            }
            setUserInput('');
        }
    };

    return (
        <div className={`chatbot-container ${isCollapsed ? 'chatbot-collapsed' : ''}`}>
            <div className="chatbot-header" onClick={toggleCollapse}>
                Chatbot
                {isCollapsed ? <span>▼</span> : <span>▲</span>}
            </div>
            {!isCollapsed && (
                <div className="chatbot-body">
                    <div className="chat-history">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={msg.type === 'user' ? 'user-message' : 'bot-message'}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chatbot-input-container">
                        <input className="chatbot-input" value={userInput} onChange={handleUserInput} placeholder="Type a message..."/>
                        <button className="chatbot-send-button" onClick={sendMessage}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
