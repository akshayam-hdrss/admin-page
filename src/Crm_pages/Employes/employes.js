import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    employeeNumber: "",
    userName: "",
    memberName: "",
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

  const [accessOptions, setAccessOptions] = useState([
    "hospital",
    "doctors",
    "traditional treatments",
    "services",
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleAccessChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !formData.employeeAccess.includes(selectedValue)) {
      setFormData((p) => ({
        ...p,
        employeeAccess: [...p.employeeAccess, selectedValue],
      }));
    }
    e.target.value = "";
  };

  const removeAccess = (accessToRemove) => {
    setFormData((p) => ({
      ...p,
      employeeAccess: p.employeeAccess.filter(
        (access) => access !== accessToRemove
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleBack = () => window.history.back();

  return (
    <div className="container my-4">
      <button className="btn btn-link mb-3" onClick={handleBack}>
        &lt; Back
      </button>
      <h2 className="mb-4">Employee Form</h2>

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
            <label className="form-label">Member Name</label>
            <input
              type="text"
              className="form-control"
              name="memberName"
              value={formData.memberName}
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
              type="text"
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
            <select
              className="form-select"
              onChange={handleAccessChange}
              defaultValue=""
            >
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
              <span
                key={i}
                className="badge bg-secondary me-2 mb-2"
                style={{ fontSize: "14px" }}
              >
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
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-end">
          <button type="submit" className="btn btn-primary px-4">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;