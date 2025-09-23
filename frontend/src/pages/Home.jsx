import React, {useState, useEffect} from "react";
import CategoryCard from "../components/CategoryCard";
import WarehouseCard from "../components/WarehouseCard";

function Home() {
    const [categories, setCategories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalWarehouses: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

     const fetchData = async () => {
        try {
            const [categoriesRes, warehousesRes, statsRes] = await Promise.all([
                fetch('http://localhost:5555/categories'),
                fetch('http://localhost:5555/warehouses'),
                fetch('http://localhost:5555/stats')
            ]);

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
                <h2>Our Warehouses</h2>
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



