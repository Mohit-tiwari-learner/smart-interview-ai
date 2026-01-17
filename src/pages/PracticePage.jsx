import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Square, ChevronDown, RefreshCw, Video, VideoOff, Volume2, AlertCircle, Loader2, Sparkles, StopCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import UpgradeModal from '../components/ui/UpgradeModal'; // Imported
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';
import { analysisService } from '../services/analysisService';
import { ROUTES } from '../routes';
import OnboardingModal from '../components/auth/OnboardingModal';
import { INTERVIEW_QUESTIONS } from '../data/questions';

const PracticePage = () => {
    const navigate = useNavigate();
    const { saveSession } = useAuth();

    // Filter questions based on current mode
    const getQuestionsForMode = (mode) => {
        // Map mode to data "part"
        let part = "HR";
        if (mode === "Technical") part = "TECHNICAL";
        if (mode === "Managerial") part = "BEHAVIORAL"; // Mapping Managerial to Behavioral/Scenario as appropriate
        if (mode === "Stress") part = "STRESS";

        let questions = INTERVIEW_QUESTIONS.filter(q => q.part === part || q.part === mode.toUpperCase());

        // If mode is Managerial, we can also include Scenario
        if (mode === "Managerial") {
            questions = [...questions, ...INTERVIEW_QUESTIONS.filter(q => q.part === "SCENARIO")];
        }

        // Fallback to HR if empty (shouldn't happen with this bank)
        return questions.length > 0 ? questions.map(q => q.question) : INTERVIEW_QUESTIONS.slice(0, 5).map(q => q.question);
    };

    const [interviewMode, setInterviewMode] = useState("HR");

    // Derived state for dropdown options
    const availableQuestions = getQuestionsForMode(interviewMode);

    const [currentQuestion, setCurrentQuestion] = useState(availableQuestions[0] || "Tell me about yourself.");
    const [difficulty, setDifficulty] = useState("Medium");
    const [targetCompany, setTargetCompany] = useState("General");
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);

    // Feature Locking
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [lockedFeature, setLockedFeature] = useState("");

    // New States for UX Improvements
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const { user, sessions } = useAuth();
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Update current question pool when mode changes (optional, or just keep current unless user changes)
    useEffect(() => {
        // When mode changes, we might want to refresh the available questions list logic, 
        // but we typically don't forcibly change the *current* question unless the user clicks "New Question"
        // However, if the mode switches from HR to Technical, the current HR question might be weird.
        // Let's reset to the first question of the new mode.
        const newPool = getQuestionsForMode(interviewMode);
        if (newPool.length > 0) {
            setCurrentQuestion(newPool[0]);
        }
    }, [interviewMode]);

    useEffect(() => {
        if (user && (!user.role || !user.experience)) {
            setShowOnboarding(true);
        }
    }, [user]);

    // ... (Camera States, AI & TTS States, Recording Refs remain same)
    const [cameraStream, setCameraStream] = useState(null);
    const [cameraError, setCameraError] = useState(false);

    const [isGenerating, setIsGenerating] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);

    // ... (Initialize Speech Recognition, etc., unchanged until handleGenerateQuestion)
    // We strictly preserve existing effects for speech, camera, timer.

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // ... existing implementation ...
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setTranscript(prev => prev + ' ' + event.results[i][0].transcript);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recognitionInstance.onerror = (event) => {
                console.error("Speech recognition error", event.error);
            };

            recognitionRef.current = recognitionInstance;
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }, []);

    // ... (Timer, Countdown, Camera effects - skipped for brevity in replace block, assuming they are preserved if I use StartLine/EndLine carefully)
    // Wait, I need to match the file accurately. The StartLine is 4 (imports).
    // I will replace up to the function body start to inject the new logic.

    const handleGenerateQuestion = async () => {
        setIsGenerating(true);
        try {
            // ... existing logic ...
            const question = await analysisService.generateInterviewQuestion(
                interviewMode,
                user?.role || "Software Engineer",
                user?.experience || "Fresher",
                difficulty,
                targetCompany,
                user?.bio
            );
            setCurrentQuestion(question);
        } catch (error) {
            console.error("Failed to generate question:", error);
            // Fallback to local bank if AI fails
            const newPool = getQuestionsForMode(interviewMode);
            const randomQ = newPool[Math.floor(Math.random() * newPool.length)];
            setCurrentQuestion(randomQ);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleStartRecording = async () => {
        // Stop speaking if user starts recording
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }

        playSound('start'); // Play Start Sound

        setPermissionDenied(false);
        try {
            // Check for permissions first
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Initialize MediaRecorder here
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = []; // Reset chunks

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            // Start countdown
            setCountdown(3);
        } catch (err) {
            console.error("Microphone permission denied:", err);
            setPermissionDenied(true);
        }
    };

    const hrVideoRef = useRef(null);

    // Sound Effects Helper
    const playSound = (type) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'start') {
            // Soft "Ding"
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } else if (type === 'stop') {
            // Soft "Boop"
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    };

    // Sync HR Video with TTS
    useEffect(() => {
        if (hrVideoRef.current) {
            if (isSpeaking) {
                hrVideoRef.current.play().catch(e => console.error("Video play failed:", e));
            } else {
                hrVideoRef.current.pause();
                hrVideoRef.current.currentTime = 0;
            }
        }
    }, [isSpeaking]);

    const handleFinish = async () => {
        playSound('stop'); // Play Stop Sound
        setIsRecording(false);
        setAnalyzing(true);

        // Stop HR Video if playing (should be handled by isSpeaking, but double check)
        if (hrVideoRef.current) hrVideoRef.current.pause();

        // Stop Speech Recognition
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        const finalTranscript = transcript.trim();
        const sessionData = {
            question: currentQuestion,
            transcript: finalTranscript,
            duration: timer,
            audioBlob: null
        };

        // Stop Media Recorder & Save
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                sessionData.audioBlob = audioBlob;

                // Perform AI analysis
                try {
                    const analysis = await analysisService.analyzeTranscript(finalTranscript, currentQuestion, timer);
                    sessionData.analysis = analysis;

                    // Calculate score based on analysis
                    const score = analysis.overallScore;
                    sessionData.score = score;

                    try {
                        saveSession(sessionData);
                        setAnalyzing(false);
                        navigate(ROUTES.FEEDBACK);
                    } catch (saveError) {
                        console.error("Session save failed:", saveError);
                        setAnalyzing(false);
                        alert(saveError.message); // Simple alert for now
                    }
                } catch (error) {
                    console.error('Analysis failed:', error);
                    // Save session without analysis
                    try {
                        saveSession(sessionData);
                        setAnalyzing(false);
                        navigate(ROUTES.FEEDBACK);
                    } catch (saveError) {
                        console.error("Session save failed:", saveError);
                        setAnalyzing(false);
                        alert(saveError.message);
                    }
                }
            };
        } else {
            // Fallback if no audio recorded (e.g., immediate stop)
            try {
                const analysis = await analysisService.analyzeTranscript(finalTranscript, currentQuestion, timer);
                sessionData.analysis = analysis;
                sessionData.score = analysis.overallScore;

                saveSession(sessionData);
                setAnalyzing(false);
                navigate(ROUTES.FEEDBACK);
            } catch (error) {
                console.error('Analysis failed:', error);
                saveSession(sessionData);
                setAnalyzing(false);
                navigate(ROUTES.FEEDBACK);
            }
        }
    };

    // Calculate Live Stats
    const wordCount = transcript.trim().split(/\s+/).length;
    const currentWPM = timer > 0 ? Math.round((wordCount / timer) * 60) : 0;

    return (
        <div className="min-h-screen pt-20 pb-6 px-4 max-w-[1920px] mx-auto flex flex-col gap-4 font-sans bg-slate-950">

            {/* CONTEXT BAR (Second Row) */}
            <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Mode</span>
                        <div className="flex items-center gap-2">
                            <div className="flex bg-slate-800/50 rounded-lg p-0.5 border border-white/5">
                                {["HR", "Technical", "Managerial", "Stress"].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setInterviewMode(mode)}
                                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md transition-all ${interviewMode === mode
                                            ? 'bg-primary-500 text-white shadow-sm'
                                            : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-white/5" />

                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Difficulty</span>
                        <div className="flex bg-slate-800/50 rounded-lg p-0.5 border border-white/5">
                            {["Easy", "Medium", "Hard"].map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => setDifficulty(diff)}
                                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md transition-all ${difficulty === diff
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                        : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Progress</span>
                        <div className="text-xs font-bold text-white">Question {(sessions.length % 5) + 1} <span className="text-slate-500">/ 5</span></div>
                    </div>
                    {/* Progress Ring or Bar */}
                    <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
                        <svg className="w-full h-full transform -rotate-90 absolute">
                            <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-800" />
                            <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={100} strokeDashoffset={100 - (((sessions.length % 5) + 1) / 5) * 100} className="text-primary-500" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[500px]">

                {/* LEFT PANEL: INTERVIEWER (25%) */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                    <Card className="flex flex-col p-4 bg-slate-900/80 border-white/10 shadow-xl overflow-hidden relative h-auto">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Interviewer</span>
                            </div>
                            <button
                                onClick={() => speakQuestion(currentQuestion)}
                                className="text-slate-400 hover:text-white transition-colors"
                                title="Replay"
                            >
                                <Volume2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* HR Video */}
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black shadow-inner border border-white/5 mb-4 group ring-1 ring-white/5">
                            <video
                                ref={hrVideoRef}
                                src="/hr video.mp4"
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                muted
                                playsInline
                                loop
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <h2 className="text-lg font-medium text-white leading-snug mb-2">
                                {currentQuestion}
                            </h2>
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="text-[10px] text-slate-500 hover:text-primary-400 flex items-center gap-1 transition-colors uppercase font-bold tracking-wider"
                                >
                                    Change Question <ChevronDown className="w-3 h-3" />
                                </button>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden max-h-40 overflow-y-auto"
                                        >
                                            {availableQuestions.map((q, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setCurrentQuestion(q);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="w-full text-left p-2 text-xs hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-slate-300 hover:text-white"
                                                >
                                                    {q}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </Card>

                    <UpgradeModal
                        isOpen={showUpgradeModal}
                        onClose={() => setShowUpgradeModal(false)}
                        featureName={lockedFeature}
                    />
                </div>

                {/* CENTER PANEL: CANDIDATE ZONE (50%) */}
                <div className="lg:col-span-6 flex flex-col h-full relative">
                    {/* Main Webcam Card */}
                    <div className="flex-1 relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl ring-1 ring-white/5 flex flex-col">

                        {/* Header Overlay */}
                        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start pointer-events-none">
                            <div className="flex gap-2 pointer-events-auto">
                                <span className="px-2 py-1 rounded bg-black/40 backdrop-blur text-[10px] font-mono text-slate-300 border border-white/5">
                                    {isVideoOn ? "REC: ON" : "REC: OFF"}
                                </span>
                            </div>
                            {user.isPro && isRecording && (
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Confidence</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className={`w-1 h-2 rounded-sm ${i < 3 ? 'bg-green-500' : 'bg-slate-700'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Feed */}
                        <div className="flex-1 relative flex items-center justify-center bg-slate-900">
                            {isVideoOn && !cameraError ? (
                                <video
                                    autoPlay
                                    muted
                                    playsInline
                                    ref={(video) => {
                                        if (video && cameraStream) {
                                            video.srcObject = cameraStream;
                                        }
                                    }}
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-slate-600">
                                    <VideoOff className="w-12 h-12 mb-2 opacity-30" />
                                    <p className="text-sm">Camera Off</p>
                                </div>
                            )}

                            {/* Countdown Overlay */}
                            <AnimatePresence>
                                {countdown !== null && countdown > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.5 }}
                                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                                    >
                                        <span className="text-9xl font-bold text-white drop-shadow-2xl">{countdown}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Analyzing Overlay */}
                            <AnimatePresence>
                                {analyzing && (
                                    <motion.div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
                                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                                        <h3 className="text-xl font-bold text-white">Analyzing...</h3>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* CONTROLS OVERLAY (Bottom of Video) */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center z-20 pointer-events-none">
                            <div className="flex items-center gap-6 pointer-events-auto bg-black/60 backdrop-blur-xl p-3 rounded-full border border-white/10 shadow-2xl">

                                {/* Camera Toggle */}
                                <button
                                    onClick={() => setIsVideoOn(!isVideoOn)}
                                    className="p-3 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
                                    title="Toggle Camera"
                                >
                                    {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                                </button>

                                {/* Main Action Button */}
                                {!isRecording ? (
                                    <button
                                        onClick={handleStartRecording}
                                        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 flex items-center justify-center transition-all hover:scale-105 group"
                                    >
                                        <div className="w-6 h-6 bg-white rounded-sm group-hover:rounded transition-all" />
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => {
                                                setIsRecording(false);
                                                setTimer(0);
                                                if (recognitionRef.current) recognitionRef.current.stop();
                                                if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
                                            }}
                                            className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-all"
                                            title="Cancel"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                        </button>

                                        <div className="flex flex-col items-center justify-center w-20">
                                            <span className="text-xs font-mono text-red-400 animate-pulse">REC</span>
                                            <span className="text-white font-bold font-mono">{formatTime(timer)}</span>
                                        </div>

                                        <button
                                            onClick={handleFinish}
                                            className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center text-white transition-all shadow-lg shadow-green-600/30"
                                            title="Done"
                                        >
                                            <Square className="w-5 h-5 fill-current" />
                                        </button>
                                    </div>
                                )}

                                {/* Next Question (Skip) */}
                                <button
                                    onClick={handleGenerateQuestion}
                                    disabled={isRecording}
                                    className="p-3 rounded-full hover:bg-white/10 text-slate-300 transition-colors disabled:opacity-30"
                                    title="Skip / New Question"
                                >
                                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: INSIGHTS (25%) */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                    {/* Insights Card */}
                    <Card className="flex flex-col p-4 bg-slate-900/50 border-white/5 h-1/2">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-primary-500" /> Smart Tips
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3 items-start">
                                <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 shrink-0" />
                                <span className="text-xs text-slate-300 leading-relaxed">Use the <strong className="text-white">STAR method</strong> (Situation, Task, Action, Result) to structure your response.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 shrink-0" />
                                <span className="text-xs text-slate-300 leading-relaxed">Keep eye contact with the camera to simulate a real conversation.</span>
                            </li>
                        </ul>
                    </Card>

                    {/* Live Transcript */}
                    <Card className="flex-1 min-h-0 flex flex-col p-4 bg-slate-900 border-white/5 relative">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                            Live Transcript
                            {isRecording && <span className="text-green-500 animate-pulse">● Listening</span>}
                        </h3>
                        <div className="flex-1 overflow-y-auto no-scrollbar mask-gradient-b">
                            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono opacity-80">
                                {transcript || "Start speaking..."}
                            </p>
                        </div>

                        {/* Live Indicators (Premium-ish) */}
                        <div className="mt-2 pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500">Speed</span>
                                <span className="text-xs font-bold text-white">{currentWPM} WPM</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500">Duration</span>
                                <span className="text-xs font-bold text-white">{formatTime(timer)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
            <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
        </div>
    );
};

export default PracticePage;
