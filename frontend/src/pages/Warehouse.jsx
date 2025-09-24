import React, { useState } from 'react';

function AddWarehouse() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [supplier, setSupplier] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5555/warehouses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, location, supplier })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Warehouse added successfully!');
                setName('');
                setLocation('');
                setSupplier('');
            } else {
                setMessage(data.error || 'Something went wrong.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Add New Warehouse</h2>
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
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Supplier:</label>
                    <input
                        type="text"
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                    />
                </div>
                <button type="submit">Add Warehouse</button>
            </form>
        </div>
    );
}

export default AddWarehouse;
