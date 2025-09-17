import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "https://medbook-backend-1.onrender.com/api/employees"
        );
        const result = await response.json();

        if (response.ok && result?.resultdata) {
          setEmployees(result.resultdata);
        } else {
          setErrorMsg(result?.message || "Failed to load employees.");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setErrorMsg("Something went wrong while fetching employees.");
      }
      setLoading(false);
    };

    fetchEmployees();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Employee List</h2>

      {loading && <div className="text-center">Loading employees...</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      {!loading && employees.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Employee Number</th>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Mobile</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>District</th>
                <th>Salary</th>
                <th>Role</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.employeeNumber}>
                  <td>{index + 1}</td>
                  <td>{emp.employeeNumber}</td>
                  <td>{emp.employeeName}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.mobileNumber}</td>
                  <td>{emp.gender}</td>
                  <td>{formatDate(emp.dateOfBirth)}</td>
                  <td>{emp.district || "-"}</td>
                  <td>₹ {parseFloat(emp.salary).toLocaleString()}</td>
                  <td>
                    <span className="badge bg-primary">{emp.employeeRole}</span>
                  </td>
                  <td>
                    {emp.employeeAccess?.length > 0 ? (
                      emp.employeeAccess.map((access, i) => (
                        <span key={i} className="badge bg-secondary me-1">
                          {access}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No Access</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && employees.length === 0 && !errorMsg && (
        <div className="alert alert-info text-center">
          No employees found. Please add some employees.
        </div>
      )}
    </div>
  );
};

export default EmployeeList;