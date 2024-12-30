import React from "react";

function SelectedFeedRow({ product, onQuantityChange, onUnitChange, onFeedingTimeChange, onNotesChange, onDelete }) {
  return (
    <div style={styles.selectedProductItem}>
      {/* 첫 번째 줄: 급여시간, 습식/주식, food type, 상품명 */}
      <div style={styles.row}>
        <input
          type="text"
          placeholder="급여시간"
          value={product.feedingTime || ""}
          onChange={(e) => onFeedingTimeChange(product.id, 'feedingTime', e.target.value)}
          style={styles.feedingTimeInput}
        />
        <span>{product.type || "습식"}</span>
        <span>{product.foodType || "Unknown"}</span>
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

      {/* 세 번째 줄: 비고 및 삭제 버튼 */}
      <div style={styles.row}>
        <input
          type="text"
          placeholder="비고"
          value={product.notes || ""}
          onChange={(e) => onNotesChange(product.id, 'notes', e.target.value)}
          style={styles.input}
        />
        <button
          onClick={() => onDelete(product.id)} // 삭제 버튼 클릭 시 호출
          style={styles.deleteButton}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

const styles = {
  selectedProductItem: {
    margin: "10px 0",
    borderBottom: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  feedingTimeInput: {
    width: "40px",
    padding: "8px",
    marginRight: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    flex: 1,
    outline: "none",
  },
  input: {
    padding: "8px",
    marginRight: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    flex: 1,
    outline: "none",
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
    padding: "px",
    marginRight: "10px",
    borderRadius: "8px",
    outline: "none",
    border: "1px solid #ddd",
  },
  unitSelect: {
    padding: "5px",
    marginRight: "10px",
    outline: "none",
  },
  caloriesText: {
    marginLeft: "10px",
    fontSize: "0.9rem",
    color: "#555",
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
  },
};

export default SelectedFeedRow;
