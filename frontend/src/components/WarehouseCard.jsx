import React from "react";

function warehouseCard({warehouse}) {
    return (
        <div className="warehouse-card">
            <h3>{warehouse.name}</h3>
            <div className="warehouse-details">
                <p><strong>ID:</strong>{warehouse.id}</p>
                <p><strong>Location:</strong> {warehouse.location}</p>
                <p><strong>Supplier:</strong> {warehouse.supplier}</p>
            </div>
        </div>
    );
}

export default warehouseCard;