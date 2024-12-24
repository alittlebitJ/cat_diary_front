import React, { useState } from 'react';

function WaterIntakeTab({ selectedDate }) { // selectedDate를 props로 받음
  const [values, setValues] = useState(Array(10).fill('')); // 원래 크기 유지
  const [differences, setDifferences] = useState(Array(5).fill(0)); // 차이 배열은 5개
  const [totalDifference, setTotalDifference] = useState(0);

  const handleChange = (index, event) => {
    const newValues = [...values];
    newValues[index] = event.target.value === '' ? '' : Number(event.target.value);
    setValues(newValues);
    calculateDifference(newValues); // 입력 시 즉시 계산
  };

  const calculateDifference = (updatedValues) => {
    let sum = 0;
    const newDifferences = Array(5).fill(0); // 차이 배열 초기화

    for (let i = 0; i < 5; i++) {
      const before = Number(updatedValues[i]) || 0;
      const after = Number(updatedValues[i + 5]) || 0;
      const diff = Math.abs(after - before).toFixed(1); // 소수점 1째 자리까지
      newDifferences[i] = parseFloat(diff); // 문자열을 다시 숫자로 변환
      sum += parseFloat(diff); // 소수점 1째 자리 유지
    }

    setDifferences(newDifferences);
    setTotalDifference(sum.toFixed(1));
  };

  const handleSubmit = async () => {
    const amount = totalDifference; // 총 차이만 amount로 사용

    // amount가 0 이하일 경우
    if (Number(amount) <= 0) {
      alert('차이가 0 이거나 음수인 데이터는 입력할 수 없습니다.');
      return; // 제출 방지
    }

    const data = {
      catId: 1, // 고정값
      date: selectedDate.toISOString().split('T')[0], // 전달받은 selectedDate 사용
      amount: parseFloat(amount), // 계산된 총 차이
      unit: 'g', // 고정값
    };

    try {
      const response = await fetch('http://localhost:8088/waterIntake/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('데이터가 성공적으로 입력되었습니다.');
      } else {
        alert('데이터 입력에 실패했습니다.');
      }
    } catch (error) {
      alert('서버와의 통신 오류가 발생했습니다.');
    }
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <colgroup>
          <col style={{ width: '40%' }} /> {/* '전' 컬럼 */}
          <col style={{ width: '40%' }} /> {/* '후' 컬럼 */}
          <col style={{ width: '20%' }} /> {/* '차이' 컬럼 */}
        </colgroup>
        <thead>
          <tr>
            <th style={styles.header}>전</th>
            <th style={styles.header}>후</th>
            <th style={styles.header}>차이</th>
          </tr>
        </thead>
        <tbody>
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <tr key={i}>
                <td style={styles.cell}>
                  <input
                    type="number"
                    value={values[i]}
                    onChange={(e) => handleChange(i, e)}
                    style={styles.input}
                  />
                </td>
                <td style={styles.cell}>
                  <input
                    type="number"
                    value={values[i + 5]}
                    onChange={(e) => handleChange(i + 5, e)}
                    style={styles.input}
                  />
                </td>
                <td style={styles.cell}>{differences[i].toFixed(1)} g</td>
              </tr>
            ))}
        </tbody>
      </table>
      <p style={styles.result}>총 차이 <strong>{totalDifference}</strong> g</p>
      <button onClick={handleSubmit} style={styles.submitButton}>
        입력하기
      </button>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '400px',
    margin: '40px auto',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFFFFF',
    fontFamily: 'sans-serif',
    textAlign: 'center',
    paddingTop: '20px',
    paddingBottom: '20px',
  },
  table: {
    width: '95%',
    padding: '5px',
    borderSpacing: '0',
    marginBottom: '20px',
  },
  header: {
    textAlign: 'center',
    padding: '10px',
    fontSize: '1rem',
    color: '#666666',
    marginBottom: '10px',
  },
  cell: {
    paddingBottom: '10px',
  },
  input: {
    width: '90%',
    padding: '10px',
    border: '1px solid #EAEAEA',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
  },
  result: {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#333333',
    marginTop: '20px',
  },
  submitButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#CEAD9C', // 색상 변경
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default WaterIntakeTab;
