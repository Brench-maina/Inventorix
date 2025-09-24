import React, { useState } from 'react';

function AddCategory() {
    const [name, setName] = useState('');
    const [inStock, setInStock] = useState(true);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5555/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, in_stock: inStock })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Category added successfully!');
                setName('');
                setInStock(true);
            } else {
                setMessage(data.error || 'Failed to add category');
            }
        } catch (err) {
            setMessage('Error: ' + err.message);
        }
    };

    return (
        <div>
            <h2>Add New Category</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>In Stock:</label>
                    <input 
                        type="checkbox" 
                        checked={inStock} 
                        onChange={(e) => setInStock(e.target.checked)} 
                    />
                </div>
                <button type="submit">Add Category</button>
            </form>
        </div>
    );

}



export default AddCategory;
