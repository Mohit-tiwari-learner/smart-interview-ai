import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Calendar, TrendingUp, Award, Clock, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const ProgressPage = () => {
    const navigate = useNavigate();
    const { sessions } = useAuth();

    // Helper to calculate score (duplicated logic from FeedbackPage for now)
    const calculateSessionMetrics = (session) => {
        const { transcript, duration } = session;
        const words = transcript.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const minutes = duration / 60;
        const wpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;

        const fillerRegex = /\b(um|uh|like|basically|actually|literally)\b/gi;
        const fillerCount = (transcript.match(fillerRegex) || []).length;

        let confidence = 100 - (fillerCount * 5);
        if (wpm < 100) confidence -= (100 - wpm) * 0.5;
        if (wpm > 160) confidence -= (wpm - 160) * 0.5;
        confidence = Math.max(0, Math.min(100, Math.round(confidence)));

        const avgWordLen = words.reduce((acc, w) => acc + w.length, 0) / (wordCount || 1);
        const clarity = Math.min(100, Math.round(avgWordLen * 15));
        const relevance = 85;

        const totalScore = Math.round((confidence + clarity + relevance) / 3);

        return {
            ...session,
            score: totalScore,
            wpm,
            fillerCount
        };
    };

    const enhancedSessions = useMemo(() => {
        return sessions.map(calculateSessionMetrics).sort((a, b) => b.timestamp - a.timestamp);
    }, [sessions]);

    const stats = useMemo(() => {
        if (enhancedSessions.length === 0) return null;

        const totalScore = enhancedSessions.reduce((acc, s) => acc + s.score, 0);
        const avgScore = Math.round(totalScore / enhancedSessions.length);
        const bestScore = Math.max(...enhancedSessions.map(s => s.score));
        const totalDuration = enhancedSessions.reduce((acc, s) => acc + s.duration, 0);

        // Simple mock streak (checks if previous session was < 24 hours ago)
        // For real streak, we'd need complex date logic. For now, just session count.
        const practiceCount = enhancedSessions.length;

        return [
            { title: "Total Sessions", value: practiceCount, icon: Calendar, color: "text-orange-400", bg: "bg-orange-500/10" },
            { title: "Avg. Score", value: `${avgScore}%`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
            { title: "Best Session", value: `${bestScore}%`, icon: Award, color: "text-purple-400", bg: "bg-purple-500/10" },
            { title: "Practice Time", value: `${Math.round(totalDuration / 60)} m`, icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
        ];
    }, [enhancedSessions]);

    // Chart Data (Reverse chronological for chart: Oldest -> Newest)
    const chartData = useMemo(() => {
        return [...enhancedSessions].reverse().map(s => ({
            date: s.date, // e.g. "Jan 14"
            score: s.score
        }));
    }, [enhancedSessions]);

    if (!stats) {
        return (
            <div className="min-h-screen pt-28 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center pt-20">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-slate-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">No Practice Sessions Yet</h1>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        Your progress tracking will start as soon as you complete your first interview practice session.
                    </p>
                    <Button onClick={() => navigate('/practice')}>
                        <Plus className="w-4 h-4 mr-2" /> Start First Session
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-12 px-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
                        <p className="text-slate-400">Track your interview improvement over time.</p>
                    </div>
                    <Button onClick={() => navigate('/practice')}>Start New Session</Button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <Card key={i} className="flex flex-col items-center justify-center p-6 text-center hover:bg-white/5 transition-colors">
                            <div className={`p-3 rounded-full mb-3 ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-3xl font-bold mb-1">{stat.value}</span>
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.title}</span>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2">
                        <Card className="h-full min-h-[400px]">
                            <h3 className="text-lg font-bold mb-6">Performance Trend</h3>
                            <div className="h-80 w-full">
                                {chartData.length > 1 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#475569"
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                stroke="#475569"
                                                tickLine={false}
                                                axisLine={false}
                                                domain={[0, 100]}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#8b5cf6"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorScore)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-500">
                                        Not enough data for trend analysis yet. Practice more!
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Recent Sessions */}
                    <div className="lg:col-span-1">
                        <Card className="h-full">
                            <h3 className="text-lg font-bold mb-6">Recent Sessions</h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {enhancedSessions.slice(0, 5).map((session) => (
                                    <div key={session.id} onClick={() => {
                                        // TODO: In future, open detailed view for this old session
                                        // For now, no action or maybe toast
                                    }} className="p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-primary-500/30 transition-colors cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-sm line-clamp-1 text-slate-200">
                                                {session.question}
                                            </h4>
                                            <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${session.score >= 80 ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>
                                                {session.score}%
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-slate-500">
                                            <span>{session.date} • {session.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressPage;
