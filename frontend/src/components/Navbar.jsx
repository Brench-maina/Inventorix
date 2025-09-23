import React from "react";
import {link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

function Navbar() {
    const {user, logout, openLogin } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Inventorix</Link>
            </div>
            
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/add-product">Add Product</Link>
                
                {user ? (
                    <div className="user-section">
                        <span>Welcome, {user.business_name}</span>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </div>
                ) : (
                    <button onClick={openLogin} className="login-btn">Sign Up</button>
                )}
            </div>
        </nav>
    );
}

export default Navbar; 

   
                    
