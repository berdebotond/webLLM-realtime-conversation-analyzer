import React, { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import ScoreTable from './components/ScoreTable';
import AILogger from './components/AILogger';
import { Message, ScoreMetrics } from './types';
import { validateConversation } from './services/aiValidation';
import './App.css';

const CONVERSATION_SCENARIOS = {
    polite: {
        name: "Polite Conversation",
        messages: [
            "Hello! How can I assist you today?",
            "I'm having trouble with my account.",
            "I understand your concern. Could you please provide your account number?",
            "Sure, it's AC123456789.",
            "Thank you for providing that. I can see your account details now.",
            "Can you help me reset my password?",
            "Of course! I'll guide you through the password reset process.",
            "First, please verify your email address.",
            "It's user@example.com",
            "Perfect! I've sent a reset link to your email. Please check your inbox.",
            "I don't see it yet. Should I check spam?",
            "Yes, that's a great idea! Sometimes reset emails can be filtered to spam. While you check, would you like me to explain the reset process?",
            "Yes, please explain.",
            "Once you receive the email, click the reset link. It will take you to a secure page where you can create a new password. Make sure to use at least 8 characters, including numbers and special characters.",
            "Found it! Thanks for the explanation.",
            "You're welcome! Let me know if you need help with the new password requirements.",
            "Actually, I'm getting an error message when trying to set the new password.",
            "I apologize for the inconvenience. Could you please tell me what error message you're seeing?",
            "It says 'Password must contain at least one uppercase letter'",
            "Ah, I should have mentioned that! Yes, please include at least one uppercase letter. Would you like some examples of secure password formats?",
            "Yes, that would be helpful.",
            "For example, you could use something like 'Adventure2024!' or 'Secure@Pass123'. Just make sure not to use these exact examples.",
            "Got it working now. Thank you for all your help!",
            "You're very welcome! Is there anything else I can assist you with today?"
        ]
    },
    impolite: {
        name: "Impolite Conversation",
        messages: [
            "What do you want?",
            "I can't login to my account.",
            "Account number?",
            "AC123456789",
            "Found it. What's the problem?",
            "I need to reset my password",
            "Fine. Give me your email.",
            "user@example.com",
            "Reset link sent. Anything else?",
            "I don't see the email",
            "Check your spam folder",
            "Still don't see it",
            "I already sent it. Just wait.",
            "It's been 10 minutes already!",
            "Not my fault if you can't find it.",
            "This is ridiculous. Send it again.",
            "Whatever. Sending another one.",
            "Now I'm getting some error about uppercase letters",
            "Obviously you need an uppercase letter. How hard is that?",
            "You never told me that!",
            "It's common sense. Just add a capital letter.",
            "This is the worst customer service ever",
            "Are you done complaining?",
            "I want to speak to your supervisor",
            "Good luck with that."
        ]
    },
    technical: {
        name: "Technical Issues",
        messages: [
            "Hey, system's giving me errors",
            "What kind of errors are you seeing?",
            "Database connection timeout",
            "Did you check the connection string?",
            "Yeah, seems correct",
            "Restart the service",
            "Still not working",
            "Did you try clearing the cache?",
            "How do I do that?",
            "Figure it out yourself",
            "I need actual help here",
            "Not my problem. Check the docs.",
            "The docs are outdated",
            "Then Google it",
            "I already tried that",
            "Sounds like user error",
            "No, it's definitely a system issue",
            "Whatever. Try rebooting.",
            "That didn't fix anything",
            "Then your system must be broken",
            "Can you escalate this?",
            "No point. Nobody else will help either.",
            "This is affecting production!",
            "Not my department",
            "I'm logging a complaint"
        ]
    },
    passive_aggressive: {
        name: "Passive Aggressive Support",
        messages: [
            "Thanks for contacting support... how may I help you today?",
            "My account is locked out",
            "Oh, let me guess... you forgot your password again?",
            "No, the system locked me out",
            "Sure it did... Well, I *suppose* I can help you with that",
            "I've tried resetting it three times",
            "Must be nice to have so much free time to keep trying...",
            "This is affecting my work!",
            "Isn't everything an emergency these days? 🙄",
            "Can you please just help me?",
            "Since you asked so nicely... what's your account number?",
            "AC123456789",
            "Wow, you actually remembered it this time!",
            "Can you unlock my account now?",
            "I'm working on it... some of us have multiple tickets to handle...",
            "How long will it take?",
            "As long as it takes... unless you'd like to do it yourself?",
            "I just need access to do my job",
            "Don't we all... Your account is unlocked. Try not to lock it again.",
            "Finally! But I didn't lock it in the first place",
            "Of course you didn't... Is there anything *else* you need help with?",
            "No, that's all",
            "Perfect! Have a day as pleasant as you are! 😊",
            "I'd like to give some feedback about this interaction",
            "Oh, I'm sure you would... 🙄"
        ]
    }
};

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedScenario, setSelectedScenario] = useState<string>('polite');
    const [metricsHistory, setMetricsHistory] = useState<ScoreMetrics[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [showLogs, setShowLogs] = useState<boolean>(false);
    const [aiLogs, setAiLogs] = useState<Array<{
        timestamp: Date;
        metrics: any;
    }>>([]);
    const [qualityChecks, setQualityChecks] = useState<Array<{
        question: string;
        passed: boolean;
        timestamp: Date | null;
    }>>([
        { question: "Agent Introduction", passed: false, timestamp: null },
        { question: "Identity Verification", passed: false, timestamp: null },
        { question: "Problem Understanding", passed: false, timestamp: null },
        { question: "Solution Explanation", passed: false, timestamp: null },
        { question: "Data Collection", passed: false, timestamp: null },
        { question: "Technical Accuracy", passed: false, timestamp: null },
        { question: "Follow-up Offered", passed: false, timestamp: null },
        { question: "Closing Confirmation", passed: false, timestamp: null },
    ]);

    useEffect(() => {
        const updateMetrics = async () => {
            if (messages.length > 0) {
                const validation = await validateConversation(messages.slice(-10));
                setMetricsHistory(prev => [...prev, validation.metrics]);
                
                setAiLogs(prev => [...prev, {
                    timestamp: new Date(),
                    metrics: validation.metrics
                }]);
            }
        };

        updateMetrics();
    }, [messages]);

    useEffect(() => {
        if (messages.length > 0) {
            const allMessages = messages.map(m => m.content.toLowerCase());
            
            // Create a new copy of quality checks
            const updatedChecks = qualityChecks.map(check => {
                switch (check.question) {
                    case "Agent Introduction":
                        if (!check.passed && (allMessages[0]?.includes("hello") || allMessages[0]?.includes("welcome"))) {
                            return { ...check, passed: true, timestamp: new Date() };
                        }
                        break;
                    case "Identity Verification":
                        if (!check.passed && allMessages.some(m => m.includes("account") && m.includes("number"))) {
                            return { ...check, passed: true, timestamp: new Date() };
                        }
                        break;
                    // Add more cases for other checks
                }
                return check;
            });

            setQualityChecks(updatedChecks);
        }
    }, [messages, qualityChecks]);

    const simulateMessage = (index: number) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            content: CONVERSATION_SCENARIOS[selectedScenario as keyof typeof CONVERSATION_SCENARIOS].messages[index],
            sender: index % 2 === 0 ? 'agent' : 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const startSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setMessages([]);

        const scenarioMessages = CONVERSATION_SCENARIOS[selectedScenario as keyof typeof CONVERSATION_SCENARIOS].messages;
        scenarioMessages.forEach((_, index) => {
            setTimeout(() => {
                simulateMessage(index);
                if (index === scenarioMessages.length - 1) {
                    setIsSimulating(false);
                }
            }, index * 3000);
        });
    };

    return (
        <div className="app-container">
            <div className="main-content">
                <div className="chat-pane">
                    <div className="live-dashboard">
                        <h3>Live Requirements Dashboard</h3>
                        <div className="requirements-grid">
                            {qualityChecks.map((check, index) => (
                                <div 
                                    key={index} 
                                    className={`requirement-item ${check.passed ? 'completed' : 'pending'}`}
                                >
                                    <span className="check-icon">
                                        {check.passed ? '✓' : '○'}
                                    </span>
                                    <span className="check-label">{check.question}</span>
                                    {check.timestamp && (
                                        <span className="check-time">
                                            {check.timestamp.toLocaleTimeString()}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <ChatBox messages={messages} />
                    <div className="controls">
                        <select 
                            value={selectedScenario}
                            onChange={(e) => setSelectedScenario(e.target.value)}
                            className="scenario-select"
                            disabled={isSimulating}
                        >
                            {Object.entries(CONVERSATION_SCENARIOS).map(([key, scenario]) => (
                                <option key={key} value={key}>
                                    {scenario.name}
                                </option>
                            ))}
                        </select>
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
                    <ScoreTable metrics={metricsHistory} />
                </div>
            </div>
            <div className="logs-toggle-button">
                <button onClick={() => setShowLogs((prev: boolean) => !prev)}>
                    {showLogs ? 'Hide Logs' : 'Show Logs'}
                </button>
            </div>
            <div className={`bottom-logger ${showLogs ? 'show' : ''}`}>
                <AILogger logs={aiLogs} />
            </div>
        </div>
    );
};

export default App; 