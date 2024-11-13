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
            {messages.map((message, index) => (
                <div key={`${message.timestamp}-${index}`} className={`message ${message.sender}-message`}>
                    <div className="message-content">
                        {message.content}
                    </div>
                    <div className="message-timestamp">
                        {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
            ))}
            <div ref={chatEndRef} style={{ float: 'left', clear: 'both' }} />
        </div>
    );
};

export default ChatBox; 