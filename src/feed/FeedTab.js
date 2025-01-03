import React, { useState, useRef, useEffect } from "react";
import SelectedFeedRow from "./SelectedFeedRow"; // SelectedFeedRow 컴포넌트 추가

function FeedTab({ selectedDate }) {
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [feedOptions, setFeedOptions] = useState([]); // 서버로부터 받은 제품 리스트
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [selectedProducts, setSelectedProducts] = useState([]); // 선택된 제품들 상태
  const [totalCalories, setTotalCalories] = useState(0); // 총 섭취 칼로리

  const debounceTimer = useRef(null);

  // 서버로부터 제품 리스트 가져오기
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

  // 검색어 변경 시 서버 요청
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

  // 제품 추가
  const handleAddProduct = (product) => {
    const uniqueId = selectedProducts.length + 1;  // 배열의 길이를 이용해 인덱스 생성
    setSelectedProducts((prevSelected) => [
      ...prevSelected,
      { ...product, uniqueId, quantity: 1, unit: "g", feedingTime: "", notes: "" }, // 기본값은 "g", feedingTime, notes 추가
    ]);
  };

  // 입력값 변경 (수량, 단위, feedingTime, notes)
  const handleInputChange = (uniqueId, field, value) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.map((product) =>
        product.uniqueId === uniqueId
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

// 서버로 POST 요청 보내기
const handleSubmit = async () => {
  const mealData = selectedProducts.map((product) => ({
    catId: 1, // catId 값은 적절히 설정
    date: selectedDate,
    foodName: product.name,
    amount: product.quantity,
    category: product.type || "주식", // 기본값은 '주식'
    productType: product.foodType || "Unknown", // 기본값은 'Unknown'
    calories: product.calculatedCalories,
    feedingTime: product.feedingTime || "",
    notes: product.notes || "",
  }));

  try {
    const response = await fetch("http://localhost:8088/feed/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mealData),
    });

    if (response.ok) {
      alert("급여 정보가 성공적으로 저장되었습니다.");
      setSelectedProducts([]);
      setTotalCalories(0);
      setSearchQuery("");
      setFeedOptions([]);
    } else {
      alert("급여 정보 저장에 실패했습니다.");
    }
  } catch (error) {
    alert("서버 요청 중 오류 발생: " + error.message);
  }
};

  // 추가된 급여 내역 삭제
  const handleDeleteProduct = (uniqueId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((product) => product.uniqueId !== uniqueId)
    );
  };
  

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
          {selectedProducts.map((product) => (
            <SelectedFeedRow
              key={product.uniqueId}
              product={product}
              onQuantityChange={handleInputChange}
              onUnitChange={handleInputChange}
              onFeedingTimeChange={handleInputChange}
              onNotesChange={handleInputChange}
              onDelete={handleDeleteProduct}
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

      {/* 입력하기 버튼 */}
      <button onClick={handleSubmit} style={styles.submitButton}>
        입력하기
      </button>
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
    outline: "none",
  },
  searchInput: {
    padding: "8px",
    fontSize: "1rem",
    width: "90%",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
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
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#b98c7b",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "10px",
    marginTop: "10px",
  },
};

export default FeedTab;
