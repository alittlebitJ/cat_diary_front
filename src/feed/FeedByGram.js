import React, { useState } from 'react';

function FeedByGram({ feedOptions, weight }) {
  const [isMultipleFeeds, setIsMultipleFeeds] = useState(false); // 다중 사료 급여 체크 상태
  const [inputMode, setInputMode] = useState('ratio'); // 입력 모드: 'ratio' 또는 'weight'
  const [feedDetails, setFeedDetails] = useState([
    { feedId: feedOptions[0]?.id || null, ratio: isMultipleFeeds ? '' : '100', weight: '' }, // 기본 설정
  ]);
  const [totalWeight, setTotalWeight] = useState(weight); // 총 그람수

  const handleFeedChange = (event, index) => {
    const updatedFeeds = [...feedDetails];
    updatedFeeds[index].feedId = event.target.value;
    setFeedDetails(updatedFeeds);
  };

  const handleRatioChange = (event, index) => {
    const updatedFeeds = [...feedDetails];
    updatedFeeds[index].ratio = event.target.value;
    setFeedDetails(updatedFeeds);
  };

  const handleWeightChange = (event, index) => {
    const updatedFeeds = [...feedDetails];
    updatedFeeds[index].weight = event.target.value;
    setFeedDetails(updatedFeeds);
  };

  const handleTotalWeightChange = (event) => {
    setTotalWeight(event.target.value);
  };

  const handleAddFeed = () => {
    setFeedDetails([
      ...feedDetails,
      { feedId: feedOptions[0]?.id || null, ratio: '', weight: '' }, // 새로운 사료 추가
    ]);
  };

  const handleDeleteFeed = (index) => {
    const updatedFeeds = feedDetails.filter((_, i) => i !== index);
    setFeedDetails(updatedFeeds);
  };

  const handleCheckboxChange = () => {
    setIsMultipleFeeds(!isMultipleFeeds);
  };

  const handleInputModeChange = (event) => {
    setInputMode(event.target.value);
    setFeedDetails(feedDetails.map(feed => ({ ...feed, ratio: '', weight: '' }))); // 입력값 초기화
  };

  const calculateFeedDistribution = () => {
    if (!isMultipleFeeds) {
      const selectedFeedData = feedOptions.find(f => f.id === parseInt(feedDetails[0].feedId));
      if (selectedFeedData) {
        const feedWeight =
          inputMode === 'ratio'
            ? (parseFloat(feedDetails[0].ratio) / 100) * totalWeight
            : parseFloat(feedDetails[0].weight || 0);

        const calories = feedWeight * (selectedFeedData.caloriePerGram || 0);
        return (
          <div style={styles.feedDistribution}>
            <p>
              {selectedFeedData.name}<br />
              분배량: {feedWeight.toFixed(2)}g<br />
              칼로리: {calories.toFixed(2)} kcal<br />
            </p>
          </div>
        );
      }
    } else {
      return feedDetails.map((feed, index) => {
        const selectedFeedData = feedOptions.find(f => f.id === parseInt(feed.feedId));
        if (selectedFeedData) {
          const feedWeight =
            inputMode === 'ratio'
              ? (parseFloat(feed.ratio) / feedDetails.reduce((total, f) => total + parseFloat(f.ratio || 0), 0)) *
                totalWeight
              : parseFloat(feed.weight || 0);

          const calories = feedWeight * (selectedFeedData.caloriePerGram || 0);
          return (
            <div key={index} style={styles.feedDistribution}>
              <p>
                {selectedFeedData.name}<br />
                분배량: {feedWeight.toFixed(2)}g<br />
                칼로리: {calories.toFixed(2)} kcal<br />
              </p>
            </div>
          );
        }
        return null;
      });
    }
  };

  return (
    <div style={styles.resultContainer}>
      {/* 다중 사료 급여 체크박스 */}
      <div style={styles.checkboxContainer}>
        <label htmlFor="multipleFeeds" style={styles.checkboxLabel}>다중 사료 급여</label>
        <input
          type="checkbox"
          id="multipleFeeds"
          checked={isMultipleFeeds}
          onChange={handleCheckboxChange}
          style={styles.checkbox}
        />
      </div>

      {/* 입력 모드 선택 */}
      {isMultipleFeeds && (
        <div style={styles.inputModeContainer}>
          <label>
            <input
              type="radio"
              value="ratio"
              checked={inputMode === 'ratio'}
              onChange={handleInputModeChange}
            />
            비율로 입력
          </label>
          <label>
            <input
              type="radio"
              value="weight"
              checked={inputMode === 'weight'}
              onChange={handleInputModeChange}
            />
            그람으로 입력
          </label>
        </div>
      )}

      {/* 사료 선택 및 입력 */}
      {feedDetails.map((feed, index) => (
        <div key={index} style={styles.feedInputContainer}>
          <div style={styles.selectContainer}>
            <select
              id={`feedSelect-${index}`}
              value={feed.feedId}
              onChange={(e) => handleFeedChange(e, index)}
              style={styles.select}
            >
              {feedOptions.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {inputMode === 'ratio' ? (
            <input
              type="number"
              value={feed.ratio}
              onChange={(e) => handleRatioChange(e, index)}
              style={styles.input}
              placeholder="비율 입력"
            />
          ) : (
            <input
              type="number"
              value={feed.weight}
              onChange={(e) => handleWeightChange(e, index)}
              style={styles.input}
              placeholder="그람 입력"
            />
          )}

          {index > 0 && (
            <button onClick={() => handleDeleteFeed(index)} style={styles.deleteButton}>
              삭제
            </button>
          )}
        </div>
      ))}

      {isMultipleFeeds && (
        <button onClick={handleAddFeed} style={styles.addButton}>
          사료 추가
        </button>
      )}

      <div style={styles.totalGram}>
        <input
          type="number"
          id="totalWeight"
          value={totalWeight}
          onChange={handleTotalWeightChange}
          style={styles.input}
          placeholder="총 그람수 입력"
        />
      </div>

      {calculateFeedDistribution()}
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
  subtitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333',
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
  selectLabel: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#333',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    marginTop: '8px',
    backgroundColor: '#fff',
    appearance: 'none', // 기본 화살표 없애기
    '-webkit-appearance': 'none', // Safari, Chrome
    '-moz-appearance': 'none', // Firefox
    backgroundImage: 'none', // 배경 화살표도 없애기
    outline: 'none', // 클릭 시 외곽선 없애기
  },
  inputContainer: {
    marginBottom: '10px'
  },
  
  totalGram: {
    marginTop: '10px',
    marginBottom: '10px'
  },

  inputLabel: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%', // 입력 필드가 부모 컨테이너 크기에 맞게
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    marginTop: '8px',
    backgroundColor: '#fff',
    boxSizing: 'border-box', // padding 포함하여 크기 계산
    appearance: 'none', // 화살표 없애기
    '-webkit-appearance': 'none', // Safari, Chrome
    '-moz-appearance': 'textfield', // Firefox
    outline: 'none',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  checkboxLabel: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#333',
    marginRight: '10px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
  },
  addButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    marginTop: '10px',
  },

  feedInputContainer: {
    marginBottom: '20px',
    border: '1px solid #ccc', // 경계선 추가
    padding: '10px', // 경계선 내 여백
    borderRadius: '8px',
    width: '100%', // 부모 컨테이너 크기에 맞게
    boxSizing: 'border-box', // padding 포함하여 크기 계산
  },
  
};

export default FeedByGram;
