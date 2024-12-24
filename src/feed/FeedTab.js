import React, { useState, useEffect } from "react";
import FeedRow from "./FeedRow";

function FeedTab() {
  const [feedRatios, setFeedRatios] = useState([
    {
      type: "주식",
      feedId: "",
      amount: "100",
      mode: "perGram",
      feedOptions: []
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeedOptions = async (type, index) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8088/feed/nutrition/category?type=${type}`
      );
      if (!response.ok) {
        throw new Error("사료 데이터를 가져오는 데 실패했습니다.");
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

      setFeedRatios(prevFeedRatios => {
        const newFeedRatios = [...prevFeedRatios];
        if (newFeedRatios[index]) {
          newFeedRatios[index] = {
            ...newFeedRatios[index],
            feedOptions: sortedData
          };
        }
        return newFeedRatios;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedOptions("주식", 0);
  }, []);

  const handleTypeChange = (e, index) => {
    const newType = e.target.value;
    setFeedRatios(prevFeedRatios => {
      const newFeedRatios = [...prevFeedRatios];
      newFeedRatios[index] = {
        ...newFeedRatios[index],
        type: newType,
        feedId: ""
      };
      return newFeedRatios;
    });
    fetchFeedOptions(newType, index);
  };

  const handleFeedSelectChange = (e, index) => {
    setFeedRatios(prevFeedRatios => {
      const newFeedRatios = [...prevFeedRatios];
      newFeedRatios[index] = { 
        ...newFeedRatios[index], 
        feedId: e.target.value 
      };
      return newFeedRatios;
    });
  };

  const handleInputChange = (e, index) => {
    setFeedRatios(prevFeedRatios => {
      const newFeedRatios = [...prevFeedRatios];
      newFeedRatios[index] = { 
        ...newFeedRatios[index], 
        amount: e.target.value 
      };
      return newFeedRatios;
    });
  };

  const handleModeChange = (e, index) => {
    setFeedRatios(prevFeedRatios => {
      const newFeedRatios = [...prevFeedRatios];
      newFeedRatios[index] = { 
        ...newFeedRatios[index], 
        mode: e.target.value 
      };
      return newFeedRatios;
    });
  };

  const addFeedSelectField = () => {
    const newFeedRatio = {
      type: "주식",
      feedId: "",
      amount: "100",
      mode: "perGram",
      feedOptions: []
    };
    
    setFeedRatios(prevFeedRatios => [...prevFeedRatios, newFeedRatio]);
    
    // setFeedRatios가 완료된 후에 fetchFeedOptions 호출
    setTimeout(() => {
      fetchFeedOptions("주식", feedRatios.length);
    }, 0);
  };

  const removeFeedSelectField = (index) => {
    setFeedRatios(prevFeedRatios => 
      prevFeedRatios.filter((_, i) => i !== index)
    );
  };

  return (
    <div style={styles.container}>
      {loading && <p style={styles.loading}>데이터 로딩 중...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <div>
          {feedRatios.map((feedRatio, index) => (
            <FeedRow
              key={index}
              index={index}
              feedRatio={feedRatio}
              handleTypeChange={handleTypeChange}
              handleFeedSelectChange={handleFeedSelectChange}
              handleModeChange={handleModeChange}
              handleInputChange={handleInputChange}
              removeFeedSelectField={removeFeedSelectField}
            />
          ))}
          <button onClick={addFeedSelectField} style={styles.addButton}>
            +
          </button>
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
  addButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#FFC107",
    color: "#FFFFFF",
    border: "none",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginBottom: "20px",
  },
  loading: {
    fontSize: "1.2rem",
    color: "#999",
  },
  error: {
    fontSize: "1.2rem",
    color: "#FF5733",
  },
};

export default FeedTab;