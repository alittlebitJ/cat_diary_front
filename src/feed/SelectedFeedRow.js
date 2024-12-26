// SelectedFeedRow.js
import React from "react";

function SelectedFeedRow({ product, onQuantityChange, onUnitChange }) {
  return (
    <div style={styles.selectedProductItem}>
      <span>{product.type} - {product.name}</span>
      <input
        type="number"
        value={product.quantity}
        onChange={(e) => onQuantityChange(product.id, 'quantity', e.target.value)}
        style={styles.quantityInput}
        min="1"
      />
      <select
        value={product.unit}
        onChange={(e) => onUnitChange(product.id, 'unit', e.target.value)}
        style={styles.unitSelect}
      >
        <option value="g">g</option>
        <option value="개">개</option>
      </select>
      <span style={styles.caloriesText}>
        {product.calculatedCalories ? product.calculatedCalories.toFixed(2) : "0.00"} kcal
      </span>
    </div>
  );
}

const styles = {
  selectedProductItem: {
    margin: "10px 0",
    padding: "10px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityInput: {
    width: "60px",
    padding: "5px",
    marginRight: "10px",
  },
  unitSelect: {
    padding: "5px",
  },
  caloriesText: {
    marginLeft: "10px",
    fontSize: "0.9rem",
    color: "#555",
  },
};

export default SelectedFeedRow;
