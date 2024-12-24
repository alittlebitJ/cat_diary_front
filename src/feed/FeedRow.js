import React from "react";

function FeedRow({
  index,
  feedRatio,
  handleTypeChange,
  handleFeedSelectChange,
  handleModeChange,
  handleInputChange,
  removeFeedSelectField,
}) {
  return (
    <div style={styles.feedRatioContainer}>
      <div style={styles.row}>
        <div style={{ width: '10%', textAlign: 'left' }}>
          <select
            value={feedRatio.type}
            onChange={(e) => handleTypeChange(e, index)}
            style={{ ...styles.select, textAlign: 'center' }}
          >
            <option value="주식">주식</option>
            <option value="간식">간식</option>
          </select>
        </div>

        <div style={{ width: '45%', textAlign: 'left' }}>
          <select
            value={feedRatio.feedId || (feedRatio.feedOptions[0]?.id || '')}
            onChange={(e) => handleFeedSelectChange(e, index)}
            style={styles.select}
          >
            {feedRatio.feedOptions.map((feed) => (
                <option key={feed.id} value={feed.id}>
                  {feed.name}
                </option>
            ))}
          </select>
        </div>

        <div style={{ width: '10%', textAlign: 'left' }}>
          <select
            value={feedRatio.mode}
            onChange={(e) => handleModeChange(e, index)}
            style={{ ...styles.select, textAlign: 'center' }}
          >
            <option value="perGram">그람</option>
            <option value="perPiece">개당</option>
          </select>
        </div>

        <div style={{ width: '15%' }}>
          <input
            type="number"
            value={feedRatio.amount}
            onChange={(e) => handleInputChange(e, index)}
            style={styles.input}
          />
        </div>

        <div style={{ width: '10%' }}>
          <button
            onClick={() => removeFeedSelectField(index)}
            style={styles.removeButton}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  feedRatioContainer: {
    marginBottom: "15px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 10px",
    borderBottom: "1px solid #ddd",
  },
  select: {
    width: "100%",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    outline: "none",
  },
  input: {
    width: "100%",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    WebkitAppearance: "none",
    MozAppearance: "textfield",
    outline: "none",
  },
  removeButton: {
    padding: "5px 10px",
    backgroundColor: "#FF5733",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default FeedRow;