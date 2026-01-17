import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Share2, ArrowRight, CheckCircle, AlertTriangle, FileText, Sparkles, RefreshCw } from 'lucide-react';
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

    // Rewrite Logic
    const [rewrittenAnswer, setRewrittenAnswer] = useState(null);
    const [loadingRewrite, setLoadingRewrite] = useState(false);

    const handleRewrite = async () => {
        if (!analysis?.transcript) return;
        setLoadingRewrite(true);
        try {
            const result = await analysisService.rewriteAnswer(analysis.transcript);
            setRewrittenAnswer(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingRewrite(false);
        }
    };

    useEffect(() => {
        if (!currentSession) {
            navigate('/practice');
            return;
        }

        const fetchAnalysis = async () => {
            setLoading(true);
            try {
                // Check if analysis already exists in the session to avoid re-generating (and potentially getting different mock results)
                if (currentSession.analysis) {
                    setAnalysis({
                        ...currentSession.analysis,
                        transcript: currentSession.transcript,
                        duration: currentSession.duration,
                        wpm: currentSession.analysis.wpm || Math.round((currentSession.transcript.split(' ').length / currentSession.duration) * 60) || 0
                    });
                    setLoading(false);
                    return;
                }

                // Use the shared service if no analysis exists
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

                {/* ANSWER SUMMARY HERO SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">

                    {/* LEFT: MAIN SCORE CARD */}
                    <Card className="md:col-span-4 bg-gradient-to-br from-slate-900 to-slate-950 border-primary-500/30 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-purple-500" />
                        <div className="flex flex-col items-center justify-center p-8 h-full">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Overall Score</h2>
                            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                                <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={439.8} strokeDashoffset={439.8 * (1 - (analysis.overallScore / 100))} strokeLinecap="round" className="text-primary-500" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-bold text-white tracking-tighter">{analysis.overallScore}</span>
                                    <span className="text-sm text-slate-500 font-medium">/ 100</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full text-center mt-2 border-t border-white/5 pt-4">
                                <div><div className="text-xl font-bold text-green-400">{analysis.confidence}%</div><div className="text-[10px] uppercase text-slate-500 font-bold">Conf</div></div>
                                <div><div className="text-xl font-bold text-yellow-400">{analysis.clarity}%</div><div className="text-[10px] uppercase text-slate-500 font-bold">Clar</div></div>
                                <div><div className="text-xl font-bold text-blue-400">{analysis.relevance}%</div><div className="text-[10px] uppercase text-slate-500 font-bold">Rel</div></div>
                            </div>
                        </div>
                    </Card>

                    {/* RIGHT: KEY INSIGHTS (Strengths & Weaknesses) */}
                    <div className="md:col-span-8 flex flex-col gap-4 h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            {/* STRENGTHS */}
                            <Card className="bg-slate-900/50 border-l-4 border-l-emerald-500 p-5 flex flex-col">
                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" /> What you did well
                                </h3>
                                <ul className="space-y-3 flex-1">
                                    {(analysis.strengths || []).slice(0, 3).map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-300 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                    {(!analysis.strengths || analysis.strengths.length === 0) && (
                                        <li className="text-slate-500 italic text-sm">No specific strengths detected.</li>
                                    )}
                                </ul>
                            </Card>

                            {/* IMPROVEMENTS */}
                            <Card className="bg-slate-900/50 border-l-4 border-l-amber-500 p-5 flex flex-col">
                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Areas to Improve
                                </h3>
                                <ul className="space-y-3 flex-1">
                                    {(analysis.improvements || []).slice(0, 3).map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-300 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                    {(!analysis.improvements || analysis.improvements.length === 0) && (
                                        <li className="text-slate-500 italic text-sm">Great job! No major issues found.</li>
                                    )}
                                </ul>
                            </Card>
                        </div>

                        {/* ACTION BAR */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleRewrite}
                                disabled={loadingRewrite}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-white/10"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loadingRewrite ? 'animate-spin' : ''}`} />
                                {rewrittenAnswer ? 'Regenerate Polish' : 'Improve My Answer (AI)'}
                            </Button>
                            <Button
                                onClick={() => navigate(ROUTES.PRACTICE)}
                                className="flex-1 bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                            >
                                Next Question <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Detailed Feedback */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Transcript Card (Collapsed/Secondary now) */}
                        <Card>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary-400" />
                                Full Transcript
                            </h3>
                            <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5 text-slate-300 leading-relaxed max-h-40 overflow-y-auto">
                                {(() => {
                                    if (!analysis.fillerWords || analysis.fillerWords.length === 0) return analysis.transcript;
                                    const pattern = new RegExp(`\\b(${analysis.fillerWords.map(f => f.word).join('|')})\\b`, 'gi');
                                    const parts = analysis.transcript.split(pattern);
                                    return parts.map((part, i) => {
                                        if (analysis.fillerWords.some(f => f.word.toLowerCase() === part.toLowerCase())) {
                                            return <span key={i} className="text-red-400 bg-red-500/10 px-1 rounded decoration-wavy underline decoration-red-500/30" title="Filler Word">{part}</span>;
                                        }
                                        return part;
                                    });
                                })()}
                            </div>
                            {/* Rewritten Answer Result Area */}
                            {rewrittenAnswer && (
                                <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-green-900/20 to-slate-900 border border-green-500/20 animate-in fade-in slide-in-from-top-2">
                                    <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        AI Refined Version
                                    </h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        "{rewrittenAnswer}"
                                    </p>
                                </div>
                            )}
                        </Card>

                        {/* Sentiment (Keep chart but maybe smaller) */}
                        <Card className="bg-slate-900/50 border-white/5 p-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                                <CheckCircle className="w-4 h-4" /> Sentiment Analysis
                            </h3>
                            <div className="flex h-4 w-full rounded-full overflow-hidden mb-2">
                                <div style={{ width: `${analysis.sentiment?.positive || 33}%` }} className="bg-emerald-500 h-full" title="Positive" />
                                <div style={{ width: `${analysis.sentiment?.neutral || 33}%` }} className="bg-slate-500 h-full" title="Neutral" />
                                <div style={{ width: `${analysis.sentiment?.negative || 33}%` }} className="bg-red-500 h-full" title="Negative" />
                            </div>
                        </Card>
                    </div>

                    {/* Suggested Next Topic */}
                    {analysis.suggestedNextTopic && (
                        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-white/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Recommended Next Step</h3>
                                    <p className="text-xl font-bold text-white flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-primary-400" />
                                        {analysis.suggestedNextTopic}
                                    </p>
                                </div>
                                <Button onClick={() => navigate(ROUTES.PRACTICE)}>
                                    Practice This Topic
                                </Button>
                            </div>
                        </Card>
                    )}
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

    );
};

export default FeedbackPage;
