import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AddProduct() {
    const [categories, setCategories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        category_id: '',
        warehouse_id: ''
    });
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [categoriesRes, warehousesRes] = await Promise.all([
                fetch('http://localhost:5555/categories'),
                fetch('http://localhost:5555/warehouses')
            ]);

            setCategories(await categoriesRes.json());
            setWarehouses(await warehousesRes.json());
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('Please login to add products');
            return;
        }

        try {
            const response = await fetch('http://localhost:5555/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity),
                    user_id: user.id
                }),
            });

            if (response.ok) {
                navigate('/products');
            } else {
                const errorData = await response.json();
                alert('Error adding product: ' + errorData.error);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="add-product">
            <h1>Add New Product</h1>
            
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Warehouse:</label>
                    <select name="warehouse_id" value={formData.warehouse_id} onChange={handleChange} required>
                        <option value="">Select Warehouse</option>
                        {warehouses.map(warehouse => (
                            <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="submit-btn">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;