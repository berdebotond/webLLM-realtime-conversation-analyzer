import React from 'react';
import { ScoreMetrics } from '../types';

interface ScoreTableProps {
    metrics: ScoreMetrics[];
}

const ScoreTable: React.FC<ScoreTableProps> = ({ metrics }) => {
    const formatScore = (score: number) => `${score.toFixed(1)}%`;

    // Calculate average for any metric
    const calculateAverage = (metricKey: keyof ScoreMetrics) => {
        const sum = metrics.reduce((acc, curr) => acc + curr[metricKey], 0);
        return metrics.length > 0 ? sum / metrics.length : 0;
    };

    const metricGroups = [
        {
            title: "Communication",
            metrics: [
                { label: "Politeness", value: calculateAverage('politenessScore') },
                { label: "Clarity", value: calculateAverage('clarity') },
                { label: "Emotional Intelligence", value: calculateAverage('emotionalIntelligence') }
            ]
        },
        {
            title: "Performance",
            metrics: [
                { label: "Problem Resolution", value: calculateAverage('problemResolution') },
                { label: "Response Speed", value: calculateAverage('responseSpeed') },
                { label: "Technical Accuracy", value: calculateAverage('technicalAccuracy') }
            ]
        }
    ];

    return (
        <div className="score-table">
            <h2>Agent Performance Metrics</h2>
            {metricGroups.map(group => (
                <div key={group.title} className="metric-group">
                    <h3>
                        {group.title}
                        <span className={`score-value ${getScoreClass(group.metrics[0].value)}`}>
                            (Avg: {formatScore(group.metrics[0].value)})
                        </span>
                    </h3>
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