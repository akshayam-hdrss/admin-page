import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Result = () => {
  const { userId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `https://medbook-backend-1.onrender.com/api/quiz-userdata/${userId}/result`
        );
        setResult(res.data);
      } catch (err) {
        console.error("Error fetching result:", err);
      }
    };
    fetchResult();
  }, [userId]);

  return (
    <div
      style={{
        maxWidth: "750px",
        margin: "40px auto",
        padding: "25px",
        background: "linear-gradient(to right, #fdfbfb, #ebedee)",
        borderRadius: "15px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#2c3e50",
          marginBottom: "25px",
          fontSize: "24px",
        }}
      >
        📊 User Result
      </h2>

      {result ? (
        <div>
          {/* ✅ Top-level summary (skip userId) */}
          {Object.entries(result).map(([key, value], index) => {
            if (key === "userId" || key === "details") return null; // skip userId & details (handled separately)
            return (
              <div
                key={index}
                style={{
                  background: "white",
                  padding: "15px 18px",
                  marginBottom: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <span
                  style={{
                    fontWeight: "600",
                    color: "#34495e",
                    textTransform: "capitalize",
                    fontSize: "16px",
                  }}
                >
                  {key}
                </span>
                <span
                  style={{
                    color: "#2c3e50",
                    fontSize: "15px",
                    background: "#f4f6f7",
                    padding: "6px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : value.toString()}
                </span>
              </div>
            );
          })}

          {/* ✅ Show details array */}
          <h3
            style={{
              marginTop: "25px",
              marginBottom: "15px",
              color: "#2c3e50",
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            📌 Stage Details
          </h3>
          {result.details && result.details.length > 0 ? (
            result.details.map((stage, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  padding: "18px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  marginBottom: "15px",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                }}
              >
                <p>
                  <strong>Stage:</strong> {stage.stageNumber}
                </p>
                <p>
                  <strong>Marks:</strong> {stage.marks}
                </p>

                {/* ✅ Extra info */}
                {stage.extraInfo && Object.keys(stage.extraInfo).length > 0 && (
  <div
    style={{
      marginTop: "10px",
      padding: "10px",
      background: "#f9f9f9",
      borderRadius: "8px",
      border: "1px dashed #bbb",
    }}
  >
    <h4 style={{ marginBottom: "8px", color: "#2c3e50" }}>Extra Info:</h4>
    {Object.entries(stage.extraInfo).map(([key, val], idx) => (
      <p key={idx}>
        <strong>{key}:</strong> {val?.toString()}
      </p>
    ))}
  </div>
)}

              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#888" }}>No stage details found.</p>
          )}
        </div>
      ) : (
        <p
          style={{
            textAlign: "center",
            color: "#888",
            fontStyle: "italic",
          }}
        >
          Loading...
        </p>
      )}
    </div>
  );
};

export default Result;
