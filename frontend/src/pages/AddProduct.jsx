import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AddProduct() {
    const [categories, setCategories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        category_id: '',
        warehouse_id: '',
    });

    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const editingProduct = location.state?.product || null;

    const API_URL = import.meta.env.VITE_API_URL;

    //Pre-fill form if editing
    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name || '',
                price: editingProduct.price || '',
                quantity: editingProduct.quantity || '',
                category_id: editingProduct.category_id || '',
                warehouse_id: editingProduct.warehouse_id || '',
            });
        }
    }, [editingProduct]);

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to continue');
            navigate('/login');
            return;
        }
        try {
            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };
            const [categoriesRes, warehousesRes] = await Promise.all([
                fetch(`${API_URL}/categories`, { headers }),
                fetch(`${API_URL}/warehouses`, { headers })
            ]);
            if (!categoriesRes.ok || !warehousesRes.ok) {
                console.error('Failed to fetch dropdown data');
                navigate('/login');
                return;
            }

            setCategories(await categoriesRes.json());
            setWarehouses(await warehousesRes.json());
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to continue');
            navigate('/login');
            return;
        }

        try {
            const method = editingProduct ? 'PATCH' : 'POST';
            const url = editingProduct
                ? `${API_URL}/products/${editingProduct.id}`
                : `${API_URL}/products`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity, 10),
                    user_id: user.id
                }),
            });

            if (response.ok) {
                navigate('/products');
            } else {
                const errorData = await response.json();
                alert('Error saving product: ' + errorData.error);
            }
        } catch (error) {
            console.error('Error saving product:', error);
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
            <h1>{editingProduct ? 'Edit Product' : 'Add New Product'}</h1>
            
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
                    <select 
                        name="category_id" 
                        value={formData.category_id} 
                        onChange={handleChange} 
                        required
                    >
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
                    <select 
                        name="warehouse_id" 
                        value={formData.warehouse_id} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select Warehouse</option>
                        {warehouses.map(warehouse => (
                            <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="submit-btn">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
            </form>
        </div>
    );
}

export default AddProduct;
