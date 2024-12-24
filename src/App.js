import React, { useState } from 'react';
import './App.css';
import WaterIntakeTab from './waterIntake/WaterIntakeTab';
import FeedTab from './feed/FeedTab';
import DiaryTab from './diary/DiaryTab'; // 일기
import DefecationTab from './defecation/DefecationTab'; // 배변활동
import HospitalTab from './hospital/HospitalTab'; // 병원
import PlayTab from './play/PlayTab'; // 사냥놀이
import WeekCalendar from './components/Calendar';
import './global.css';

function App() {
  const [activeTab, setActiveTab] = useState('diary');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Calendar에서 선택된 날짜 상태 관리

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate); // 날짜 변경 시 상태 업데이트
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <WeekCalendar onDateChange={handleDateChange} selectedDate={selectedDate} />
        <nav style={styles.nav}>
          {[ 
            { key: 'diary', label: '일기' },
            { key: 'feed', label: '급여' },
            { key: 'waterIntake', label: '음수' },
            { key: 'defecation', label: '배변' },
            { key: 'play', label: '놀이' },
            { key: 'hospital', label: '병원' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                ...styles.navButton,
                ...(activeTab === tab.key ? styles.navButtonActive : {}),
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {activeTab === 'diary' && <DiaryTab selectedDate={selectedDate} />} 
      {activeTab === 'feed' && <FeedTab selectedDate={selectedDate} />} 
      {activeTab === 'waterIntake' && <WaterIntakeTab selectedDate={selectedDate} />} 
      {activeTab === 'defecation' && <DefecationTab selectedDate={selectedDate} />} 
      {activeTab === 'play' && <PlayTab selectedDate={selectedDate} />} 
      {activeTab === 'hospital' && <HospitalTab selectedDate={selectedDate} />} 
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'sans-serif',
    backgroundColor: '#F9FAFB',
    minHeight: '100vh',
    padding: '20px',
    minWidth: '320px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    width: '100%',
    boxSizing: 'border-box',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  navButton: {
    flex: 1,
    padding: '15px 0',
    border: 'none',
    backgroundColor: '#FFFFFF',
    color: '#333333',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
  },
  navButtonActive: {
    backgroundColor: '#FFFFFF',
    color: '#CEAD9C',
    borderBottom: '3px solid #CEAD9C',
  },
};

export default App;
