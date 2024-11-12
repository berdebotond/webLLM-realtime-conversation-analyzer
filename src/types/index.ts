export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'agent';
    timestamp: Date;
}

export interface ScoreMetrics {
    politenessScore: number;
    completionScore: number;
    engagementDuration: number;
    professionalism: number;
    problemResolution: number;
    clarity: number;
    responseSpeed: number;
    emotionalIntelligence: number;
    technicalAccuracy: number;
}

export interface ChatAnalysis {
    metrics: ScoreMetrics;
    suggestions: string[];
    criticalIssues: string[];
    overallRating: number;
}

export interface AIValidationResponse {
    isPolite: boolean;
    isIntroductionComplete: boolean;
    metrics: ScoreMetrics;
} 