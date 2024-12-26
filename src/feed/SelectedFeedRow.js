// SelectedFeedRow.js
// SelectedFeedRow.js
import React from "react";

function SelectedFeedRow({ product, onQuantityChange, onUnitChange, onFeedingTimeChange, onNotesChange }) {
  return (
    <div style={styles.selectedProductItem}>
      {/* 첫 번째 줄: 급여시간, 습식/주식, food type, 상품명 */}
      <div style={styles.row}>
        <input
          type="text"
          placeholder="급여시간"
          value={product.feedingTime || ""}
          onChange={(e) => onFeedingTimeChange(product.id, 'feedingTime', e.target.value)}
          style={styles.input}
        />
        <span>{product.type || "습식"}</span> {/* 서버에서 불러온 값 표시 */}
        <span>{product.foodType || "Unknown"}</span> {/* 서버에서 불러온 값 표시 */}
        <span>{product.name}</span>
      </div>

      {/* 두 번째 줄: 수량, 단위, 개별 칼로리 */}
      <div style={styles.row}>
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

      {/* 세 번째 줄: 비고 */}
      <div style={styles.row}>
        <input
          type="text"
          placeholder="비고"
          value={product.notes || ""}
          onChange={(e) => onNotesChange(product.id, 'notes', e.target.value)}
          style={styles.input}
        />
      </div>
    </div>
  );
}

const styles = {
  selectedProductItem: {
    margin: "10px 0",
    padding: "10px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  input: {
    padding: "8px",
    marginRight: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    flex: 1,
  },
  select: {
    padding: "8px",
    marginRight: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  quantityInput: {
    width: "60px",
    padding: "5px",
    marginRight: "10px",
  },
  unitSelect: {
    padding: "5px",
    marginRight: "10px",
  },
  caloriesText: {
    marginLeft: "10px",
    fontSize: "0.9rem",
    color: "#555",
  },
  notesInput: {
    padding: "8px",
    width: "100%",
    height: "60px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
};

export default SelectedFeedRow;
