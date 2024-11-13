import { Message, AIValidationResponse, ChatAnalysis } from '../types';
import { analyzeChatWithLlama } from './llamaService';
import { webLLMService } from './webLlmService';

interface ScoreMetrics {
    politenessScore: number;
    completionScore: number;
    keywordScore: number;
    responseSpeed: number;
    engagementDuration: number;
    professionalism: number;
    problemResolution: number;
    clarity: number;
    emotionalIntelligence: number;
    technicalAccuracy: number;
    [key: string]: number;
}

interface KeywordMetrics {
    keywordScore: number;
    politenessScore: number;
}

export const validateConversation = async (
    messages: Message[],
    selectedModel: string
): Promise<AIValidationResponse> => {
    try {
        let chatAnalysis;
        
        // Use WebLLM if a supported model is selected, otherwise fallback to Llama API
        if (selectedModel !== 'llama') {
            chatAnalysis = await webLLMService.analyzeChatWithWebLLM(messages);
        } else {
            chatAnalysis = await analyzeChatWithLlama(messages);
        }

        // Calculate basic metrics
        const agentMessages = messages.filter(m => m.sender === 'agent');
        const responseTimeAvg = calculateResponseTime(messages);
        const keywordMetrics = analyzeKeywords(agentMessages);
        
        // Calculate quality checks based on conversation analysis
        const qualityChecks = analyzeQualityChecks(messages);
        
        // Combine all metrics
        const metrics: ScoreMetrics = {
            responseSpeed: 100 - (responseTimeAvg / 10),
            engagementDuration: messages.length * 10,
            completionScore: chatAnalysis?.completionScore ?? 0,
            professionalism: chatAnalysis?.professionalism ?? 0,
            problemResolution: chatAnalysis?.problemResolution ?? 0,
            clarity: chatAnalysis?.clarity ?? 0,
            emotionalIntelligence: chatAnalysis?.emotionalIntelligence ?? 0,
            technicalAccuracy: chatAnalysis?.technicalAccuracy ?? 0,
            ...keywordMetrics,
            ...chatAnalysis?.metrics ?? {}
        };

        // Generate insights
        const analysis = await generateChatAnalysis(messages, metrics);

        return {
            isPolite: metrics?.politenessScore > 50,
            isIntroductionComplete: metrics?.completionScore > 30,
            metrics,
            qualityChecks: qualityChecks,
            analysis
        };  
    } catch (error) {
        console.error('AI Validation Error:', error);
        return getDefaultResponse();
    }
};

const calculateResponseTime = (messages: Message[]): number => {
    let totalTime = 0;
    let count = 0;

    for (let i = 1; i < messages.length; i++) {
        if (messages[i].sender === 'agent' && messages[i-1].sender === 'user') {
            totalTime += messages[i].timestamp.getTime() - messages[i-1].timestamp.getTime();
            count++;
        }
    }

    return count > 0 ? totalTime / count / 1000 : 0; // Average response time in seconds
};

const analyzeKeywords = (messages: Message[]): KeywordMetrics => {
    const keywords = {
        polite: ['please', 'thank', 'appreciate', 'welcome'],
        professional: ['assist', 'help', 'provide', 'support'],
        technical: ['account', 'system', 'process', 'verify']
    };

    // Calculate politeness score based on keyword matches
    const politenessScore = messages.reduce((score, message) => {
        const text = message.content.toLowerCase();
        return score + keywords.polite.filter(word => text.includes(word)).length * 25;
    }, 0);

    return {
        keywordScore: 0,
        politenessScore: Math.min(100, politenessScore) // Cap at 100
    };
};

const analyzeQualityChecks = (messages: Message[]): Array<{question: string; passed: boolean}> => {
    const agentMessages = messages.filter(m => m.sender === 'agent');
    const firstMessage = agentMessages[0]?.content.toLowerCase() || '';

    return [
        {
            question: "Did the agent properly introduce themselves?",
            passed: firstMessage.includes('hello') || firstMessage.includes('hi') || firstMessage.includes('welcome')
        },
        // Add more quality check logic here
        // ...
    ];
};

const generateChatAnalysis = async (
    messages: Message[], 
    metrics: ScoreMetrics
): Promise<ChatAnalysis> => {
    return {
        metrics,
        suggestions: [],
        criticalIssues: [],
        overallRating: metrics.completionScore
    }
};

const getDefaultResponse = (): AIValidationResponse => ({
    isPolite: false,
    isIntroductionComplete: false,
    metrics: {
        politenessScore: 50,
        completionScore: 50,
        responseSpeed: 50,
        engagementDuration: 0,
        professionalism: 50,
        problemResolution: 50,
        clarity: 50,
        emotionalIntelligence: 50,
        technicalAccuracy: 50
    },
    qualityChecks: [],
    analysis: {
        metrics: {
            politenessScore: 50,
            completionScore: 50,
            responseSpeed: 50,
            engagementDuration: 0,
            professionalism: 50,
            problemResolution: 50,
            clarity: 50,
            emotionalIntelligence: 50,
            technicalAccuracy: 50
        },
        suggestions: [],
        criticalIssues: [],
        overallRating: 50
    }
}); 