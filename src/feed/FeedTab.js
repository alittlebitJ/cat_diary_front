import React, { useState, useRef, useEffect } from "react";
import SelectedFeedRow from "./SelectedFeedRow"; // SelectedFeedRow 컴포넌트 추가

function FeedTab() {
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [feedOptions, setFeedOptions] = useState([]); // 서버로부터 받은 제품 리스트
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [selectedProducts, setSelectedProducts] = useState([]); // 선택된 제품들 상태
  const [totalCalories, setTotalCalories] = useState(0); // 총 섭취 칼로리

  const debounceTimer = useRef(null);

  const fetchFeedOptions = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8088/feed/nutrition/search?query=${query}`
      );
      if (!response.ok) {
        throw new Error("제품 검색에 실패했습니다.");
      }
      const data = await response.json();
      setFeedOptions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;

    if (query === "") {
      setFeedOptions([]);
      setSearchQuery(query);
      return;
    }

    setSearchQuery(query);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchFeedOptions(query);
    }, 500);
  };

  const handleAddProduct = (product) => {
    setSelectedProducts((prevSelected) => [
      ...prevSelected,
      { ...product, quantity: 1, unit: "g" }, // 기본값은 "g"
    ]);
  };

  const handleInputChange = (id, field, value) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.map((product) =>
        product.id === id
          ? { ...product, [field]: value }
          : product
      )
    );
  };

  // 총 칼로리 계산 함수
  const calculateTotalCalories = () => {
    let total = 0;
    selectedProducts.forEach((product) => {
      let calculatedCalories = 0;

      // 그람 단위일 경우 칼로리 계산
      if (product.unit === "g" && product.caloriesPerGram) {
        calculatedCalories = product.quantity * product.caloriesPerGram;
      } 
      // 개수 단위일 경우 칼로리 계산
      else if (product.unit === "개" && product.caloriesPerUnit) {
        calculatedCalories = product.quantity * product.caloriesPerUnit;
      }

      product.calculatedCalories = calculatedCalories;
      total += calculatedCalories;
    });
    setTotalCalories(total);
  };

  // 선택된 제품이 변경될 때마다 총 칼로리 계산
  useEffect(() => {
    calculateTotalCalories();
  }, [selectedProducts]);

  return (
    <div style={styles.container}>
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="제품명 검색"
          style={styles.searchInput}
        />
        
        {/* 검색 결과 */}
        {!loading && !error && feedOptions.length > 0 && (
          <div style={styles.results}>
            {feedOptions.map((feed) => (
              <div key={feed.id} style={styles.feedItem}>
                <h4>{feed.name}</h4>
                <button style={styles.addButton} onClick={() => handleAddProduct(feed)}>
                  추가
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 선택된 제품 리스트 영역 */}
      {selectedProducts.length > 0 && (
        <div style={styles.selectedProductsContainer}>
          <h3>선택된 제품들</h3>
          {selectedProducts.map((product) => (
            <SelectedFeedRow
              key={product.id}
              product={product}
              onQuantityChange={handleInputChange}
              onUnitChange={handleInputChange}
            />
          ))}
        </div>
      )}

      {/* 총 섭취 칼로리 표시 */}
      {totalCalories > 0 && (
        <div style={styles.totalCaloriesContainer}>
          <h4>총 섭취 칼로리: {totalCalories.toFixed(2)} 칼로리</h4>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "10px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#FFFFFF",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  searchContainer: {
    backgroundColor: "#F5F5F5",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  searchInput: {
    padding: "8px",
    fontSize: "1rem",
    width: "100%",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  results: {
    marginTop: "10px",
  },
  feedItem: {
    margin: "5px 0",
    padding: "10px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "15px",
  },
  addButton: {
    padding: "6px 12px",
    backgroundColor: "#FFC107",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },
  selectedProductsContainer: {
    backgroundColor: "#F5F5F5",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "30px",
    textAlign: "left",
  },
  totalCaloriesContainer: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#F5F5F5",
    borderRadius: "10px",
    fontSize: "1.2rem",
  },
};

export default FeedTab;
