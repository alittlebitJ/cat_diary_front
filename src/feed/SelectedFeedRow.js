import React from "react";

function SelectedFeedRow({
  product,
  onQuantityChange,
  onUnitChange,
  onFeedingTimeChange,
  onNotesChange,
  onDelete,
}) {
  return (
    <div style={styles.selectedProductItem}>
      {/* 첫 번째 줄: 급여시간, 습식/주식, food type, 상품명 */}
      <div style={styles.row}>
        <input
          type="time"
          value={product.feedingTime || ""}
          onChange={(e) => onFeedingTimeChange(product.uniqueId, 'feedingTime', e.target.value)}  // uniqueId 사용
          style={styles.feedingTimeInput}
        />
        <div
          style={{
            ...styles.typeBadge,
            backgroundColor: product.type === "주식" ? "rgb(204, 255, 204)" : product.type === "간식" ? "rgb(254, 215, 195)" : "#fff",
          }}
        >
          {product.type || "습식"}
        </div>
        <span style={styles.foodTypeText}>{product.foodType || "Unknown"}</span>
        <span>{product.name}</span>
      </div>

      {/* 두 번째 줄: 수량, 단위, 개별 칼로리 */}
      <div style={styles.row}>
        <input
          type="number"
          value={product.quantity}
          onChange={(e) => onQuantityChange(product.uniqueId, 'quantity', e.target.value)}  // uniqueId 사용
          style={styles.quantityInput}
          min="1"
        />
        <select
          value={product.unit}
          onChange={(e) => onUnitChange(product.uniqueId, 'unit', e.target.value)}  // uniqueId 사용
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
          onChange={(e) => onNotesChange(product.uniqueId, 'notes', e.target.value)}  // uniqueId 사용
          style={styles.notesInput}
        />
        <button
          onClick={() => onDelete(product.uniqueId)}  // uniqueId 사용
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
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  feedingTimeInput: {
    width: "80px",  // 크기 50px로 고정
    padding: "8px",
    marginRight: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    flexShrink: 0, // 크기를 고정하고 다른 요소들이 밀리지 않게 함
    outline: "none",
  },
  notesInput: {
    padding: "8px",
    marginRight: "10px",
    fontSize: "1rem",
    border: "none",  // 외곽선 제거
    borderBottom: "2px solid #eee",  // 아래쪽 보더만 추가
    flex: 1,
    outline: "none",
  },
  typeBadge: {
    fontSize: "0.9rem",  // 글자 크기 줄이기
    padding: "2px 5px",
    marginRight: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
  },
  foodTypeText: {
    fontSize: "0.9rem",  // 글자 크기 줄이기
    color: "#aaa",  // 흐리게 만들기
    marginRight: "10px",
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
    padding: "8px",
    marginRight: "10px",
    borderRadius: "8px",
    outline: "none",
    border: "1px solid #ddd",
  },
  unitSelect: {
    padding: "5px",
    marginRight: "10px",
    borderRadius: "8px",  // select에 border radius 추가
    border: "1px solid #ddd",
    outline: "none",  // 아웃라인 제거
    appearance: "none",  // select의 화살표 숨기기
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
