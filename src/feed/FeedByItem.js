import React, { useState } from 'react';

function FeedByItem({ feedOptions }) {
  const [selectedFeedId, setSelectedFeedId] = useState(feedOptions[0]?.id || null); // 기본 선택 사료
  const [feedCount, setFeedCount] = useState(1); // 기본 개수 1로 설정

  const handleFeedChange = (event) => {
    setSelectedFeedId(event.target.value);
  };

  const handleCountChange = (event) => {
    setFeedCount(event.target.value);
  };

  const calculateCalories = () => {
    const selectedFeed = feedOptions.find(f => f.id === parseInt(selectedFeedId));
    if (selectedFeed) {
      const { name, caloriesPerUnit } = selectedFeed;

      if (!caloriesPerUnit || parseFloat(caloriesPerUnit) === 0) {
        // 개당 칼로리가 0일 경우 안내 문구 표시
        return (
          <div style={styles.feedDistribution}>
            <p>
              {name}<br />
              개당 칼로리 데이터가 없습니다.
            </p>
          </div>
        );
      }

      // 유효한 칼로리 데이터가 있을 경우 계산
      const calories = feedCount * caloriesPerUnit;
      return (
        <div style={styles.feedDistribution}>
          <p>
            {name}<br />
            개수: {feedCount}개<br />
            칼로리: {calories.toFixed(2)} kcal<br />
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.resultContainer}>
      {/* 사료 선택 */}
      <div style={styles.selectContainer}>
        <select
          id="feedSelect"
          value={selectedFeedId}
          onChange={handleFeedChange}
          style={styles.select}
        >
          {feedOptions.map(feed => (
            <option key={feed.id} value={feed.id}>
              {feed.name}
            </option>
          ))}
        </select>
      </div>

      {/* 개수 입력 */}
      <div style={styles.inputContainer}>
        <input
          type="number"
          id="feedCount"
          value={feedCount}
          onChange={handleCountChange}
          style={styles.input}
          placeholder="개수 입력"
        />
      </div>

      {/* 칼로리 계산 결과 */}
      {calculateCalories()}
    </div>
  );
}

const styles = {
  resultContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  feedDistribution: {
    backgroundColor: '#ffffff',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  selectContainer: {
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    marginTop: '8px',
    backgroundColor: '#fff',
    appearance: 'none',
    outline: 'none',
  },
  inputContainer: {
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    marginTop: '8px',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    appearance: 'none',
    outline: 'none',
  },
};

export default FeedByItem;
