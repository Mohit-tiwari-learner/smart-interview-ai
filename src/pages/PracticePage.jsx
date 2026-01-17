import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Square, ChevronDown, RefreshCw, Video, VideoOff, Volume2, AlertCircle, Loader2, Sparkles, StopCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';
import { analysisService } from '../services/analysisService';
import { ROUTES } from '../routes';

const QUESTIONS = [
    "Tell me about yourself.",
    "What is your greatest strength?",
    "Describe a challenging situation you faced and how you handled it.",
    "Where do you see yourself in five years?",
    "Why do you want to work for this company?"
];

const PracticePage = () => {
    const navigate = useNavigate();
    const { saveSession } = useAuth(); // Use Auth Context

    const [currentQuestion, setCurrentQuestion] = useState(QUESTIONS[0]);
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);

    // New States for UX Improvements
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [countdown, setCountdown] = useState(null); // null, 3, 2, 1
    const [analyzing, setAnalyzing] = useState(false);

    // Camera States
    const [cameraStream, setCameraStream] = useState(null);
    const [cameraError, setCameraError] = useState(false);

    // AI & TTS States
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Recording Refs
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
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

    // Timer effect
    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    // Countdown effect
    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            // Start Recording Process
            setIsRecording(true);
            setCountdown(null);
            setTranscript("");

            // Start Speech Recognition
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    console.error("Error starting recognition:", e);
                }
            }

            // Start Media Recorder
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
                mediaRecorderRef.current.start();
            }
        }
    }, [countdown]);

    const streamRef = useRef(null);

    // Camera Handling
    useEffect(() => {
        const enableWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setCameraStream(stream);
                streamRef.current = stream;
                setCameraError(false);
            } catch (err) {
                console.error("Camera permission denied:", err);
                setCameraError(true);
            }
        };

        const disableWebcam = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
                setCameraStream(null);
            }
        };

        if (isVideoOn) {
            enableWebcam();
        } else {
            disableWebcam();
        }

        return () => {
            disableWebcam();
        };
    }, [isVideoOn]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateWPM = (text, seconds) => {
        if (!text || seconds === 0) return 0;
        const words = text.trim().split(/\s+/).length;
        return Math.round((words / seconds) * 60);
    };

    const speakQuestion = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any current speech

            if (isSpeaking) {
                setIsSpeaking(false);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1.1; // Slightly higher pitch for female voice

            // enhanced voice selection
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice =>
                voice.name.includes("Google US English") ||
                voice.name.includes("Zira") ||
                voice.name.includes("Female") ||
                voice.name.includes("Samantha")
            );

            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (e) => {
                console.error("Speech error", e);
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(utterance);
        }
    };

    // Auto-speak question when it changes
    useEffect(() => {
        if (currentQuestion && !isRecording) {
            // Small delay to ensure UI is ready and feels natural
            const timer = setTimeout(() => {
                speakQuestion(currentQuestion);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentQuestion]);

    const handleGenerateQuestion = async () => {
        setIsGenerating(true);
        try {
            const question = await analysisService.generateInterviewQuestion();
            setCurrentQuestion(question);
            // Auto-speak handled by useEffect
        } catch (error) {
            console.error("Failed to generate question:", error);
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

    // Sync HR Video with TTS
    useEffect(() => {
        if (hrVideoRef.current) {
            if (isSpeaking) {
                hrVideoRef.current.play().catch(e => console.error("Video play failed:", e));
            } else {
                hrVideoRef.current.pause();
                hrVideoRef.current.currentTime = 0; // Reset to start or keep paused at frame? 
                // Usually for "talking head" loop, pausing is fine, 
                // but resetting ensures it doesn't look stuck mid-frame if awkward. 
                // Let's try just pause first, or maybe reset if it's a short loop. 
                // Safe bet: pause.
            }
        }
    }, [isSpeaking]);

    const handleFinish = async () => {
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

                    saveSession(sessionData);
                    setAnalyzing(false);
                    navigate(ROUTES.FEEDBACK);
                } catch (error) {
                    console.error('Analysis failed:', error);
                    // Save session without analysis
                    saveSession(sessionData);
                    setAnalyzing(false);
                    navigate(ROUTES.FEEDBACK);
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

    return (
        <div className="min-h-screen pt-28 pb-12 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)]">

                {/* Left Panel - Question & Context */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="flex-1 flex flex-col">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Interview Session</h2>

                        {/* HR Video Display */}
                        <div className="relative mb-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-video">
                            <video
                                ref={hrVideoRef}
                                src="/hr video.mp4"
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                loop // Loop the video so it keeps "talking" if the question is long
                            />
                            {/* Overlay Badge */}
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-medium text-white/80">
                                AI Interviewer
                            </div>
                        </div>

                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Question</h2>

                        <div className="relative mb-6">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full text-left p-4 bg-slate-800/50 rounded-xl border border-white/10 flex items-center justify-between hover:border-primary-500/50 transition-colors"
                            >
                                <span className="font-medium text-lg line-clamp-2 pr-8">{currentQuestion}</span>
                                <div className="flex gap-2 ml-2 shrink-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            speakQuestion(currentQuestion);
                                        }}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-primary-400"
                                        title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
                                    >
                                        {isSpeaking ? <StopCircle className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
                                    </button>
                                    <ChevronDown className={cn("w-5 h-5 transition-transform self-center", isDropdownOpen && "rotate-180")} />
                                </div>
                            </button>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleGenerateQuestion}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors disabled:opacity-50"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    {isGenerating ? "Generating..." : "Ask AI for a different question"}
                                </button>
                            </div>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto"
                                    >
                                        {QUESTIONS.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setCurrentQuestion(q);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-auto">
                            <h3 className="text-sm font-semibold text-slate-400 mb-3">Tips for this question:</h3>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2" />
                                    Structure your answer using the STAR method.
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2" />
                                    Keep your response under 2 minutes.
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2" />
                                    Focus on relevant skills and achievements.
                                </li>
                            </ul>
                        </div>
                    </Card>

                    <Card className="h-48 overflow-y-auto">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Live Transcript</h3>
                        <p className="text-slate-300 italic">
                            {transcript || "Start speaking to see transcript..."}
                        </p>
                    </Card>
                </div>

                {/* Center/Right Panel - Recording Interface */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex-1 bg-slate-900 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
                        {/* Real Webcam Stream */}
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                            {isVideoOn && !cameraError ? (
                                <div className="relative w-full h-full">
                                    <video
                                        autoPlay
                                        muted
                                        playsInline
                                        ref={(video) => {
                                            if (video && cameraStream) {
                                                video.srcObject = cameraStream;
                                            }
                                        }}
                                        className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-slate-600">
                                    {cameraError ? (
                                        <>
                                            <AlertCircle className="w-16 h-16 mb-4 text-red-500/50" />
                                            <p className="text-red-400">Camera Access Denied</p>
                                        </>
                                    ) : (
                                        <>
                                            <VideoOff className="w-16 h-16 mb-4 opacity-50" />
                                            <p>Camera Off</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Countdown Overlay */}
                        <AnimatePresence>
                            {countdown !== null && countdown > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.5 }}
                                    key={countdown}
                                    className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm"
                                >
                                    <span className="text-9xl font-bold text-white">{countdown}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Permission Error Overlay (Mic) */}
                        <AnimatePresence>
                            {permissionDenied && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6"
                                >
                                    <div className="text-center max-w-sm">
                                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle className="w-8 h-8 text-red-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Microphone Access Denied</h3>
                                        <p className="text-slate-400 mb-6">
                                            We need access to your microphone to analyze your speech. Please check your browser settings.
                                        </p>
                                        <Button onClick={() => setPermissionDenied(false)} variant="secondary">
                                            Try Again
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* AI Analysis Overlay */}
                        <AnimatePresence>
                            {analyzing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6"
                                >
                                    <div className="text-center max-w-sm">
                                        <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Response</h3>
                                        <p className="text-slate-400 mb-6">
                                            Our AI is evaluating your speech patterns, content, and delivery to provide personalized feedback.
                                        </p>
                                        <div className="flex justify-center space-x-1">
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Overlay UI */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-2 pointer-events-auto">
                                    <button
                                        onClick={() => setIsVideoOn(!isVideoOn)}
                                        className={cn(
                                            "p-2 rounded-full backdrop-blur-md transition-colors",
                                            isVideoOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500/10 text-red-400 border border-red-500/30"
                                        )}
                                    >
                                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className={cn(
                                    "px-4 py-1.5 rounded-full backdrop-blur-md text-sm font-mono transition-colors",
                                    isRecording ? "bg-red-500/20 text-red-200 border border-red-500/30" : "bg-black/40 text-white border border-white/10"
                                )}>
                                    {isRecording ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            {formatTime(timer)}
                                        </span>
                                    ) : "Ready to Record"}
                                </div>
                            </div>

                            {/* Waveform Visualization (Mock) */}
                            <div className="flex items-end justify-center h-24 gap-1 pb-8">
                                {isRecording && [...Array(40)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [10, Math.random() * 60 + 10, 10] }}
                                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                        className="w-1.5 bg-white/80 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="h-24 flex items-center justify-center gap-6">
                        {!isRecording ? (
                            <Button
                                size="lg"
                                onClick={handleStartRecording}
                                className="w-16 h-16 rounded-full p-0 flex items-center justify-center bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30"
                            >
                                <div className="w-6 h-6 bg-white rounded-full" /> {/* Record Icon styling */}
                            </Button>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setIsRecording(false);
                                        setTimer(0);
                                        // TODO: Cancel recording logic (stop media recorder without saving)
                                        if (recognitionRef.current) recognitionRef.current.stop();
                                        if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
                                    }}
                                    className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </Button>

                                <Button
                                    size="lg"
                                    onClick={handleFinish}
                                    className="w-16 h-16 rounded-full p-0 flex items-center justify-center bg-slate-800 hover:bg-slate-700 border-2 border-white/20"
                                >
                                    <Square className="w-6 h-6 fill-white text-white" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticePage;
