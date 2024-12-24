import React, { useState, useEffect } from 'react';

function DiaryTab({ selectedDate, feedData, defecationData, playData, hospitalData }) {
  const [memo, setMemo] = useState('');
  const [waterIntakeData, setWaterIntakeData] = useState([]);

  // 메모 변경 시 처리
  const handleMemoChange = (event) => {
    setMemo(event.target.value);
  };

  // 날짜를 yyyy-mm-dd 형식으로 포맷팅
  const formattedDate = selectedDate.toISOString().split('T')[0];

  // 음수 내역을 가져오는 함수
  const fetchWaterIntakeData = async () => {
    const catId = 1;
    const date = formattedDate;
    try {
      const response = await fetch(`http://localhost:8088/diary/waterIntake?catId=${catId}&date=${date}`);
      const data = await response.json();
      // intake_id가 적은 순서대로 정렬
      data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      setWaterIntakeData(data);
    } catch (error) {
      console.error('음수 내역을 가져오는 중 오류 발생:', error);
    }
  };

  // 컴포넌트 마운트 시 음수 내역을 가져옵니다.
  useEffect(() => {
    fetchWaterIntakeData();
  }, [selectedDate]);

  // 음수 내역의 총합 계산
  const totalAmount = waterIntakeData.reduce((sum, intake) => sum + intake.amount, 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.date}>{formattedDate}</h2>
      
      {/* 급여 내역 */}
      <div style={styles.recordSection}>
        <h3 style={styles.sectionTitle}>급여</h3>
        <div style={styles.recordContent}>
          {feedData ? feedData : '급여 내역이 없습니다.'}
        </div>
      </div>

      {/* 음수 내역 */}
      <div style={styles.recordSection}>
        <h3 style={styles.sectionTitle}>음수</h3>
        <div style={styles.recordContent}>
          {waterIntakeData.length > 0 ? (
            <>
              {waterIntakeData.map((intake, index) => (
                <div key={index}>
                  {intake.amount} {intake.unit}
                </div>
              ))}
              <hr style={styles.separator} />
              <div style={styles.totalAmount}>
                <strong>총 합: {totalAmount} g</strong>
              </div>
            </>
          ) : (
            '음수 내역이 없습니다.'
          )}
        </div>
      </div>

      {/* 배변 내역 */}
      <div style={styles.recordSection}>
        <h3 style={styles.sectionTitle}>배변</h3>
        <div style={styles.recordContent}>
          {defecationData ? defecationData : '배변 내역이 없습니다.'}
        </div>
      </div>

      {/* 놀이 내역 */}
      <div style={styles.recordSection}>
        <h3 style={styles.sectionTitle}>놀이</h3>
        <div style={styles.recordContent}>
          {playData ? playData : '놀이 내역이 없습니다.'}
        </div>
      </div>

      {/* 병원 내역 */}
      <div style={styles.recordSection}>
        <h3 style={styles.sectionTitle}>병원</h3>
        <div style={styles.recordContent}>
          {hospitalData ? hospitalData : '병원 내역이 없습니다.'}
        </div>
      </div>

      {/* 메모 입력란 */}
      <div style={styles.memoSection}>
        <h3 style={styles.sectionTitle}>메모</h3>
        <textarea
          value={memo}
          onChange={handleMemoChange}
          placeholder="오늘의 추가 메모를 입력하세요."
          style={styles.memoInput}
        />
      </div>
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
  date: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#B98C7B',
    marginBottom: '20px',
  },
  recordSection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#CEAD9C',
    textAlign: 'left',
    borderBottom: '1px solid #CEAD9C'
  },
  recordContent: {
    fontSize: '1rem',
    color: '#333333',
    marginTop: '5px',
    paddingLeft: '10px',
  },
  separator: {
    marginTop: '10px',
    borderTop: '1px solid #CEAD9C',
    marginBottom: '10px',
  },
  totalAmount: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333333',
    marginTop: '10px',
  },
  memoSection: {
    marginTop: '30px',
  },
  memoInput: {
    width: '100%',
    height: '100px',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #EAEAEA',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
  },
};

export default DiaryTab;
