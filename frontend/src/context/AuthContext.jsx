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
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const savedUser = localStorage.getItem('inventorix_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5555/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                localStorage.setItem('inventorix_user', JSON.stringify(userData));
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
            const response = await fetch('http://localhost:5555/users', {
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
        localStorage.removeItem('inventorix_user');
    };

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    const value = {
        user,
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