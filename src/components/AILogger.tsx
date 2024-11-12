import React, { useMemo } from 'react';

interface Metrics {
    politeness: number;
    professionalism: number;
    problemResolution: number;
    clarity: number;
    emotionalIntelligence: number;
    technicalAccuracy: number;
    completionScore: number;
}

interface QualityCheck {
    question: string;
    passed: boolean;
}

interface AILoggerProps {
    logs: Array<{
        timestamp: Date;
        metrics: Metrics;
        qualityChecks?: QualityCheck[];
    }>;
}

const DEFAULT_QUALITY_CHECKS: QualityCheck[] = [
    { question: "Did the agent properly introduce themselves?", passed: false },
    { question: "Did the agent collect all necessary information?", passed: false },
    { question: "Did the agent verify the customer's identity?", passed: false },
    { question: "Did the agent explain the process clearly?", passed: false },
    { question: "Did the agent follow up on unresolved issues?", passed: false },
    { question: "Did the agent provide accurate technical information?", passed: false },
    { question: "Did the agent confirm the customer's understanding?", passed: false },
    { question: "Did the agent offer additional assistance?", passed: false },
    { question: "Did the agent maintain professional tone throughout?", passed: false },
    { question: "Did the agent properly close the conversation?", passed: false }
];

const AILogger: React.FC<AILoggerProps> = ({ logs }) => {
    const averageMetrics = useMemo(() => {
        if (logs.length === 0) return null;

        const initialMetrics: Metrics = {
            politeness: 0,
            professionalism: 0,
            problemResolution: 0,
            clarity: 0,
            emotionalIntelligence: 0,
            technicalAccuracy: 0,
            completionScore: 0
        };

        const sums = logs.reduce((acc, log) => {
            Object.keys(log.metrics).forEach(key => {
                acc[key as keyof Metrics] += log.metrics[key as keyof Metrics];
            });
            return acc;
        }, {...initialMetrics});

        const averages: Metrics = Object.keys(sums).reduce((acc, key) => {
            acc[key as keyof Metrics] = sums[key as keyof Metrics] / logs.length;
            return acc;
        }, {...initialMetrics});

        return averages;
    }, [logs]);

    return (
        <div className="ai-logger">
            <h3>AI Analysis Log</h3>
            <div className="log-summary">
                <h4>Average Metrics</h4>
                {averageMetrics && (
                    <div className="average-metrics">
                        {Object.entries(averageMetrics).map(([key, value]) => (
                            <div key={key} className="metric-item">
                                <span className="metric-label">
                                    {key.split(/(?=[A-Z])/).join(' ')}:
                                </span>
                                <span className="metric-value">
                                    {value.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="log-container">
                <h4>Recent Analyses</h4>
                {logs.slice().reverse().map((log, index) => (
                    <div key={index} className="log-entry">
                        <div className="log-timestamp">
                            {log.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="log-metrics">
                            {Object.entries(log.metrics).map(([key, value]) => (
                                <div key={key} className="metric-item">
                                    <span className="metric-label">
                                        {key.split(/(?=[A-Z])/).join(' ')}:
                                    </span>
                                    <span className="metric-value">
                                        {value.toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="quality-checks">
                            <h5>Quality Checklist</h5>
                            {(log.qualityChecks || DEFAULT_QUALITY_CHECKS).map((check, idx) => (
                                <div key={idx} className="check-item">
                                    <span className={`check-status ${check.passed ? 'passed' : 'failed'}`}>
                                        {check.passed ? '✓' : '✗'}
                                    </span>
                                    <span className="check-question">{check.question}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AILogger; 