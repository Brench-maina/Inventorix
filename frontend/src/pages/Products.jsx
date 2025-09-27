import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

function Products() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                navigate ('/login');
                return;
            }
            const response = await fetch('http://localhost:5555/products',{
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
    if (!response.ok) {
       console.error("Unauthorized or failed request");
       navigate('/login');
       return;
    }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleEdit = (product) => {
        navigate(`/edit-product/${product.id}`, { state: { product } });
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('token');
                await fetch(`http://localhost:5555/products/${productId}`, {
                    method: 'DELETE',
                    headers: { 
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json" 
                    }
                });
                fetchProducts(); // Refresh the list
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div className="products-page">
            <div className="page-header">
                <h1>Products Management</h1>
                <button onClick={() => navigate('/add-product')} className="add-btn">
                    Add New Product
                </button>
            </div>

            <div className="products-grid">
                {products.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
}

export default Products;