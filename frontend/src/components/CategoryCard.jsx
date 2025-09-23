import React from 'react';

function CategoryCard({ category }) {
    return (
        <div className="category-card">
            <h3>{category.name}</h3>
            <div className={`status ${category.in_stock ? 'in-stock' : 'out-of-stock'}`}>
                {category.in_stock ? 'In Stock' : 'Out of Stock'}
            </div>
        </div>
    );
}

export default CategoryCard;