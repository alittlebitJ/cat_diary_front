// DiaryTab.jsx
import React, { useState } from 'react';

function DefecationTab({ selectedDate }) {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [rabbitPoop, setRabbitPoop] = useState('');
  const [matDongSan, setMatDongSan] = useState('');
  const [potato, setPotato] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 서버로 데이터 전송
    console.log({ time: `${hours}:${minutes}`, rabbitPoop, matDongSan, potato });
  };

  const handleHoursChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '' || (parseInt(value) < 24 && value.length <= 2)) {
      setHours(value);
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '' || (parseInt(value) < 60 && value.length <= 2)) {
      setMinutes(value);
    }
  };

  return (
    <div className="tab-container">
      <div className="scroll-content">
        <div style={styles.headerRow}>
          <div style={styles.timeCell}>시간</div>
          <div style={styles.headerCell}>토끼똥</div>
          <div style={styles.headerCell}>맛동산</div>
          <div style={styles.headerCell}>감자</div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputRow}>
            <div style={styles.timeContainer}>
              <input
                type="text"
                value={hours}
                onChange={handleHoursChange}
                style={styles.timeInput}
                placeholder="00"
                maxLength={2}
                required
              />
              <span style={styles.timeSeparator}>:</span>
              <input
                type="text"
                value={minutes}
                onChange={handleMinutesChange}
                style={styles.timeInput}
                placeholder="00"
                maxLength={2}
                required
              />
            </div>

            <div style={styles.amountContainer}>
              <input
                type="number"
                value={rabbitPoop}
                onChange={(e) => setRabbitPoop(e.target.value)}
                style={styles.amountInput}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div style={styles.amountContainer}>
              <input
                type="number"
                value={matDongSan}
                onChange={(e) => setMatDongSan(e.target.value)}
                style={styles.amountInput}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div style={styles.amountContainer}>
              <input
                type="number"
                value={potato}
                onChange={(e) => setPotato(e.target.value)}
                style={styles.amountInput}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.submitButton}>
            저장
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 10px',
    borderBottom: '1px solid #F0E6E2',
    backgroundColor: '#FFF5F0',
    marginBottom: '0',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#B98C7B',
    letterSpacing: '-0.3px',
    padding: '0 6px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '0',
    '&:not(:first-child)': {
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1px',
        height: '70%',
        backgroundColor: '#F0E6E2',
      },
    },
  },
  timeCell: {
    flex: 2,
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#B98C7B',
    letterSpacing: '-0.3px',
    padding: '0 6px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '0',
  },
  form: {
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
  inputRow: {
    display: 'flex',
    gap: '0',
    marginBottom: '15px',
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 10px',
    borderBottom: '1px solid #F0E6E2',
  },
  timeContainer: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '0',
    padding: '0 6px',
    position: 'relative',
    gap: '4px',
  },
  timeInput: {
    width: '40px',
    padding: '12px',
    border: 'none',
    borderRadius: '0',
    fontSize: '13px',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
    color: '#333333',
    transition: 'border-color 0.2s ease',
    textAlign: 'center',
    outline: 'none',
    '&:focus': {
      outline: 'none',
      borderBottom: '1px solid #B98C7B',
    },
  },
  timeSeparator: {
    fontSize: '13px',
    color: '#333333',
  },
  amountContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '0',
    padding: '0 6px',
    position: 'relative',
    '&:not(:first-child)': {
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1px',
        height: '70%',
        backgroundColor: '#F0E6E2',
      },
    },
  },
  amountInput: {
    width: '60px',
    padding: '12px',
    border: 'none',
    borderRadius: '0',
    fontSize: '13px',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
    color: '#333333',
    transition: 'border-color 0.2s ease',
    textAlign: 'center',
    outline: 'none',
    '&::-webkit-inner-spin-button': {
      display: 'none',
    },
    '&::-webkit-outer-spin-button': {
      display: 'none',
    },
    '&:focus': {
      outline: 'none',
      borderBottom: '1px solid #B98C7B',
    },
  },
  unit: {
    fontSize: '13px',
    color: '#B98C7B',
    minWidth: '25px',
    fontWeight: '500',
    flexShrink: 0,
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#B98C7B',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    letterSpacing: '-0.3px',
  },
};

export default DefecationTab;
