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
    "confidence": 92,
    "clarity": 78,
    "relevance": 88,
    "fillerWords": [
        {"word": "um", "count": 2},
        {"word": "like", "count": 3}
    ],
    "paceData": [
        {"time": "0s", "wpm": 120},
        {"time": "10s", "wpm": 145}
    ],
    "sentiment": {
        "positive": 65,
        "neutral": 25,
        "negative": 10
    },
    "feedback": [
        "Reduce filler words - you used 'um' and 'like' frequently",
        "Good pace variation but maintain consistency",
        "Strong opening but could elaborate more on key achievements"
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
                feedback: analysis.feedback || [
                    "Good response structure",
                    "Consider adding more specific examples",
                    "Work on reducing filler words"
                ]
            };
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return this.getMockAnalysis(transcript, question, duration);
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

        return {
            overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
            confidence: Math.floor(Math.random() * 30) + 70,
            clarity: Math.floor(Math.random() * 30) + 70,
            relevance: Math.floor(Math.random() * 30) + 70,
            fillerWords: fillerWords,
            paceData: this.generateMockPaceData(),
            sentiment: {
                positive: Math.floor(Math.random() * 40) + 50,
                neutral: Math.floor(Math.random() * 30) + 20,
                negative: Math.floor(Math.random() * 20) + 5
            },
            feedback: [
                "Good response structure with clear introduction",
                `Pace is ${wordsPerMinute} WPM - aim for 120-150 WPM`,
                fillerWords.length > 0 ? `Reduce filler words: ${fillerWords.map(f => f.word).join(', ')}` : "Minimal filler words - well done!",
                "Consider adding more specific examples to strengthen your answer"
            ]
        };
    }
    async generateInterviewQuestion(context = "behavioral") {
        if (!this.genAI) {
            const fallbackQuestions = [
                "Tell me about a time you handled a difficult stakeholder.",
                "Describe a project where you had to learn a new technology quickly.",
                "How do you prioritize tasks when you have multiple deadlines?",
                "What is your approach to debugging a complex issue?",
                "Tell me about a time you failed and what you learned from it."
            ];
            return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Generate a single, professional ${context} interview question for a software engineer. Return ONLY the question text, no quotes or markedown.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Failed to generate question:', error);
            return "Tell me about a project you are particularly proud of.";
        }
    }
}

export const analysisService = new AnalysisService();
