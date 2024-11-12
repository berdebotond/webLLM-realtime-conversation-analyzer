import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface ChatBoxProps {
    messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-container">
            {messages.slice(-10).map((message) => (
                <div 
                    key={message.id} 
                    className={`message ${message.sender}-message`}
                >
                    <div className="message-content">{message.content}</div>
                    <div className="message-timestamp">
                        {message.timestamp.toLocaleTimeString()}
                    </div>
                </div>
            ))}
            <div ref={chatEndRef} />
        </div>
    );
};

export default ChatBox; 