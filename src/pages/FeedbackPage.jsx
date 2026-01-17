import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Share2, ArrowRight, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import CustomTooltip from '../components/ui/Tooltip';
import { useAuth } from '../context/AuthContext';
import { analysisService } from '../services/analysisService';

import { ROUTES } from '../routes';

import PropTypes from 'prop-types';

const ScoreCard = ({ title, score, color, icon: Icon, description }) => (
    <CustomTooltip content={description}>
        <Card className="flex flex-col items-center justify-center p-6 text-center cursor-help">
            <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${color} bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <span className="text-4xl font-bold mb-1">{score}</span>
            <span className="text-sm text-slate-400">{title}</span>
        </Card>
    </CustomTooltip>
);

ScoreCard.propTypes = {
    title: PropTypes.string.isRequired,
    score: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    description: PropTypes.string.isRequired,
};

const FeedbackPage = () => {
    const navigate = useNavigate();
    const { currentSession } = useAuth();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentSession) {
            navigate('/practice');
            return;
        }

        const fetchAnalysis = async () => {
            setLoading(true);
            try {
                // Use the shared service
                const result = await analysisService.analyzeTranscript(
                    currentSession.transcript,
                    currentSession.question,
                    currentSession.duration
                );

                // Add metadata from session that service doesn't know about
                setAnalysis({
                    ...result,
                    transcript: currentSession.transcript,
                    duration: currentSession.duration,
                    wpm: Math.round((currentSession.transcript.split(' ').length / currentSession.duration) * 60) || 0
                });
            } catch (err) {
                console.error("Analysis failed", err);
                // Fallback handled inside service, but double check here if needed
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [currentSession, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-slate-500">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p>Analyzing your speech...</p>
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div className="min-h-screen pt-28 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
                        <p className="text-slate-400">Here's how you performed on "{currentSession?.question}"</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                        <Button size="sm" onClick={() => navigate(ROUTES.PRACTICE)}>
                            Next Question <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Top Level Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-primary-900/40 to-slate-900 border-primary-500/30 col-span-2 md:col-span-1">
                        <div className="h-full flex flex-col items-center justify-center p-4">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351.86} strokeDashoffset={351.86 * (1 - (analysis.overallScore / 100))} className="text-primary-500" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold">{analysis.overallScore}</span>
                                    <span className="text-xs uppercase tracking-wider text-slate-400">Total Score</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <ScoreCard
                        title="Confidence"
                        score={`${analysis.confidence}%`}
                        color="bg-green-500"
                        icon={CheckCircle}
                        description="Based on filler usage and pace stability."
                    />
                    <ScoreCard
                        title="Clarity"
                        score={`${analysis.clarity}%`}
                        color="bg-yellow-500"
                        icon={AlertTriangle}
                        description="Based on vocabulary complexity."
                    />
                    <ScoreCard
                        title="Relevance"
                        score={`${analysis.relevance}%`}
                        color="bg-blue-500"
                        icon={CheckCircle}
                        description="How well you answered the specific question asked."
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Detailed Feedback */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Transcript Card */}
                        <Card>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary-400" />
                                Transcript
                            </h3>
                            <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5 text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
                                "{analysis.transcript}"
                            </div>
                            <div className="mt-2 text-xs text-slate-500 flex justify-end">
                                Duration: {analysis.duration}s • {analysis.wpm} WPM
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                AI Feedback
                            </h3>
                            <div className="space-y-4">
                                {analysis.feedback.map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="w-1 h-full rounded-full bg-blue-500" />
                                        <div>
                                            <p className="text-slate-300 text-sm">{item}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Charts */}
                    <div className="space-y-8">
                        <Card>
                            <h3 className="text-lg font-bold mb-4">Filler Word Analysis</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analysis.fillerWords} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="word" type="category" stroke="#94a3b8" width={60} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                        />
                                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20}>
                                            {analysis.fillerWords && analysis.fillerWords.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#a78bfa'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-300 text-sm text-center">
                                    Detected <strong>{analysis.fillerWords ? analysis.fillerWords.reduce((acc, curr) => acc + curr.count, 0) : 0}</strong> filler words.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
