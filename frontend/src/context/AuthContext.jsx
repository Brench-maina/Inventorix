import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Load saved session on app start
        const savedUser = localStorage.getItem('inventorix_user');
        const savedToken = localStorage.getItem('token');
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
        setIsLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                // expect backend to return { token, user }
                const { token, user } = await response.json();

                setUser(user);
                setToken(token);

                // Save both user and token
                localStorage.setItem('inventorix_user', JSON.stringify(user));
                localStorage.setItem('token', token);

                setIsLoginOpen(false);
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const newUser = await response.json();
                return { success: true, user: newUser };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('inventorix_user');
        localStorage.removeItem('token');
    };

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    const value = {
        user,
        token,
        isLoginOpen,
        isLoading,
        login,
        signup,
        logout,
        openLogin,
        closeLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
