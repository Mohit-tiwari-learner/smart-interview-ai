import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);

    // Initial session check & Load History
    useEffect(() => {
        const storedUser = localStorage.getItem('user_session');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Load sessions specific to this user
            const storedSessions = localStorage.getItem(`sessions_${parsedUser.id}`);
            if (storedSessions) {
                try {
                    setSessions(JSON.parse(storedSessions));
                } catch (e) {
                    console.error("Failed to parse sessions", e);
                    setSessions([]);
                }
            }
        }
        setLoading(false);
    }, []);

    // Persist sessions whenever they change (if user is logged in)
    useEffect(() => {
        if (user && sessions.length > 0) {
            localStorage.setItem(`sessions_${user.id}`, JSON.stringify(sessions));
        }
    }, [sessions, user]);

    const login = (email, password) => {
        // Mock Login Logic
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const mockUser = { id: '123', email, name: email.split('@')[0] };
                    setUser(mockUser);
                    localStorage.setItem('user_session', JSON.stringify(mockUser));

                    // Restore sessions for this user
                    const storedSessions = localStorage.getItem(`sessions_${mockUser.id}`);
                    if (storedSessions) {
                        try {
                            setSessions(JSON.parse(storedSessions));
                        } catch (e) {
                            setSessions([]);
                        }
                    } else {
                        setSessions([]);
                    }

                    resolve(mockUser);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    };

    const signup = (email, password, name) => {
        // Mock Signup Logic
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password && name) {
                    // In a real app, we'd check if email exists
                    resolve(true);
                } else {
                    reject(new Error('Please fill in all fields'));
                }
            }, 1000);
        });
    };

    const verifyOtp = (email, otp) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (otp === '1234') {
                    const mockUser = { id: '123', email, name: email.split('@')[0] };
                    setUser(mockUser);
                    localStorage.setItem('user_session', JSON.stringify(mockUser));
                    setSessions([]); // New user, empty sessions
                    resolve(mockUser);
                } else {
                    reject(new Error('Invalid OTP'));
                }
            }, 1000);
        });
    }

    const logout = () => {
        setUser(null);
        setSessions([]); // Clear sessions from state (but keep in localStorage)
        setCurrentSession(null);
        localStorage.removeItem('user_session');
    };

    const saveSession = (sessionData) => {
        if (!user) return;

        const newSession = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            timestamp: Date.now(),
            ...sessionData
        };

        setSessions(prev => [newSession, ...prev]);
        setCurrentSession(newSession); // Set this as the active session for Feedback page
        return newSession.id;
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            sessions,
            currentSession,
            login,
            signup,
            verifyOtp,
            logout,
            saveSession,
            setCurrentSession
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
