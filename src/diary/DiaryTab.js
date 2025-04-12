import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2"; // 차트 컴포넌트 임포트
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js"; // 차트 라이브러리 설정
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

function DiaryTab({ selectedDate, playData, hospitalData }) {
  const [memo, setMemo] = useState("");
  const [waterIntakeData, setWaterIntakeData] = useState([]);
  const [mealData, setMealData] = useState([]); // 급여 내역을 저장할 상태 추가
  const [totalCalories, setTotalCalories] = useState(0); // 총 칼로리 상태 추가
  const [chartData, setChartData] = useState(null); // 차트 데이터 상태 추가
  const [isChartVisible, setIsChartVisible] = useState(false); // 차트 표시 여부 상태 추가
  const [waterIntakeChartData, setWaterIntakeChartData] = useState(null);
  const [isWaterIntakeChartVisible, setIsWaterIntakeChartVisible] = useState(false);
  const [totalDefecation, setTotalDefecation] = useState(0); // 총 배변량 상태 추가

  // 날짜를 yyyy-mm-dd 형식으로 포맷팅
  const formattedDate = selectedDate.toISOString().split('T')[0];

  // 데이터를 가져오는 useEffect 추가
  useEffect(() => {
    fetchWaterIntakeData();
    fetchMealData();
  }, [formattedDate]); // formattedDate가 변경될 때마다 데이터를 다시 가져옴

  // 메모 변경 시 처리
  const handleMemoChange = (event) => {
    setMemo(event.target.value);
  };

  // 음수 내역을 가져오는 함수
  const fetchWaterIntakeData = async () => {
    const catId = 1;
    try {
      const response = await fetch(
        `http://localhost:8088/diary/waterIntake?catId=${catId}&date=${formattedDate}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Water Intake Data:', data); // 디버깅을 위한 로그 추가
      // intake_id가 적은 순서대로 정렬
      data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      setWaterIntakeData(data);
    } catch (error) {
      console.error("음수 내역을 가져오는 중 오류 발생:", error);
    }
  };

  // 급여 내역을 가져오는 함수
  const fetchMealData = async () => {
    const catId = 1;
    try {
      const response = await fetch(
        `http://localhost:8088/diary/meals?catId=${catId}&date=${formattedDate}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Meal Data:', data); // 디버깅을 위한 로그 추가

      // 급여 내역을 feedingTime 순으로 정렬
      data.sort((a, b) => a.feedingTime.localeCompare(b.feedingTime));

      setMealData(data);

      // 총 칼로리 계산
      const total = data.reduce((sum, meal) => sum + (meal.calories || 0), 0);
      setTotalCalories(total);
    } catch (error) {
      console.error("급여 내역을 가져오는 중 오류 발생:", error);
    }
  };

  const fetchWeeklyMealData = async () => {
    const catId = 1;
    const date = formattedDate;
    const today = new Date();
    try {
      const response = await fetch(
        `http://localhost:8088/diary/meals/7days?catId=${catId}&date=${date}`
      );
      const data = await response.json();

      // 7일 전부터 오늘까지의 날짜 배열 생성
      const allDates = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(selectedDate);
        day.setDate(day.getDate() - i);
        allDates.push(day.toISOString().split("T")[0]); // yyyy-mm-dd 형식으로 저장
      }

      // 데이터 날짜에 맞춰 칼로리 합산
      const dailyCalories = allDates.map((day) => {
        const dayData = data.find((d) => Object.keys(d)[0] === day);
        if (dayData) {
          // 해당 날짜의 음식을 찾아 칼로리 합산
          return Object.values(dayData)[0].reduce(
            (sum, meal) => sum + (meal.calories || 0),
            0
          );
        } else {
          return 0; // 해당 날짜에 데이터가 없다면 0
        }
      });

      // 차트 데이터 생성
      setChartData({
        labels: allDates.map((dateStr) => {
          const date = new Date(dateStr);
          return `${date.getMonth() + 1}.${date.getDate()}`; // '12.23' 형식으로 날짜 변경
        }),
        datasets: [
          {
            label: "",
            data: dailyCalories,
            fill: false,
            borderColor: "rgb(185, 140, 123)",
            borderWidth: 2,
            tension: 0.1,
            pointBackgroundColor: "rgb(185, 140, 123)",
            pointBorderColor: "rgb(185, 140, 123)",
            pointBorderWidth: 2,
            pointRadius: 5,
          },
        ],
        options: {
          plugins: {
            tooltip: {
              enabled: false, // 툴크 숨기기
            },
          },
          scales: {
            x: {
              ticks: {
                display: true, // x축의 단위 (kcal)만 표시
              },
            },
            y: {
              ticks: {
                display: false, // y축 라벨 숨기기
              },
            },
          },
        },
      });
      setIsChartVisible(true);
    } catch (error) {
      console.error("주간 급여 내역을 가져오는 중 오류 발생:", error);
    }
  };

  // 주간 음수량 데이터 가져오기
  const fetchWeeklyWaterIntake = async () => {
    const catId = 1;
    const date = formattedDate;
    try {
      const response = await fetch(
        `http://localhost:8088/diary/waterIntake/7days?catId=${catId}&date=${date}`
      );
      const data = await response.json();

      // 7일 전부터 오늘까지의 날짜 배열 생성
      const allDates = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(selectedDate);
        day.setDate(day.getDate() - i);
        allDates.push(day.toISOString().split('T')[0]);
      }

      // 데이터 날짜에 맞춰 음수량 합산
      const dailyWaterIntake = allDates.map((day) => {
        const dayData = data.find((d) => Object.keys(d)[0] === day);
        if (dayData) {
          return Object.values(dayData)[0].reduce(
            (sum, intake) => sum + (intake.amount || 0),
            0
          );
        } else {
          return 0;
        }
      });

      // 차트 데이터 생성
      setWaterIntakeChartData({
        labels: allDates.map((dateStr) => {
          const date = new Date(dateStr);
          return `${date.getMonth() + 1}.${date.getDate()}`;
        }),
        datasets: [
          {
            label: '',
            data: dailyWaterIntake,
            fill: false,
            borderColor: 'rgb(185, 140, 123)',
            borderWidth: 2,
            tension: 0.1,
            pointBackgroundColor: 'rgb(185, 140, 123)',
            pointBorderColor: 'rgb(185, 140, 123)',
            pointBorderWidth: 2,
            pointRadius: 5,
          },
        ],
        options: {
          plugins: {
            tooltip: {
              enabled: false,
            },
          },
          scales: {
            x: {
              ticks: {
                display: true,
              },
            },
            y: {
              ticks: {
                display: false,
              },
            },
          },
        },
      });
      setIsWaterIntakeChartVisible(true);
    } catch (error) {
      console.error('주간 음수량 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  // 음수 내역의 총합 계산
  const totalAmount = waterIntakeData.reduce(
    (sum, intake) => sum + intake.amount,
    0
  );

  // 차트보기 버튼 클릭 시 주간 데이터 가져오기
  const handleChartButtonClick = async (type) => {
    if (type === 'meal') {
      if (!isChartVisible) {
        await fetchWeeklyMealData();
      }
      setIsChartVisible(!isChartVisible);
    } else if (type === 'water') {
      if (!isWaterIntakeChartVisible) {
        await fetchWeeklyWaterIntake();
      }
      setIsWaterIntakeChartVisible(!isWaterIntakeChartVisible);
    }
  };

  return (
    <div className="tab-container">
      <div className="scroll-content">
        <div style={{ textAlign: 'center' }}>
          <h2 style={styles.date}>{formattedDate}</h2>
        </div>

        {/* 급여 내역 */}
        <div style={styles.recordSection}>
          <div style={styles.sectionTitle}>
            <h3>급여</h3>
            <button
              onClick={() => handleChartButtonClick('meal')}
              style={styles.chartButton}
            >
              {isChartVisible ? "닫기" : "차트보기"}
            </button>
          </div>
          <div style={styles.recordContent}>
            {isChartVisible ? (
              <div style={styles.chartContainer}>
                {chartData && <Line data={chartData} />}
              </div>
            ) : mealData.length > 0 ? (
              <>
                {mealData.map((meal, index) => (
                  <div key={index} style={styles.feedRowContainer}>
                    <div style={styles.feedRow}>
                      <div style={styles.rowContent}>
                        <div style={styles.feedingTime}>{meal.feedingTime}</div>
                        <div
                          style={
                            meal.category === "간식"
                              ? styles.categoryButtonBlue
                              : meal.category === "주식"
                              ? styles.categoryButtonOrange
                              : styles.categoryButton
                          }
                        >
                          {meal.category}
                        </div>
                        <div style={styles.productType}>{meal.productType}</div>
                        <strong style={styles.foodName}>{meal.foodName}</strong>
                      </div>
                      <div style={styles.amountCalories}>
                        {meal.amount} g / {meal.calories} kcal
                      </div>
                      {meal.notes && <em style={styles.notes}>{meal.notes}</em>}
                    </div>
                  </div>
                ))}
                <div style={styles.totalAmount}>
                  <strong>{totalCalories.toFixed(2)} kcal</strong>
                </div>
              </>
            ) : (
              "급여 내역이 없습니다."
            )}
          </div>
        </div>

        {/* 음수 내역 */}
        <div style={styles.recordSection}>
          <div style={styles.sectionTitle}>
            <h3>음수</h3>
            <button
              onClick={() => handleChartButtonClick('water')}
              style={styles.chartButton}
            >
              {isWaterIntakeChartVisible ? '닫기' : '차트보기'}
            </button>
          </div>
          {isWaterIntakeChartVisible ? (
            <div style={styles.chartContainer}>
              {waterIntakeChartData && <Line data={waterIntakeChartData} />}
            </div>
          ) : waterIntakeData.length > 0 ? (
            <>
              {waterIntakeData.map((intake, index) => (
                <div key={index} style={styles.waterIntakeRow}>
                  <div style={styles.waterIntakeTime}>{intake.time}</div>
                  <div style={styles.waterIntakeAmount}>{intake.amount} g</div>
                </div>
              ))}
              <div style={styles.totalAmount}>
                <strong>{totalAmount} g</strong>
              </div>
            </>
          ) : (
            "음수 내역이 없습니다."
          )}
        </div>

        {/* 놀이 내역 */}
        <div style={styles.recordSection}>
          <h3 style={styles.sectionTitle}>놀이</h3>
          <div style={styles.recordContent}>
            {playData ? playData : "놀이 내역이 없습니다."}
          </div>
        </div>

        {/* 병원 내역 */}
        <div style={styles.recordSection}>
          <h3 style={styles.sectionTitle}>병원</h3>
          <div style={styles.recordContent}>
            {hospitalData ? hospitalData : "병원 내역이 없습니다."}
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
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#FFFFFF",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
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
  chartButton: {
    height: "30px",
    padding: "5px 5px",
    fontSize: "14px",
    backgroundColor: "rgb(206, 173, 156)",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
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
  separator: {
    marginTop: "10px",
    borderTop: "1px solid #CEAD9C",
    marginBottom: "10px",
  },
  totalAmount: {
    padding: "15px",
    textAlign: "right", // 좌측 정렬
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#333333",
    marginTop: "10px",
  },
  memoSection: {
    marginTop: "30px",
  },
  memoInput: {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #EAEAEA",
    outline: "none",
    boxSizing: "border-box",
    resize: "none",
  },
  feedRowContainer: {
    backgroundColor: "#FFFFFF", // 배경색을 흰색으로 설정
    borderRadius: "12px", // 동그랗게 처리
    padding: "15px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // 살짝 그림자 추가
    marginBottom: "15px", // 항목 간 간격
    textAlign: "left", // 좌측 정렬
  },
  feedRow: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  rowContent: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  feedingTime: {
    fontSize: "14px",
    color: "#888",
    minWidth: "40px",
  },
  categoryButton: {
    width: "30px",
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
  categoryButtonBlue: {
    width: "30px",
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
  categoryButtonOrange: {
    width: "30px",
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
  productType: {
    width: "30px",
    fontSize: "10px",
    color: "#777",
  },
  foodName: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  amountCalories: {
    textAlign: "right",
    fontSize: "14px",
    color: "#888",
    marginTop: "8px",
  },
  notes: {
    backgroundColor: "#f8f9fa",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "14px",
    color: "#666",
    fontStyle: "italic",
    marginTop: "8px",
  },
  waterIntakeRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  waterIntakeTime: {
    color: "#666",
    fontSize: "14px",
  },
  waterIntakeAmount: {
    fontWeight: "bold",
    color: "#333",
    fontSize: "14px",
  },
};

export default DiaryTab;
