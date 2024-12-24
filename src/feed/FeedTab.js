// FeedTab.js
import React, { useState, useEffect } from 'react';
import FeedByGram from './FeedByGram.js';
import FeedByItem from './FeedByItem.js';

function FeedTab() {
  const [feedOptions, setFeedOptions] = useState([]);
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedRatios, setFeedRatios] = useState([]);
  const [calorieMode, setCalorieMode] = useState('perGram');
  const [activeTab, setActiveTab] = useState('perGram');

  useEffect(() => {
    const fetchFeedOptions = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8088/feed/nutrition');
        if (!response.ok) {
          throw new Error('사료 데이터를 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        // name 기준으로 정렬
        const sortedData = data.sort((a, b) => {
          const nameA = a.name.toUpperCase(); // 대소문자 구분 없이 비교
          const nameB = b.name.toUpperCase();
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });
        setFeedOptions(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedOptions();
  }, []);

  const handleSelectChange = (e, index) => {
    const newFeedRatios = [...feedRatios];
    newFeedRatios[index] = { ...newFeedRatios[index], feedId: e.target.value };
    setFeedRatios(newFeedRatios);
  };

  const handleRatioChange = (e, index) => {
    const newFeedRatios = [...feedRatios];
    newFeedRatios[index] = { ...newFeedRatios[index], ratio: e.target.value };
    setFeedRatios(newFeedRatios);
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const addFeedSelectField = () => {
    setFeedRatios([...feedRatios, { feedId: '', ratio: '' }]);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>급여량</h2>
      {loading && <p style={styles.loading}>데이터 로딩 중...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={styles.tabContainer}>
            <button
              onClick={() => handleTabChange('perGram')}
              style={activeTab === 'perGram' ? styles.activeTab : styles.tabButton}
            >
              그람별 계산
            </button>
            <button
              onClick={() => handleTabChange('perItem')}
              style={activeTab === 'perItem' ? styles.activeTab : styles.tabButton}
            >
              개당 계산
            </button>
          </div>

          
          {activeTab === 'perGram' && (
            <FeedByGram
              feedOptions={feedOptions}
              feedRatios={feedRatios}
              weight={weight}
            />
          )}

          {activeTab === 'perItem' && (
            <FeedByItem
              feedOptions={feedOptions}
              feedRatios={feedRatios}
            />
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFFFFF',
    fontFamily: 'sans-serif',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333333',
  },
  subtitle: {
    fontSize: '1.2rem',
    fontWeight: '500',
    marginBottom: '15px',
    color: '#333333',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  tabButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#EAEAEA',
    color: '#333',
    border: '1px solid #EAEAEA',
    borderRadius: '8px',
    cursor: 'pointer',
    margin: '0 5px',
  },
  activeTab: {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#005FCC',
    color: '#FFFFFF',
    border: '1px solid #005FCC',
    borderRadius: '8px',
    cursor: 'pointer',
    margin: '0 5px',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #EAEAEA',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #EAEAEA',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  addButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#FFC107',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginBottom: '20px',
  },
  feedRatioContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '15px',
  },
  feedDistribution: {
    marginBottom: '10px',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#333333',
  },
};

export default FeedTab;
