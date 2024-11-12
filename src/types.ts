// Add or update the ChatAnalysis interface
export interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
}

export interface ScoreMetrics {
    politenessScore: number;
    completionScore: number;
    engagementDuration: number;
    professionalism: number;
    problemResolution: number;
    clarity: number;
    emotionalIntelligence: number;
    responseSpeed: number;
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