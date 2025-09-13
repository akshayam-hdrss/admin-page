// src/pages/Progress.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Progress = () => {
  const { userId } = useParams();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `https://medbook-backend-1.onrender.com/api/quiz-userdata/${userId}/progress`
        );
        setProgress(res.data);
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };
    fetchProgress();
  }, [userId]);

  // ✅ Render function for numbers, objects, and strings
  const renderValue = (value) => {
    if (typeof value === "number") {
      let color = "#4caf50"; // green
      if (value < 40) color = "#f44336"; // red
      else if (value < 70) color = "#ff9800"; // orange

      return (
        <div style={{ marginTop: "6px" }}>
          <div
            style={{
              background: "#eee",
              borderRadius: "8px",
              height: "12px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${value}%`,
                background: color,
                height: "100%",
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <span style={{ fontSize: "13px", color: "#555" }}>{value}%</span>
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div style={{ marginTop: "8px" }}>
          {Object.entries(value).map(([k, v], idx) => (
            <p key={idx} style={{ margin: "4px 0", fontSize: "14px" }}>
              <strong>{k}:</strong> {v?.toString()}
            </p>
          ))}
        </div>
      );
    }

    return <span style={{ color: "#222" }}>{value?.toString()}</span>;
  };

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "30px auto",
        padding: "20px",
        background: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "25px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        📊 User Progress - {userId}
      </h2>

      {progress ? (
        <div>
          {/* ✅ Show all summary except details */}
          {Object.entries(progress).map(([key, value], index) => {
            if (key === "details") return null; // skip details here
            return (
              <div
                key={index}
                style={{
                  background: "white",
                  padding: "15px 18px",
                  marginBottom: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#444",
                    textTransform: "capitalize",
                    fontSize: "15px",
                  }}
                >
                  {key}
                </strong>
                {renderValue(value)}
              </div>
            );
          })}

          {/* ✅ Separate section for stage details */}
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
          {progress.details && progress.details.length > 0 ? (
            progress.details.map((stage, i) => (
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
                <p>
                  <strong>User:</strong> {stage.userName}
                </p>

                {stage.extraInfo && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px",
                      background: "#f9f9f9",
                      borderRadius: "8px",
                      border: "1px dashed #bbb",
                    }}
                  >
                    {Object.entries(stage.extraInfo).map(([key, value], idx) => (
                      <p key={idx}>
                        <strong>{key}:</strong> {value.toString()}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#888" }}>
              No stage details found.
            </p>
          )}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#888" }}>Loading...</p>
      )}
    </div>
  );
};

export default Progress;
