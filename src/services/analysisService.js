import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;

class AnalysisService {
    constructor() {
        if (!API_KEY) {
            console.warn('Google AI API key not found. Analysis will use fallback mock data.');
            this.genAI = null;
        } else {
            this.genAI = new GoogleGenerativeAI(API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        }
    }

    async analyzeTranscript(transcript, question, duration) {
        if (!this.genAI || !transcript.trim()) {
            return this.getMockAnalysis(transcript, question, duration);
        }

        try {
            const prompt = this.buildAnalysisPrompt(transcript, question, duration);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return this.parseAnalysisResponse(text, transcript);
        } catch (error) {
            console.error('AI analysis failed:', error);
            return this.getMockAnalysis(transcript, question, duration);
        }
    }


    buildAnalysisPrompt(transcript, question, duration) {
        const wordsPerMinute = Math.round((transcript.split(' ').length / duration) * 60);

        return `Analyze this interview response for the question: "${question}"

Transcript: "${transcript}"

Duration: ${duration} seconds (${wordsPerMinute} WPM)

Please provide a detailed analysis in the following JSON format:
{
    "overallScore": 85,
    "confidence": 92, // 0-100
    "clarity": 78, // 0-100
    "relevance": 88, // 0-100
    "fillerWords": [
        {"word": "um", "count": 2},
        {"word": "like", "count": 3}
    ],
    "strengths": [
        "Strong opening statement",
        "Good use of STAR method",
        "Clear pronunciation"
    ],
    "improvements": [
        "Reduce filler words",
        "Provide more specific metrics",
        "Conclude with a call to action"
    ],
    "durationFeedback": "Good length", // "Too short", "Good length", "Too long"
    "sentiment": {
        "positive": 65,
        "neutral": 25,
        "negative": 10
    },
    "feedback": [ // Legacy: General quick tips
        "Reduce filler words",
        "Good pace"
    ]
}`;
    }

    parseAnalysisResponse(text, transcript) {
        try {
            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const analysis = JSON.parse(jsonMatch[0]);

            // Ensure all required fields exist
            return {
                overallScore: analysis.overallScore || 75,
                confidence: analysis.confidence || 80,
                clarity: analysis.clarity || 75,
                relevance: analysis.relevance || 80,
                fillerWords: analysis.fillerWords || this.analyzeFillerWords(transcript),
                paceData: analysis.paceData || this.generateMockPaceData(),
                sentiment: analysis.sentiment || { positive: 60, neutral: 30, negative: 10 },
                feedback: analysis.feedback || ["Good effort"],
                strengths: analysis.strengths || ["Good clarity"],
                improvements: analysis.improvements || ["Add more details"],
                durationFeedback: analysis.durationFeedback || "Good length",
                suggestedNextTopic: analysis.suggestedNextTopic || "General Interview Practice"
            };
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            // Fallback to mock if parsing fails (but using the passed transcript/question)
            // We need to access getMockAnalysis content, but context might be lost if we just return mock call
            // Ideally we'd recalculate mock here or just return a safe default.
            // For simplicity, let's return a basic object
            return {
                overallScore: 70,
                confidence: 70,
                clarity: 70,
                relevance: 70,
                fillerWords: [],
                strengths: ["Couldn't parse AI details"],
                improvements: ["Try again"],
                feedback: ["Analysis parsing error"],
                durationFeedback: "Unknown"
            };
        }
    }

    analyzeFillerWords(transcript) {
        const fillers = ['um', 'uh', 'like', 'basically', 'actually', 'you know', 'sort of', 'kind of'];
        const lowerTranscript = transcript.toLowerCase();
        const results = [];

        fillers.forEach(word => {
            const count = (lowerTranscript.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
            if (count > 0) {
                results.push({ word, count });
            }
        });

        return results;
    }

    generateMockPaceData() {
        return [
            { time: '0s', wpm: 120 },
            { time: '10s', wpm: 145 },
            { time: '20s', wpm: 130 },
            { time: '30s', wpm: 125 },
            { time: '40s', wpm: 155 },
            { time: '50s', wpm: 140 },
        ];
    }

    getMockAnalysis(transcript, question, duration) {
        const fillerWords = this.analyzeFillerWords(transcript);
        const wordsPerMinute = Math.round((transcript.split(' ').length / duration) * 60);

        // Simple Keyword Matching for "Better" Mock Analysis
        const lowerTrans = transcript.toLowerCase();
        const positiveKeywords = ['team', 'lead', 'learned', 'result', 'achieved', 'solved', 'improved', 'helped'];
        const actionKeywords = ['i', 'my', 'we', 'our'];

        const positiveCount = positiveKeywords.filter(k => lowerTrans.includes(k)).length;
        const actionCount = actionKeywords.filter(k => lowerTrans.includes(k)).length;

        // Dynamic Scoring based on keywords
        let baseScore = 70;
        baseScore += (positiveCount * 2);
        baseScore += (actionCount > 2 ? 5 : 0);
        baseScore -= (fillerWords.length * 2);

        // Clamp score
        const finalScore = Math.max(50, Math.min(98, baseScore));

        const feedback = [
            `Pace is ${wordsPerMinute} WPM - ${wordsPerMinute > 110 && wordsPerMinute < 160 ? "Great pace!" : "aim for 120-150 WPM"}`,
        ];

        if (fillerWords.length > 2) {
            feedback.push(`Reduce filler words: ${fillerWords.map(f => f.word).join(', ')}`);
        } else {
            feedback.push("Excellent clarity with minimal filler words.");
        }

        if (positiveCount > 0) {
            feedback.push("Good use of action verbs and positive impact words.");
        } else {
            feedback.push("Try to use more strong action verbs (e.g., 'achieved', 'led', 'solved') to describe your impact.");
        }

        if (actionCount === 0 && transcript.length > 50) {
            feedback.push("Ensure you personalize the answer with 'I' statements to own your contributions.");
        }

        // Mock Length Analysis
        let durationFeedback = "Good length";
        if (duration < 30) durationFeedback = "Too short. Try to elaborate more.";
        else if (duration > 180) durationFeedback = "Too long. Try to be more concise.";

        // Mock Strengths & Improvements
        const strengths = [
            "Clear articulation of ideas",
            "Maintained good flow throughout",
            positiveCount > 0 ? "Used positive action words" : "Professional tone"
        ];

        const improvements = [
            fillerWords.length > 2 ? "Reduce usage of filler words" : "Vary your pitch for more engagement",
            "Provide more concrete examples",
            "Conclude with a strong summary statement"
        ];

        // Mock Suggested Next Topic
        const suggestedTopics = [
            "Behavioral: Handling Conflict",
            "Technical: System Design Basics",
            "Soft Skills: Leadership Experience",
            "Technical: Code Optimization",
            "Behavioral: Weaknesses & Failures"
        ];
        const suggestedNextTopic = suggestedTopics[Math.floor(Math.random() * suggestedTopics.length)];

        return {
            overallScore: finalScore,
            confidence: Math.min(100, finalScore + 5),
            clarity: Math.max(0, 100 - (fillerWords.length * 5)),
            relevance: Math.min(100, 70 + (positiveCount * 5)),
            fillerWords: fillerWords,
            paceData: this.generateMockPaceData(),
            sentiment: {
                positive: 40 + (positiveCount * 10),
                neutral: 30,
                negative: 10
            },
            feedback: feedback,
            strengths: strengths,
            improvements: improvements,
            durationFeedback: durationFeedback,
            suggestedNextTopic: suggestedNextTopic
        };
    }
    async generateInterviewQuestion(mode = "HR", role = "Software Engineer", experience = "Fresher") {
        const prompt = mode === "HR"
            ? `Generate a single, professional behavioral interview question for a ${experience} ${role}. Focus on soft skills, culture fit, or situational awareness. Return ONLY the question text.`
            : `Generate a single, technical interview question for a ${experience} ${role}. Focus on core concepts, problem-solving, or system design appropriate for this level. Return ONLY the question text.`;

        if (!this.genAI) {
            // Expanded fallback mock questions
            const hrQuestions = [
                "Tell me about a time you handled a difficult stakeholder.",
                "Describe a project where you had to learn a new technology quickly.",
                "How do you prioritize tasks when you have multiple deadlines?",
                "What is your approach to resolving conflicts within a team?",
                "Tell me about a time you failed and what you learned from it."
            ];

            const techQuestions = [
                "Explain the concept of specific to your role.",
                `What are the key design principles you follow as a ${role}?`,
                "How do you optimize for performance in your applications?",
                "Describe a complex technical challenge you solved recently.",
                "What is your preferred tech stack and why?"
            ];

            const questions = mode === "HR" ? hrQuestions : techQuestions;
            return questions[Math.floor(Math.random() * questions.length)];
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Failed to generate question:', error);
            return "Tell me about a project you are particularly proud of.";
        }
    }

    async rewriteAnswer(transcript, tone = "Professional") {
        const prompt = `You are an expert verbal communications coach.
        
Task: Rewrite the following interview answer to be more ${tone}, concise, and impactful. 
Context: The speaker may use "Hinglish" or Indian English idioms. detect this and convert it to standard, high-quality Global Professional English.
Method: Use the STAR method where applicable. Fix grammar, remove filler words, and improve vocabulary.

Original Answer: "${transcript}"

Return ONLY the rewritten answer text. Do not add explanations.`;

        if (!this.genAI) {
            // Mock Rewrites
            const mocks = {
                "Professional": "In my previous role, I successfully managed a complex project by prioritizing key tasks and fostering open communication within the team. This approach allowed us to meet deadlines efficiently while ensuring high-quality deliverables.",
                "Confident": "I led a critical initiative that streamlined our workflow, resulting in a 20% increase in productivity. I thrive in challenging environments and am quick to adapt to new technologies to drive results.",
                "Concise": "I handled the stakeholder issue by listening to their concerns and proposing a data-backed solution, which resolved the conflict immediately."
            };
            return mocks[tone] || mocks["Professional"];
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Failed to rewrite answer:', error);
            return "Unable to generate refined answer at this time.";
        }
    }
}

export const analysisService = new AnalysisService();
