import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard';
import WarehouseCard from '../components/WarehouseCard';
import { useAuth } from '../context/AuthContext';  

function Home() {
      const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [stats, setStats] = useState({ total_products: 0, total_categories: 0, total_warehouses: 0 });

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (user) {
        fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }
            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };
            const [categoriesRes, warehousesRes, statsRes] = await Promise.all([
                fetch(`${API_URL}/categories`, { headers }),
                fetch(`${API_URL}/warehouses`, { headers }),
                fetch(`${API_URL}/stats`, { headers })
            ]);
            if (!categoriesRes.ok || !warehousesRes.ok || !statsRes.ok) {
            console.error("Unauthorized or failed request");
            return;
        }

            setCategories(await categoriesRes.json());
            setWarehouses(await warehousesRes.json());
            setStats(await statsRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="home">
            <div className="welcome-section">
                <h1>Welcome to Inventorix</h1>
                <p>Your complete inventory management solution</p>
                <p> This smart inventory and supplier management system designed to help businesses stay organized, save time, and boost efficiency.</p>
                <div className="stats">
                    <div className="stat-card">
                        <h3>Total Products</h3>
                        <p>{stats.total_products}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Categories</h3>
                        <p>{stats.total_categories}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Warehouses</h3>
                        <p>{stats.total_warehouses}</p>
                    </div>
                </div>
            </div>

            <div className="categories-section">
                <h2>Product Categories</h2>
                <div className="categories-grid">
                    {categories.map(category => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </div>

            <div className="warehouses-section">
                <h2>Warehouses</h2>
                <div className="warehouses-grid">
                    {warehouses.map(warehouse => (
                        <WarehouseCard key={warehouse.id} warehouse={warehouse} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;