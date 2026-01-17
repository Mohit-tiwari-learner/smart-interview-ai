
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

        // Transaction to create Session and Analysis together
        const result = await prisma.$transaction(async (prisma) => {
            const session = await prisma.session.create({
                data: {
                    userId: req.user.id,
                    question,
                    durationSeconds,
                    transcript,
                }
            });

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
