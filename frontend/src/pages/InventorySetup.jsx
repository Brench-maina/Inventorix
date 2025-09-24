import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function InventorySetup() {
    const [activeTab, setActiveTab] = useState('warehouse'); // 'warehouse' or 'category'
    const { user } = useAuth();

    // Warehouse state
    const [warehouses, setWarehouses] = useState([]);
    const [warehouseData, setWarehouseData] = useState({
        name: '',
        location: '',
        supplier: ''
    });
    const [warehouseMessage, setWarehouseMessage] = useState('');
    const [editingWarehouse, setEditingWarehouse] = useState(null);

    // Category state
    const [categories, setCategories] = useState([]);
    const [categoryData, setCategoryData] = useState({
        name: '',
        in_stock: true
    });
    const [categoryMessage, setCategoryMessage] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    // Load data on component mount
    useEffect(() => {
        if (user) {
            fetchWarehouses();
            fetchCategories();
        }
    }, [user]);

    // Fetch warehouses
    const fetchWarehouses = async () => {
        try {
            const res = await fetch('http://localhost:5555/warehouses');
            const data = await res.json();
            setWarehouses(data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:5555/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Handle warehouse form submission
    const handleWarehouseSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setWarehouseMessage('Please login to manage warehouses');
            return;
        }

        try {
            const url = editingWarehouse 
                ? `http://localhost:5555/warehouses/${editingWarehouse.id}`
                : 'http://localhost:5555/warehouses';
            
            const method = editingWarehouse ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(warehouseData)
            });

            const data = await res.json();
            if (res.ok) {
                setWarehouseMessage(editingWarehouse ? 'Warehouse updated successfully!' : 'Warehouse added successfully!');
                setWarehouseData({ name: '', location: '', supplier: '' });
                setEditingWarehouse(null);
                fetchWarehouses();
            } else {
                setWarehouseMessage(data.error || 'Something went wrong.');
            }
        } catch (error) {
            setWarehouseMessage('Error: ' + error.message);
        }
    };

    // Handle category form submission
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setCategoryMessage('Please login to manage categories');
            return;
        }

        try {
            const url = editingCategory 
                ? `http://localhost:5555/categories/${editingCategory.id}`
                : 'http://localhost:5555/categories';
            
            const method = editingCategory ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            });
            
            const data = await res.json();
            if (res.ok) {
                setCategoryMessage(editingCategory ? 'Category updated successfully!' : 'Category added successfully!');
                setCategoryData({ name: '', in_stock: true });
                setEditingCategory(null);
                fetchCategories();
            } else {
                setCategoryMessage(data.error || 'Failed to save category');
            }
        } catch (err) {
            setCategoryMessage('Error: ' + err.message);
        }
    };

    // Edit warehouse
    const handleEditWarehouse = (warehouse) => {
        setWarehouseData({
            name: warehouse.name,
            location: warehouse.location,
            supplier: warehouse.supplier || ''
        });
        setEditingWarehouse(warehouse);
        setWarehouseMessage('');
    };

    // Edit category
    const handleEditCategory = (category) => {
        setCategoryData({
            name: category.name,
            in_stock: category.in_stock
        });
        setEditingCategory(category);
        setCategoryMessage('');
    };

    // Delete warehouse
    const handleDeleteWarehouse = async (warehouseId) => {
        if (!window.confirm('Are you sure you want to delete this warehouse? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:5555/warehouses/${warehouseId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setWarehouseMessage('Warehouse deleted successfully!');
                fetchWarehouses();
                if (editingWarehouse && editingWarehouse.id === warehouseId) {
                    setEditingWarehouse(null);
                    setWarehouseData({ name: '', location: '', supplier: '' });
                }
            } else {
                setWarehouseMessage('Failed to delete warehouse');
            }
        } catch (error) {
            setWarehouseMessage('Error: ' + error.message);
        }
    };

    // Delete category
    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:5555/categories/${categoryId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setCategoryMessage('Category deleted successfully!');
                fetchCategories();
                if (editingCategory && editingCategory.id === categoryId) {
                    setEditingCategory(null);
                    setCategoryData({ name: '', in_stock: true });
                }
            } else {
                setCategoryMessage('Failed to delete category');
            }
        } catch (error) {
            setCategoryMessage('Error: ' + error.message);
        }
    };

    // Cancel edit
    const handleCancelEdit = () => {
        if (activeTab === 'warehouse') {
            setEditingWarehouse(null);
            setWarehouseData({ name: '', location: '', supplier: '' });
            setWarehouseMessage('');
        } else {
            setEditingCategory(null);
            setCategoryData({ name: '', in_stock: true });
            setCategoryMessage('');
        }
    };

    // Update warehouse form fields
    const handleWarehouseChange = (e) => {
        const { name, value } = e.target;
        setWarehouseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Update category form fields
    const handleCategoryChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCategoryData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (!user) {
        return (
            <div className="inventory-setup">
                <h1>Inventory Setup</h1>
                <div className="login-prompt">
                    <p>Please login to manage inventory setup.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="inventory-setup">
            <div className="page-header">
                <h1>Inventory Setup</h1>
                <p>Manage warehouses and categories to organize your inventory</p>
            </div>

            <div className="setup-tabs">
                <button 
                    className={`tab-button ${activeTab === 'warehouse' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('warehouse');
                        handleCancelEdit();
                    }}
                >
                    Warehouses ({warehouses.length})
                </button>
                <button 
                    className={`tab-button ${activeTab === 'category' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('category');
                        handleCancelEdit();
                    }}
                >
                    Categories ({categories.length})
                </button>
            </div>

            <div className="setup-content">
                {activeTab === 'warehouse' && (
                    <div className="warehouse-section">
                        <div className="form-section">
                            <h2>{editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</h2>
                            {warehouseMessage && (
                                <div className={`message ${warehouseMessage.includes('successfully') ? 'success' : 'error'}`}>
                                    {warehouseMessage}
                                </div>
                            )}
                            <form onSubmit={handleWarehouseSubmit}>
                                <div className="form-group">
                                    <label htmlFor="warehouse-name">Warehouse Name *</label>
                                    <input
                                        type="text"
                                        id="warehouse-name"
                                        name="name"
                                        value={warehouseData.name}
                                        onChange={handleWarehouseChange}
                                        required
                                        placeholder="Enter warehouse name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="warehouse-location">Location *</label>
                                    <input
                                        type="text"
                                        id="warehouse-location"
                                        name="location"
                                        value={warehouseData.location}
                                        onChange={handleWarehouseChange}
                                        required
                                        placeholder="Enter warehouse location"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="warehouse-supplier">Supplier</label>
                                    <input
                                        type="text"
                                        id="warehouse-supplier"
                                        name="supplier"
                                        value={warehouseData.supplier}
                                        onChange={handleWarehouseChange}
                                        placeholder="Enter supplier name (optional)"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="submit-btn">
                                        {editingWarehouse ? 'Update Warehouse' : 'Add Warehouse'}
                                    </button>
                                    {editingWarehouse && (
                                        <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="list-section">
                            <h3>Existing Warehouses</h3>
                            {warehouses.length === 0 ? (
                                <p className="no-items">No warehouses found. Add your first warehouse above.</p>
                            ) : (
                                <div className="items-list">
                                    {warehouses.map(warehouse => (
                                        <div key={warehouse.id} className={`item-card ${editingWarehouse?.id === warehouse.id ? 'editing' : ''}`}>
                                            <div className="item-info">
                                                <h4>{warehouse.name}</h4>
                                                <p><strong>Location:</strong> {warehouse.location}</p>
                                                <p><strong>Supplier:</strong> {warehouse.supplier || 'Not specified'}</p>
                                                <p><strong>ID:</strong> {warehouse.id}</p>
                                            </div>
                                            <div className="item-actions">
                                                <button 
                                                    onClick={() => handleEditWarehouse(warehouse)}
                                                    className="edit-btn"
                                                    title="Edit warehouse"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteWarehouse(warehouse.id)}
                                                    className="delete-btn"
                                                    title="Delete warehouse"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'category' && (
                    <div className="category-section">
                        <div className="form-section">
                            <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                            {categoryMessage && (
                                <div className={`message ${categoryMessage.includes('successfully') ? 'success' : 'error'}`}>
                                    {categoryMessage}
                                </div>
                            )}
                            <form onSubmit={handleCategorySubmit}>
                                <div className="form-group">
                                    <label htmlFor="category-name">Category Name *</label>
                                    <input
                                        type="text"
                                        id="category-name"
                                        name="name"
                                        value={categoryData.name}
                                        onChange={handleCategoryChange}
                                        required
                                        placeholder="Enter category name"
                                    />
                                </div>
                                <div className="form-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="in_stock"
                                            checked={categoryData.in_stock}
                                            onChange={handleCategoryChange}
                                        />
                                        Category is in stock
                                    </label>
                                    <small>Uncheck if this category is currently unavailable</small>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="submit-btn">
                                        {editingCategory ? 'Update Category' : 'Add Category'}
                                    </button>
                                    {editingCategory && (
                                        <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="list-section">
                            <h3>Existing Categories</h3>
                            {categories.length === 0 ? (
                                <p className="no-items">No categories found. Add your first category above.</p>
                            ) : (
                                <div className="items-list">
                                    {categories.map(category => (
                                        <div key={category.id} className={`item-card ${editingCategory?.id === category.id ? 'editing' : ''}`}>
                                            <div className="item-info">
                                                <h4>{category.name}</h4>
                                                <p>
                                                    <strong>Status:</strong> 
                                                    <span className={`status ${category.in_stock ? 'in-stock' : 'out-of-stock'}`}>
                                                        {category.in_stock ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                </p>
                                                <p><strong>ID:</strong> {category.id}</p>
                                            </div>
                                            <div className="item-actions">
                                                <button 
                                                    onClick={() => handleEditCategory(category)}
                                                    className="edit-btn"
                                                    title="Edit category"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                    className="delete-btn"
                                                    title="Delete category"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InventorySetup;