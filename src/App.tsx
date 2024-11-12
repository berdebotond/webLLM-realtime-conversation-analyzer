import React, { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import ScoreTable from './components/ScoreTable';
import { Message, ScoreMetrics } from './types';
import { validateConversation } from './services/aiValidation';
import './App.css';

const SAMPLE_MESSAGES = [
    "Hello! How can I assist you today?",
    "I'm having trouble with my account.",
    "I understand your concern. Could you please provide your account number?",
    "Sure, it's AC123456789.",
    "Thank you for providing that. I can see your account details now.",
    "Can you help me reset my password?",
    "Of course! I'll guide you through the password reset process.",
    "First, please verify your email address.",
    "It's user@example.com",
    "Perfect! I've sent a reset link to your email."
];

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [metrics, setMetrics] = useState<ScoreMetrics>({
        politenessScore: 0,
        completionScore: 0,
        engagementDuration: 0,
        professionalism: 0,
        problemResolution: 0,
        clarity: 0,
        emotionalIntelligence: 0,
        responseSpeed: 0,
        technicalAccuracy: 0
    });
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        const updateMetrics = async () => {
            if (messages.length > 0) {
                const validation = await validateConversation(messages.slice(-10));
                setMetrics(validation.metrics);
            }
        };

        updateMetrics();
    }, [messages]);

    const simulateMessage = (index: number) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            content: SAMPLE_MESSAGES[index],
            sender: index % 2 === 0 ? 'agent' : 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const startSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setMessages([]);

        SAMPLE_MESSAGES.forEach((_, index) => {
            setTimeout(() => {
                simulateMessage(index);
                if (index === SAMPLE_MESSAGES.length - 1) {
                    setIsSimulating(false);
                }
            }, index * 3000); // 3-second delay between messages
        });
    };

    return (
        <div className="app-container">
            <div className="chat-pane">
                <ChatBox messages={messages} />
                <div className="controls">
                    <button 
                        onClick={startSimulation}
                        disabled={isSimulating}
                        className="simulate-button"
                    >
                        {isSimulating ? 'Simulating...' : 'Start Simulation'}
                    </button>
                </div>
            </div>
            <div className="score-pane">
                <ScoreTable metrics={metrics} />
            </div>
        </div>
    );
};

export default App; 