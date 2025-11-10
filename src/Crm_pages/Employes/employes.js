import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    employeeNumber: "",
    userName: "",
    employeeName: "", // ✅ Changed from memberName → employeeName
    fatherName: "",
    doorStreet: "",
    villageArea: "",
    district: "",
    pincode: "",
    mobileNumber: "",
    gender: "",
    age: "",
    dateOfBirth: "",
    education: "",
    designation: "",
    aadharNo: "",
    voterId: "",
    bloodGroup: "",
    salary: "",
    employeeAccess: [],
    employeeRole: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const accessOptions = ["hospital", "doctors", "traditional treatments", "services"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccessChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !formData.employeeAccess.includes(selectedValue)) {
      setFormData((prev) => ({
        ...prev,
        employeeAccess: [...prev.employeeAccess, selectedValue],
      }));
    }
    e.target.value = "";
  };

  const removeAccess = (accessToRemove) => {
    setFormData((prev) => ({
      ...prev,
      employeeAccess: prev.employeeAccess.filter((a) => a !== accessToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetch(
        "https://medbook-backend-1.onrender.com/api/employees",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            age: Number(formData.age),
            salary: Number(formData.salary),
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccessMsg("✅ Employee added successfully!");
        setFormData({
          employeeNumber: "",
          userName: "",
          employeeName: "",
          fatherName: "",
          doorStreet: "",
          villageArea: "",
          district: "",
          pincode: "",
          mobileNumber: "",
          gender: "",
          age: "",
          dateOfBirth: "",
          education: "",
          designation: "",
          aadharNo: "",
          voterId: "",
          bloodGroup: "",
          salary: "",
          employeeAccess: [],
          employeeRole: "",
        });
      } else {
        setErrorMsg(result?.message || "❌ Failed to add employee.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrorMsg("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleBack = () => window.history.back();

  return (
    <div className="container my-4">
      <button className="btn btn-link mb-3" onClick={handleBack}>
        &lt; Back
      </button>
      <h2 className="mb-4">Employee Form</h2>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Details */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Employee Number</label>
            <input
              type="text"
              className="form-control"
              name="employeeNumber"
              value={formData.employeeNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">User Name (for reference)</label>
            <input
              type="text"
              className="form-control"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Employee Name</label>
            <input
              type="text"
              className="form-control"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Personal Details */}
        <h5 className="mt-3">Personal Details</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Father/Husband Name</label>
            <input
              type="text"
              className="form-control"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              className="form-control"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Address Section */}
        <h5 className="mt-3">Address</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Door No & Street</label>
            <input
              type="text"
              className="form-control"
              name="doorStreet"
              value={formData.doorStreet}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Village/Area</label>
            <input
              type="text"
              className="form-control"
              name="villageArea"
              value={formData.villageArea}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">District</label>
            <input
              type="text"
              className="form-control"
              name="district"
              value={formData.district}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Pincode</label>
            <input
              type="text"
              className="form-control"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Contact */}
        <h5 className="mt-3">Contact & Identification</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Aadhar No</label>
            <input
              type="text"
              className="form-control"
              name="aadharNo"
              value={formData.aadharNo}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Voter/PAN No</label>
            <input
              type="text"
              className="form-control"
              name="voterId"
              value={formData.voterId}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Professional Details */}
        <h5 className="mt-3">Work Details</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Educational Qualification</label>
            <input
              type="text"
              className="form-control"
              name="education"
              value={formData.education}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Designation</label>
            <input
              type="text"
              className="form-control"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Salary</label>
            <input
              type="number"
              className="form-control"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Gender & Blood Group */}
        <h5 className="mt-3">Other Details</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label d-block">Gender</label>
            <div className="d-flex gap-3">
              {["Male", "Female", "Others"].map((g) => (
                <div className="form-check" key={g}>
                  <input
                    type="radio"
                    className="form-check-input"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">{g}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Blood Group</label>
            <select
              className="form-select"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Access */}
        <h5 className="mt-3">Employee Access</h5>
        <div className="row mb-3">
          <div className="col-md-6">
            <select className="form-select" onChange={handleAccessChange} defaultValue="">
              <option value="">Select Access</option>
              {accessOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            {formData.employeeAccess.map((a, i) => (
              <span key={i} className="badge bg-secondary me-2 mb-2" style={{ fontSize: "14px" }}>
                {a}{" "}
                <button
                  type="button"
                  className="btn btn-sm btn-light ms-1"
                  onClick={() => removeAccess(a)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Employee Role */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Employee Role</label>
            <select
              className="form-select"
              name="employeeRole"
              value={formData.employeeRole}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-end">
          <button type="submit" className="btn btn-primary px-4" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;