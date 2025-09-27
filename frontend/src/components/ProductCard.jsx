import React from 'react';

function ProductCard({ product, onEdit, onDelete }) {
    return (
        <div className="product-card">
            <h3>{product.name}</h3>
            <div className="product-details">
                  <p><strong>Category:</strong> {product.category || "Uncategorized"}</p>
                  <p><strong>Warehouse:</strong> {product.warehouse || "None"}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
            </div>
            <div className="product-actions">
                <button onClick={() => onEdit(product)} className="edit-btn">Edit</button>
                <button onClick={() => onDelete(product.id)} className="delete-btn">Delete</button>
            </div>
        </div>
    );
}

export default ProductCard;