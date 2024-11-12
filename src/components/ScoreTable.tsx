import React from 'react';
import { ScoreMetrics } from '../types';

interface ScoreTableProps {
    metrics: ScoreMetrics;
}

const ScoreTable: React.FC<ScoreTableProps> = ({ metrics }) => {
    const formatScore = (score: number) => `${score.toFixed(1)}%`;

    const metricGroups = [
        {
            title: "Communication",
            metrics: [
                { label: "Politeness", value: metrics.politenessScore },
                { label: "Clarity", value: metrics.clarity },
                { label: "Emotional Intelligence", value: metrics.emotionalIntelligence }
            ]
        },
        {
            title: "Performance",
            metrics: [
                { label: "Problem Resolution", value: metrics.problemResolution },
                { label: "Response Speed", value: metrics.responseSpeed },
                { label: "Technical Accuracy", value: metrics.technicalAccuracy }
            ]
        }
    ];

    return (
        <div className="score-table">
            <h2>Agent Performance Metrics</h2>
            {metricGroups.map(group => (
                <div key={group.title} className="metric-group">
                    <h3>{group.title}</h3>
                    <table>
                        <tbody>
                            {group.metrics.map(metric => (
                                <tr key={metric.label}>
                                    <td>{metric.label}:</td>
                                    <td className={`score-value ${getScoreClass(metric.value)}`}>
                                        {formatScore(metric.value)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

const getScoreClass = (score: number): string => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'needs-improvement';
};

export default ScoreTable; 