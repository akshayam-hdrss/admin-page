import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionsByStage, addQuestion, updateQuestion, deleteQuestion } from "../../api/api.js";
import "./Quiz.css";



const Quiz = () => {
  const { id } = useParams(); // stage
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    stage: id,
  });
  const [editId, setEditId] = useState(null); // track question being edited

  const fetchQuestions = async () => {
    setLoading(true);
    const data = await getQuestionsByStage(id);
    setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, [id]);

  // Open modal for Add
  const handleAddClick = () => {
    setFormData({ question: "", options: ["", "", "", ""], answer: "", stage: id });
    setEditId(null); // no edit
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleEditClick = (q) => {
    setFormData({
      question: q.question,
      options: Array.isArray(q.options) ? q.options : JSON.parse(q.options),
      answer: q.answer,
      stage: id,
    });
    setEditId(q.id); // set editing id
    setIsModalOpen(true);
  };

  // Handle form field change
  const handleChange = (e, index = null) => {   
    const { name, value } = e.target;
    if (name === "option" && index !== null) {
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData({ ...formData, options: newOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form for Add or Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateQuestion(editId, formData); // edit
    } else {
      await addQuestion(formData); // add
    }
    setIsModalOpen(false);
    fetchQuestions();
  };

  // Delete question
  const handleDelete = async (qid) => {
    await deleteQuestion(qid);
    fetchQuestions();
  };

  if (loading) return <p>Loading questions...</p>;

  return (

<div className="quiz-container">
  <h2>Quiz - Stage {id}</h2>

  <button onClick={handleAddClick} className="quiz-add-btn">➕ Add Question</button>

  <div className="questions-list">
    {questions.map((q) => (
      <div key={q.id} className="question-card">
        <div><strong>Question:</strong> {q.question}</div>
        <div>
          <strong>Options:</strong>
          <ul>
            {(Array.isArray(q.options) ? q.options : JSON.parse(q.options)).map((opt, i) => <li key={i}>{opt}</li>)}
          </ul>
        </div>
        <div><strong>Answer:</strong> {q.answer}</div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button onClick={() => handleEditClick(q)} className="edit-btn">✏️ Edit</button>
          <button onClick={() => handleDelete(q.id)} className="delete-btn">🗑 Delete</button>
        </div>
      </div>
    ))}
  </div>

  {isModalOpen && (
  <div className="modal-overlay">
  <div className="modal-content">
    <h3>{editId ? "Edit Question" : "Add New Question"}</h3>
    <form onSubmit={handleSubmit}>
      <input type="text" name="question" placeholder="Question" value={formData.question} onChange={handleChange} required />
      <hr className="hrline"/>
      
      {formData.options.map((opt, i) => (
        <input key={i} type="text" name="option" placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => handleChange(e, i)} required />
      ))}
     <hr className="hrline"/>
      <input type="text" name="answer" placeholder="Answer" value={formData.answer} onChange={handleChange} required />
      <div className="modal-buttons">
        <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
        <button type="submit" className="save-btn">Save</button>
      </div>
    </form>
  </div>
</div>

)}
</div>

  );
};

export default Quiz;
