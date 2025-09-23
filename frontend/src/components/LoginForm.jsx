import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
    const { login, signup, closeLogin, isLoginOpen } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        business_name: '',
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    if (!isLoginOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isSignup) {
            const result = await signup(formData);
            if (result.success) {
                // Auto-login after signup
                const loginResult = await login(formData.username, formData.password);
                if (!loginResult.success) {
                    setError(loginResult.error);
                }
            } else {
                setError(result.error);
            }
        } else {
            const result = await login(formData.username, formData.password);
            if (!result.success) {
                setError(result.error);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const switchMode = () => {
        setIsSignup(!isSignup);
        setError('');
        setFormData({
            business_name: '',
            username: '',
            email: '',
            password: ''
        });
    };

    return (
        <div className="modal-overlay">
            <div className="login-form">
                <button className="close-btn" onClick={closeLogin}>×</button>
                
                <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <input
                            type="text"
                            name="business_name"
                            placeholder="Business Name"
                            value={formData.business_name}
                            onChange={handleChange}
                            required
                        />
                    )}
                    
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    
                    {isSignup && (
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    )}
                    
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    
                    <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
                </form>
                
                <p>
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}
                    <button type="button" onClick={switchMode} className="switch-mode">
                        {isSignup ? 'Login' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;