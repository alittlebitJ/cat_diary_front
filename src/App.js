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
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
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
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    minWidth: '320px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    height: '100vh',
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
    borderBottom: '3px solid transparent',
    backgroundColor: '#FFFFFF',
    color: '#333333',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s, border-bottom 0.2s',
  },
  navButtonActive: {
    backgroundColor: '#FFFFFF',
    color: '#CEAD9C',
    borderBottom: '3px solid #CEAD9C',
  },
  calendar: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  calendarTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'rgb(206, 173, 156)',
  },
  calendarNav: {
    display: 'flex',
    gap: '10px',
  },
  calendarNavButton: {
    padding: '5px 10px',
    backgroundColor: 'rgb(206, 173, 156)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '5px',
  },
  calendarDay: {
    padding: '10px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#666',
  },
  calendarDate: {
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  calendarDateToday: {
    backgroundColor: 'rgba(206, 173, 156, 0.1)',
    color: 'rgb(206, 173, 156)',
    fontWeight: '600',
  },
  calendarDateSelected: {
    backgroundColor: 'rgb(206, 173, 156)',
    color: '#fff',
  },
  calendarDateOtherMonth: {
    color: '#ccc',
  },
};

export default App;
