import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

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
  setViewMonth(false); // 날짜 선택 시 자동으로 달력 닫기
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

  const weekDates = getWeekDays(weekStart);

  const handlePrevWeek = () => {
    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(weekStart.getDate() - 7);
    setDate(prevWeekStart);
  };

  const handleNextWeek = () => {
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(weekStart.getDate() + 7);
    setDate(nextWeekStart);
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  return (
    <>
      <div style={styles.weekContainer}>
        <div style={styles.weekContent}>
          <button 
            style={styles.navButton}
            onClick={handlePrevWeek}
          >
            &lt;
          </button>
          {weekDays.map((day, index) => (
            <div
              key={index} 
              style={{
                  ...styles.day, 
                  ...(isToday(day) ? styles['todayTile'] : {}),
                  ...(isSelected(day) ? styles['selectedTile'] : {}),
                  cursor: 'pointer'
              }}
              onClick={() => handleDateChange(day)}
            >
              <div>{day.getDate()}</div>
            </div>
          ))}
          <button 
            style={styles.navButton}
            onClick={handleNextWeek}
          >
            &gt;
          </button>
        </div>
      </div>

      <button onClick={handleViewToggle} style={styles.toggleButton}>
        {viewMonth ? '주간뷰' : '월간뷰'}
      </button>

      {viewMonth && (
        <div style={styles.monthViewContainer}>
          <Calendar
            onChange={handleDateChange}
            value={date}
            locale="ko-KR"
            showNeighboringMonth={false}
            view="month"
            tileClassName={tileClassName}
            className="custom-calendar"
            formatDay={(locale, date) => date.getDate()}
          />
        </div>
      )}
    </>
  );
};

const styles = {
  weekContainer: {
    width: '100%',
    backgroundColor: 'rgba(206, 173, 156, 0.1)',
    borderRadius: '8px',
    padding: '10px 20px',
    boxSizing: 'border-box',
  },
  weekContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    gap: '5px',
  },
  navButton: {
    padding: '7px',
    backgroundColor: '#fff',
    color: 'rgb(206, 173, 156)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
  },
  day: {
    flex: 1,
    padding: '7px',
    backgroundColor: '#fff',
    color: 'rgb(206, 173, 156)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    margin: '10px 20px',
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer',
    backgroundColor: 'rgb(206, 173, 156)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  monthViewContainer: {
    marginBottom: '10px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: '16px',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
  },
  monthHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  monthTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333333',
  },
  monthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
  },
  dayHeader: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#B98C7B',
    fontWeight: '500',
    padding: '8px 0',
  },
  dayCell: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  todayTile: {
    backgroundColor: 'rgba(206, 173, 156, 0.1)',
    color: 'rgb(206, 173, 156)',
    fontWeight: '600',
  },
  selectedTile: {
    backgroundColor: 'rgb(206, 173, 156)',
    color: '#fff',
  }
};

// 월간뷰 달력 커스텀 스타일
const customCalendarStyles = `
  .custom-calendar {
    width: 100%;
    border: none;
    border-radius: 8px;
  }
  .custom-calendar .react-calendar__navigation {
    margin-bottom: 10px;
  }
  .custom-calendar .react-calendar__navigation button {
    color: rgb(206, 173, 156);
    min-width: 30px;
    background: none;
    font-size: 14px;
  }
  .custom-calendar .react-calendar__navigation button:enabled:hover,
  .custom-calendar .react-calendar__navigation button:enabled:focus {
    background-color: rgba(206, 173, 156, 0.1);
  }
  .custom-calendar .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: none;
    font-size: 13px;
    color: rgb(206, 173, 156);
  }
  .custom-calendar .react-calendar__tile {
    padding: 10px;
    color: rgb(206, 173, 156);
    background: #fff;
    border-radius: 8px;
  }
  .custom-calendar .react-calendar__tile:enabled:hover,
  .custom-calendar .react-calendar__tile:enabled:focus {
    background: rgba(206, 173, 156, 0.1);
  }
  .custom-calendar .react-calendar__tile--now {
    background: rgba(206, 173, 156, 0.1);
    color: rgb(206, 173, 156);
    font-weight: 600;
  }
  .custom-calendar .react-calendar__tile--active {
    background: rgb(206, 173, 156);
    color: #fff;
  }
  .custom-calendar .react-calendar__tile abbr {
    text-decoration: none;
  }
`;

// 스타일을 문서에 추가
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = customCalendarStyles;
document.head.appendChild(styleSheet);

export default WeekCalendar;
