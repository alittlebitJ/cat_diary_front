import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const WeekCalendar = ({ onDateChange, selectedDate }) => {
  const [date, setDate] = useState(new Date());
  const [viewMonth, setViewMonth] = useState(false); // 월간뷰 표시 여부

  useEffect(() => {
    if (selectedDate) {
      const adjustedDate = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())); // UTC 변환
      setDate(adjustedDate);
    }
  }, [selectedDate]);
  

  // 한 주의 시작일 계산 (월요일 기준)
  const startOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day; // 일요일은 0, 월요일은 1이기 때문에 조정
    start.setDate(start.getDate() + diff);
    return start;
  };

  // 한 주의 끝일 계산
  const endOfWeek = (start) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // 시작일에 6일을 더해서 끝일 계산
    return end;
  };

  // 한 주의 날짜 배열을 생성
  const getWeekDays = (start) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

// 날짜 변경 시 처리
const handleDateChange = (newDate) => {
  const adjustedDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())); // UTC로 변환
  console.log('Selected Date (UTC adjusted):', adjustedDate);
  setDate(adjustedDate);
  onDateChange(adjustedDate); // UTC로 조정된 날짜 전달
};

  // 월간뷰 전환 버튼 클릭 시
  const handleViewToggle = () => {
    setViewMonth((prev) => !prev);
  };

  const weekStart = startOfWeek(date);
  const weekDays = getWeekDays(weekStart);

  // 오늘 날짜와 비교하여 스타일을 적용하는 함수
  const isToday = (date) => {
    const today = new Date();
    return today.getDate() === date.getDate() &&
           today.getMonth() === date.getMonth() &&
           today.getFullYear() === date.getFullYear();
  };

  // 선택된 날짜와 비교하여 스타일을 적용하는 함수
  const isSelected = (day) => {
    return day.getDate() === date.getDate() &&
           day.getMonth() === date.getMonth() &&
           day.getFullYear() === date.getFullYear();
  };

  // 오늘 날짜에 다른 클래스명 추가
  const tileClassName = ({ date, view }) => {
    if (isToday(date)) {
      return 'todayTile'; // 오늘 날짜에 적용할 클래스
    }
    return '';
  };

  return (
    <div style={styles.container}>
      <div style={styles.weekContainer}>
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            style={{
                ...styles.day, 
                ...(isToday(day) ? styles['todayTile'] : {}),
                ...(isSelected(day) ? styles['selectedTile'] : {}),
                cursor: 'pointer'
            }}
            onClick={() => handleDateChange(day)} // 주간 뷰에서 날짜를 클릭하면 해당 날짜로 변경
          >
            <div>{day.getDate()}</div>
          </div>
        ))}
      </div>

      {/* 월간뷰 전환 버튼 */}
      <button onClick={handleViewToggle} style={styles.toggleButton}>
        {viewMonth ? '▲' : '▼'}
      </button>

      {/* 월간뷰가 활성화되었을 때만 보여줌 */}
      {viewMonth && (
        <Calendar
          onChange={handleDateChange}
          value={date}  // 월간 뷰에서도 선택된 날짜를 반영
          locale="ko-KR"
          showNeighboringMonth={false} // 이웃 월 보이지 않게 설정
          view="month" // 달력은 월간뷰로 설정
          tileClassName={tileClassName} // 오늘 날짜에 스타일 적용
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  weekContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '10px',
    backgroundColor: '#F5F5F5',
    borderRadius: '5px',
  },
  day: {
    margin: '5px',
    padding: '7px',
    backgroundColor: '#EEE5D9',
    color: '#B98C7B',
    borderRadius: '5px',
  },
  toggleButton: {
    marginTop: '1px',
    padding: '5px 10px',
    fontSize: '0.7rem',
    cursor: 'pointer',
    backgroundColor: '#EEE5D9',
    color: '#B98C7B',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  todayTile: {
    backgroundColor: '#EEE5D9',  // 배경색은 그대로
    color: '#B98C7B',
    fontWeight: 'bold',
  },
  selectedTile: {
    backgroundColor: '#B98C7B', // 선택된 날짜 배경색
    color: '#EEE5D9', // 선택된 날짜 텍스트 색
  }
};

export default WeekCalendar;
