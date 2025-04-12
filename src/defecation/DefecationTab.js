// DiaryTab.jsx
import React, { useState, useEffect } from 'react';

function DefecationTab({ selectedDate }) {
  const [defecationData, setDefecationData] = useState([]);
  const [totalDefecation, setTotalDefecation] = useState(0);

  // 날짜를 yyyy-mm-dd 형식으로 포맷팅
  const formattedDate = selectedDate.toISOString().split('T')[0];

  // 데이터를 가져오는 useEffect 추가
  useEffect(() => {
    fetchDefecationData();
  }, [formattedDate]); // formattedDate가 변경될 때마다 데이터를 다시 가져옴

  // 배변 내역을 가져오는 함수
  const fetchDefecationData = async () => {
    const catId = 1;
    try {
      const response = await fetch(
        `http://localhost:8088/diary/defecation?catId=${catId}&date=${formattedDate}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Defecation Data:', data);
      // 시간 순으로 정렬
      data.sort((a, b) => a.time.localeCompare(b.time));
      setDefecationData(data);

      // 총 배변량 계산
      const total = data.reduce((sum, defecation) => sum + (defecation.amount || 0), 0);
      setTotalDefecation(total);
    } catch (error) {
      console.error("배변 내역을 가져오는 중 오류 발생:", error);
    }
  };

  return (
    <div className="tab-container">
      <div className="scroll-content">
        <div style={{ textAlign: 'center' }}>
          <h2 style={styles.date}>{formattedDate}</h2>
        </div>

        {/* 배변 내역 */}
        <div style={styles.recordSection}>
          <div style={styles.sectionTitle}>
            <h3>배변</h3>
          </div>
          <div style={styles.recordContent}>
            {defecationData.length > 0 ? (
              <>
                {defecationData.map((defecation, index) => (
                  <div key={index} style={styles.defecationRow}>
                    <div style={styles.rowContent}>
                      <div style={styles.defecationTime}>{defecation.time}</div>
                      <div
                        style={
                          defecation.type === "토끼똥"
                            ? styles.defecationTypeButton
                            : defecation.type === "맛동산"
                            ? styles.defecationTypeButtonBlue
                            : styles.defecationTypeButtonOrange
                        }
                      >
                        {defecation.type}
                      </div>
                      <div style={styles.defecationAmount}>
                        {defecation.amount}개
                      </div>
                    </div>
                  </div>
                ))}
                <div style={styles.totalAmount}>
                  <strong>총 {totalDefecation}개</strong>
                </div>
              </>
            ) : (
              "배변 내역이 없습니다."
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  date: {
    fontSize: '14px',
    color: '#B98C7B',
    margin: '0 auto 20px',
    fontWeight: '600',
    padding: '6px 12px',
    backgroundColor: '#FFF5F0',
    borderRadius: '8px',
    display: 'inline-block',
    textAlign: 'center'
  },
  recordSection: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#CEAD9C",
    textAlign: "left",
    borderBottom: "1px solid #CEAD9C",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordContent: {
    fontSize: "1rem",
    color: "#333333",
    marginTop: "5px",
  },
  totalAmount: {
    padding: "15px",
    textAlign: "right",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#333333",
    marginTop: "10px",
  },
  defecationRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "15px",
  },
  rowContent: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  defecationTime: {
    fontSize: "14px",
    color: "#888",
    minWidth: "40px",
  },
  defecationTypeButton: {
    width: "50px",
    height: "20px",
    display: "inline-block",
    padding: "0",
    fontSize: "10px",
    backgroundColor: "#f2f2f2",
    color: "#555",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: "20px",
    margin: "0 2px",
  },
  defecationTypeButtonBlue: {
    width: "50px",
    height: "20px",
    display: "inline-block",
    padding: "0",
    fontSize: "10px",
    backgroundColor: "#FED7C3",
    color: "#555",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: "20px",
    margin: "0 2px",
  },
  defecationTypeButtonOrange: {
    width: "50px",
    height: "20px",
    display: "inline-block",
    padding: "0",
    fontSize: "10px",
    backgroundColor: "#CCFFCC",
    color: "#555",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: "20px",
    margin: "0 2px",
  },
  defecationAmount: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#333",
    marginLeft: "5px",
  },
};

export default DefecationTab;
