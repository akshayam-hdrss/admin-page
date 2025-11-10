// src/pages/QuizData.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizUserData, editQuizUserData, deleteQuizUserData } from "../../api/api.js";
import "./quizdata.css";

const QuizData = () => {
  const [quizData, setQuizData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getQuizUserData();

      // ✅ Keep only one entry per user (latest stage)
      const uniqueUsers = Object.values(
        data.reduce((acc, item) => {
          // If multiple stages exist, keep the latest using createdAt
          if (!acc[item.userId] || new Date(item.createdAt) > new Date(acc[item.userId].createdAt)) {
            acc[item.userId] = item;
          }
          return acc;
        }, {})
      );

      setQuizData(uniqueUsers);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user’s quiz data?")) return;

    try {
      await deleteQuizUserData(userId);
      alert("Deleted successfully!");
      loadData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // const handleEdit = async (userId) => {
  //   const newMarks = prompt("Enter new score:");
  //   if (newMarks) {
  //     try {
  //       await editQuizUserData(userId, { marks: newMarks });
  //       alert("Updated successfully!");
  //       loadData();
  //     } catch (err) {
  //       console.error("Edit failed:", err);
  //     }
  //   }
  // };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#2c3e50" }}>Quiz User Data</h2>

      {quizData.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {quizData.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e0e0e0",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <p><strong>User:</strong> {item.userId}</p>
              <p><strong>UserName:</strong> {item.userName}</p>
              <p><strong>Stage:</strong> {item.stageNumber}</p>
              <p>
                <strong>Score:</strong>{" "}
                <span style={{ color: "#27ae60", fontWeight: "bold" }}>{item.marks}</span>
              </p>

              <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  style={{
                    flex: "1",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#3498db",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/progress/${item.userId}`)}
                >
                  Progress
                </button>
                <button
                  style={{
                    flex: "1",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#9b59b6",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/result/${item.userId}`)}
                >
                  Result
                </button>
                {/* <button
                  style={{
                    flex: "1",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#f39c12",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handleEdit(item.userId)}
                >
                  Edit
                </button> */}
                <button
                  style={{
                    flex: "1",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#e74c3c",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(item.userId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#888" }}>No quiz data found.</p>
      )}
    </div>
  );
};

export default QuizData;
