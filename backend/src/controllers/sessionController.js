
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get all sessions for current user
// @route   GET /api/sessions
// @access  Private
export const getSessions = async (req, res) => {
    try {
        const sessions = await prisma.session.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            include: { analysis: true }
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res) => {
    try {
        const { question, durationSeconds, transcript, analysis } = req.body;

        const result = await prisma.$transaction(async (prisma) => {
            // 1. Check & Enforce Rate Limit
            const user = await prisma.user.findUnique({
                where: { id: req.user.id }
            });

            if (!user) throw new Error("User not found");

            const now = new Date();
            const lastDate = new Date(user.lastSessionDate);
            // Check if it's a different day (simple string comparison works for local timezone relative logic, 
            // but for robust UTC handling, we might want to be more specific. 
            // For now, simple date string comparison is sufficient for this scope)
            const isSameDay = now.toDateString() === lastDate.toDateString();

            let currentCount = isSameDay ? user.dailySessionCount : 0;

            if (!user.isPro && currentCount >= 2) {
                throw new Error("Daily free trial limit reached (2 sessions/day). Upgrade to Pro for unlimited access.");
            }

            // 2. Create Session
            const session = await prisma.session.create({
                data: {
                    userId: req.user.id,
                    question,
                    durationSeconds,
                    transcript,
                }
            });

            // 3. Update User UsageStats
            await prisma.user.update({
                where: { id: req.user.id },
                data: {
                    dailySessionCount: currentCount + 1,
                    lastSessionDate: now
                }
            });

            // 4. Create Analysis (if provided)
            if (analysis) {
                await prisma.analysis.create({
                    data: {
                        sessionId: session.id,
                        overallScore: analysis.overallScore,
                        confidenceScore: analysis.confidenceScore,
                        clarityScore: analysis.clarityScore,
                        relevanceScore: analysis.relevanceScore,
                        wpm: analysis.wpm,
                        fillerWords: analysis.fillerWords, // JSON
                        feedbackPoints: analysis.feedbackPoints
                    }
                });
            }

            return session;
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single session details
// @route   GET /api/sessions/:id
// @access  Private
export const getSessionById = async (req, res) => {
    try {
        const session = await prisma.session.findUnique({
            where: { id: req.params.id },
            include: { analysis: true }
        });

        if (session && session.userId === req.user.id) {
            res.json(session);
        } else {
            res.status(404).json({ message: 'Session not found or authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
