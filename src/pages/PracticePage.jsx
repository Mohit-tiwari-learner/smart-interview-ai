import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Square, ChevronDown, RefreshCw, Video, VideoOff, Volume2, AlertCircle, Loader2, Sparkles, StopCircle, Crown, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import UpgradeModal from '../components/ui/UpgradeModal';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';
import { analysisService } from '../services/analysisService';
import { ROUTES } from '../routes';
import OnboardingModal from '../components/auth/OnboardingModal';
import { INTERVIEW_QUESTIONS } from '../data/questions';

const PracticePage = () => {
    const navigate = useNavigate();
    const { user, saveSession, sessions } = useAuth();

    // --- STATE MANAGEMENT ---
    const [interviewMode, setInterviewMode] = useState("HR");
    const [currentQuestion, setCurrentQuestion] = useState("Tell me about yourself.");
    const [difficulty, setDifficulty] = useState("Medium");
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Modals
    const [showOnboarding, setShowOnboarding] = useState(false); // Default OFF to prevent blocking
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [lockedFeature, setLockedFeature] = useState("");

    // Refs
    const webcamRef = useRef(null);
    const hrVideoRef = useRef(null);
    const recognitionRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const timerIntervalRef = useRef(null);

    // --- HELPERS ---
    const getQuestionsForMode = (mode) => {
        let part = mode === "Technical" ? "TECHNICAL" :
            mode === "Stress" ? "STRESS" :
                mode === "Managerial" ? "BEHAVIORAL" : "HR";

        let questions = INTERVIEW_QUESTIONS.filter(q => q.part === part || q.part === mode.toUpperCase());
        if (mode === "Managerial") {
            questions = [...questions, ...INTERVIEW_QUESTIONS.filter(q => q.part === "SCENARIO")];
        }
        return questions.length > 0 ? questions.map(q => q.question) : ["Tell me about yourself."];
    };

    const availableQuestions = getQuestionsForMode(interviewMode);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // --- EFFECTS ---

    // 1. Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + finalTranscript);
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Speech Recognition not supported in this browser.");
        }
    }, []);

    // 2. Camera Logic
    useEffect(() => {
        let stream = null;

        if (!isVideoOn) {
            if (webcamRef.current && webcamRef.current.srcObject) {
                const tracks = webcamRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                webcamRef.current.srcObject = null;
            }
            return;
        }

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (webcamRef.current) {
                    webcamRef.current.srcObject = stream;
                }
                setPermissionDenied(false);
            } catch (err) {
                console.error("Camera Error:", err);
                setPermissionDenied(true);
            }
        };

        startCamera();

        return () => {
            // Robust cleanup: stop tracks on the stream directly
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (webcamRef.current && webcamRef.current.srcObject) {
                const tracks = webcamRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [isVideoOn]);

    // 3. Question Update on Mode Change
    useEffect(() => {
        const qs = getQuestionsForMode(interviewMode);
        if (qs.length > 0) setCurrentQuestion(qs[0]);
    }, [interviewMode]);

    // --- ACTIONS ---

    const handleModeChange = (mode) => {
        if (!user.isPro && (mode === "Stress" || mode === "Managerial")) {
            setLockedFeature(`${mode} Interview Mode`);
            setShowUpgradeModal(true);
            return;
        }
        setInterviewMode(mode);
    };

    const speakQuestion = (text) => {
        if ('speechSynthesis' in window) {
            setIsSpeaking(true);

            // Sync Video - Play
            if (hrVideoRef.current) {
                hrVideoRef.current.currentTime = 0;
                hrVideoRef.current.play().catch(err => console.error("Video play error:", err));
            }

            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);

            // Try to set a female voice
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v =>
                v.name.includes('Female') ||
                v.name.includes('Zira') ||
                v.name.includes('Google US English') ||
                v.name.includes('Samantha')
            );
            if (femaleVoice) utterance.voice = femaleVoice;

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.onend = () => {
                setIsSpeaking(false);
                // Sync Video - Pause
                if (hrVideoRef.current) {
                    hrVideoRef.current.pause();
                    hrVideoRef.current.currentTime = 0;
                }
            };
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleStartRecording = () => {
        setCountdown(3);
        let count = 3;
        const countInterval = setInterval(() => {
            count--;
            setCountdown(count);
            if (count === 0) {
                clearInterval(countInterval);
                setCountdown(null);
                startActualRecording();
            }
        }, 1000);
    };

    const startActualRecording = () => {
        setIsRecording(true);
        setTimer(0);
        setTranscript("");

        // Start Timer
        timerIntervalRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);

        // Start Speech Gen
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.log("Recognition already started");
            }
        }
    };

    const handleFinish = async () => {
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (recognitionRef.current) recognitionRef.current.stop();

        setAnalyzing(true);

        // Use service to analyze
        const sessData = {
            question: currentQuestion,
            transcript: transcript || "No speech detected.", // Fallback
            duration: timer,
            mode: interviewMode,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

        try {
            const analysis = await analysisService.analyzeTranscript(sessData.transcript, currentQuestion, timer);
            const finalSession = { ...sessData, analysis, score: analysis.overallScore };

            saveSession(finalSession);
            navigate(ROUTES.FEEDBACK);
        } catch (error) {
            console.error("Analysis failed", error);
            setAnalyzing(false);
            // Fallback save
            saveSession({ ...sessData, analysis: null, score: 0 });
            navigate(ROUTES.FEEDBACK);
        }
    };

    const handleGenerateQuestion = async () => {
        setIsGenerating(true);
        // Simulate delay or fetch AI
        setTimeout(() => {
            const qs = getQuestionsForMode(interviewMode);
            const randomQ = qs[Math.floor(Math.random() * qs.length)];
            setCurrentQuestion(randomQ);
            speakQuestion(randomQ);
            setIsGenerating(false);
        }, 800);
    };

    const handleAnswerSuggestion = (suggestion) => {
        if (!user.isPro) {
            setLockedFeature("AI Smart Suggestions");
            setShowUpgradeModal(true);
            return;
        }
        // Logic to show suggestion (could be a toast or modal)
        console.log("Using suggestion:", suggestion);
    };


    // --- RENDER ---
    return (
        <div className="min-h-screen pt-24 pb-6 px-4 max-w-[1920px] mx-auto flex flex-col gap-4 font-sans bg-slate-900 z-0 relative">

            {/* Header / Mode Selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        AI Mock Interview
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-500/20 text-primary-300 border border-primary-500/30">
                            {interviewMode} Mode
                        </span>
                        {user?.isPro && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1">
                                <Crown className="w-3 h-3" /> PRO
                            </span>
                        )}
                        <span className="text-xs text-slate-500 ml-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex bg-slate-900 border border-white/10 rounded-lg p-1">
                        {["HR", "Technical", "Behavioral", "Stress"].map((m) => (
                            <button
                                key={m}
                                onClick={() => handleModeChange(m)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                    interviewMode === m ? "bg-primary-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Progress</span>
                        <div className="text-xs font-bold text-white">Question {(sessions?.length || 0) % 5 + 1} <span className="text-slate-500">/ 5</span></div>
                    </div>
                    {/* Progress Ring */}
                    <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
                        <svg className="w-full h-full transform -rotate-90 absolute">
                            <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-800" />
                            <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={100} strokeDashoffset={100 - (((sessions?.length || 0) % 5 + 1) / 5) * 100} className="text-primary-500" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[500px]">

                {/* LEFT PANEL: INTERVIEWER (25%) */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                    <Card className="flex flex-col p-4 bg-slate-900/80 border-white/10 shadow-xl overflow-hidden relative h-auto">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Interviewer</span>
                            </div>
                            <button onClick={() => speakQuestion(currentQuestion)} className="text-slate-400 hover:text-white"><Volume2 className="w-4 h-4" /></button>
                        </div>

                        {/* HR Video Info */}
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black shadow-inner border border-white/5 mb-4 group ring-1 ring-white/5">
                            <video
                                ref={hrVideoRef}
                                src="/hr video.mp4"
                                className={`w-full h-full object-cover transition-opacity duration-500 ${isSpeaking ? 'opacity-100' : 'opacity-80 grayscale'}`}
                                muted
                                playsInline
                                loop
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <h2 className="text-lg font-medium text-white leading-snug mb-2">{currentQuestion}</h2>
                            <div className="relative">
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-[10px] text-slate-500 hover:text-primary-400 flex items-center gap-1 uppercase font-bold tracking-wider">
                                    Change Question <ChevronDown className="w-3 h-3" />
                                </button>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto">
                                            {availableQuestions.map((q, i) => (
                                                <button key={i} onClick={() => { setCurrentQuestion(q); setIsDropdownOpen(false); }} className="w-full text-left p-2 text-xs hover:bg-white/5 border-b border-white/5 text-slate-300">
                                                    {q}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </Card>

                    <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} featureName={lockedFeature} />
                </div>

                {/* CENTER PANEL: CANDIDATE (50%) */}
                <div className="lg:col-span-6 flex flex-col h-full relative">
                    <div className="flex-1 relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl ring-1 ring-white/5 flex flex-col">
                        {/* Status Overlay */}
                        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between">
                            <span className="px-2 py-1 rounded bg-black/40 text-[10px] font-mono text-slate-300 border border-white/5">{isVideoOn ? "REC: ON" : "REC: OFF"}</span>
                        </div>

                        {/* Video Feed */}
                        <div className="flex-1 relative flex items-center justify-center bg-slate-900">
                            {isVideoOn && !permissionDenied ? (
                                <video autoPlay muted playsInline ref={webcamRef} className="w-full h-full object-cover transform scale-x-[-1]" />
                            ) : (
                                <div className="flex flex-col items-center text-slate-600"><VideoOff className="w-12 h-12 mb-2" />Camera Off</div>
                            )}

                            {/* Overlay Elements */}
                            <AnimatePresence>
                                {countdown && <motion.div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"><span className="text-9xl font-bold text-white">{countdown}</span></motion.div>}
                                {analyzing && <motion.div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"><Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" /><h3 className="text-xl font-bold text-white">Analyzing...</h3></motion.div>}
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center z-20 pointer-events-none">
                            <div className="flex items-center gap-6 pointer-events-auto bg-black/60 backdrop-blur-xl p-3 rounded-full border border-white/10 shadow-2xl">
                                <button onClick={() => setIsVideoOn(!isVideoOn)} className="p-3 rounded-full hover:bg-white/10 text-slate-300">{isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}</button>

                                {!isRecording ? (
                                    <button onClick={handleStartRecording} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-all hover:scale-105 group"><div className="w-6 h-6 bg-white rounded-sm group-hover:rounded" /></button>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => { setIsRecording(false); setTimer(0); }} className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white"><RefreshCw className="w-5 h-5" /></button>
                                        <div className="flex flex-col items-center w-20"><span className="text-xs font-mono text-red-400 animate-pulse">REC</span><span className="text-white font-bold font-mono">{formatTime(timer)}</span></div>
                                        <button onClick={handleFinish} className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center text-white"><Square className="w-5 h-5 fill-current" /></button>
                                    </div>
                                )}

                                <button onClick={handleGenerateQuestion} disabled={isRecording} className="p-3 rounded-full hover:bg-white/10 text-slate-300 disabled:opacity-30">{isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: INSIGHTS (25%) */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                    <Card className="flex flex-col p-4 bg-slate-900/50 border-white/5 h-full">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-primary-500" /> Live transcript
                        </h3>
                        <div className="flex-1 bg-black/20 rounded-lg p-3 text-sm text-slate-400 overflow-y-auto font-mono leading-relaxed border border-white/5">
                            {transcript || <span className="text-slate-600 italic">Listening...</span>}
                        </div>
                    </Card>
                </div>

            </div>

            <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
        </div>
    );
};

export default PracticePage;
