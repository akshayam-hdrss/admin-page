import React, { useState } from 'react';
import './EmployeesForm.css';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    employeeNumber: '',
    userName: '',
    memberName: '',
    fatherName: '',
    doorStreet: '',
    villageArea: '',
    district: '',
    pincode: '',
    mobileNumber: '',
    gender: '',
    age: '',
    dateOfBirth: '',
    education: '',
    designation: '',
    aadharNo: '',
    Pan: '',
    bloodGroup: '',
    salary: '',
    employeeAccess: [],
    employeeRole: ''
  });

  const [accessOptions, setAccessOptions] = useState([
    'hospital', 
    'doctors', 
    'traditional treatments', 
    'services'
  ]);
  const [showAccessPopup, setShowAccessPopup] = useState(false);
  const [newAccess, setNewAccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleAccessChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !formData.employeeAccess.includes(selectedValue)) {
      setFormData((p) => ({ 
        ...p, 
        employeeAccess: [...p.employeeAccess, selectedValue] 
      }));
    }
    // Reset the select to default option
    e.target.value = "";
  };

  const removeAccess = (accessToRemove) => {
    setFormData((p) => ({ 
      ...p, 
      employeeAccess: p.employeeAccess.filter(access => access !== accessToRemove) 
    }));
  };

  const openAccessPopup = () => {
    setShowAccessPopup(true);
  };

  const closeAccessPopup = () => {
    setShowAccessPopup(false);
    setNewAccess('');
  };

  const addNewAccess = () => {
    if (newAccess && !accessOptions.includes(newAccess)) {
      setAccessOptions([...accessOptions, newAccess]);
    }
    closeAccessPopup();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleBack = () => window.history.back();

  return (
    <div className="employee-form">
      <button type="button" className="back-btn" onClick={handleBack}>&lt; Back</button>
      <h2>Employee Form</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="employeeNumber">Employee Number:</label>
          <input id="employeeNumber" name="employeeNumber" value={formData.employeeNumber} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="userName">User Name (for reference):</label>
          <input id="userName" name="userName" value={formData.userName} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="memberName">Member Name:</label>
          <input id="memberName" name="memberName" value={formData.memberName} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="fatherName">Father/Husband Name:</label>
          <input id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="doorStreet">Door No & Street:</label>
          <input id="doorStreet" name="doorStreet" value={formData.doorStreet} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="villageArea">Village/Area:</label>
          <input id="villageArea" name="villageArea" value={formData.villageArea} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="district">District:</label>
          <input id="district" name="district" value={formData.district} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="pincode">Pincode:</label>
          <input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
        </div>

        <div>
          <label>Gender:</label>
          <div className="gender-options">
            <label><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange}/> Male</label>
            <label><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange}/> Female</label>
            <label><input type="radio" name="gender" value="Others" checked={formData.gender === 'Others'} onChange={handleChange}/> Others</label>
          </div>
        </div>

        <div>
          <label htmlFor="age">Age:</label>
          <input id="age" name="age" type="number" className="small-input" value={formData.age} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="education">Educational Qualification:</label>
          <input id="education" name="education" value={formData.education} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="designation">Designation:</label>
          <input id="designation" name="designation" value={formData.designation} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="salary">Salary:</label>
          <input id="salary" name="salary" value={formData.salary} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="aadharNo">Aadhar No:</label>
          <input id="aadharNo" name="aadharNo" value={formData.aadharNo} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="pan">Pan NO:</label>
          <input id="voterId" name="voterId" value={formData.voterId} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="bloodGroup">Blood Group:</label>
          <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
            <option value="">Select</option>
            <option value="A+">A+</option><option value="A-">A-</option>
            <option value="B+">B+</option><option value="B-">B-</option>
            <option value="O+">O+</option><option value="O-">O-</option>
            <option value="AB+">AB+</option><option value="AB-">AB-</option>
          </select>
        </div>

        {/* Employee Access with Add button and mobile-friendly selection */}
        <div>
          <label htmlFor="employeeAccess">Employee Access:</label>
          <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px'}}>
            <select 
              id="employeeAccess" 
              name="employeeAccess" 
              onChange={handleAccessChange}
              style={{flex: '1', minWidth: '200px'}}
            >
              <option value="">Select Access</option>
              {accessOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {/* <button type="button" onClick={openAccessPopup}>Add New</button> */}
          </div>
          
          {/* Display selected access items */}
          <div style={{marginTop: '10px'}}>
            {formData.employeeAccess.map((access, index) => (
              <span 
                key={index} 
                style={{
                  display: 'inline-block',
                  backgroundColor: '#f0f0f0',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  margin: '5px 5px 5px 0',
                  fontSize: '14px'
                }}
              >
                {access}
                <button 
                  type="button" 
                  onClick={() => removeAccess(access)}
                  style={{
                    marginLeft: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#ff0000',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {showAccessPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h3>Add New Access</h3>
                <input
                  type="text"
                  value={newAccess}
                  onChange={(e) => setNewAccess(e.target.value)}
                  placeholder="Enter new access type"
                  autoFocus
                />
                <div className="popup-buttons">
                  <button type="button" onClick={addNewAccess}>Submit</button>
                  <button type="button" onClick={closeAccessPopup}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Employee Role - simple dropdown without add functionality */}
        <div>
          <label htmlFor="employeeRole">Employee Role:</label>
          <select id="employeeRole" name="employeeRole" value={formData.employeeRole} onChange={handleChange}>
            <option value="">Select</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        <div className="submit-row">
          <div><button type="submit">Submit</button></div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;









