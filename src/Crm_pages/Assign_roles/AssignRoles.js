import React, { useState } from "react";
import axios from "axios";
import "./AssignRoles.css";

export default function AssignRoles() {
  const [mobile, setMobile] = useState("");
  const [userFound, setUserFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [userData, setUserData] = useState(null);
  const [success, setSuccess] = useState("");

  const fetchUserData = async (phone) => {
    try {
      const response = await axios.get(
        `https://medbook-backend-1.onrender.com/api/bookings/user/phone/${phone}`
      );
      if (response.data) {
        setUserFound(true);
        setUserData(response.data);
      } else {
        setError("User not found");
        setUserFound(false);
      }
    } catch (err) {
      console.error(err);
      setError("User not found or server error");
      setUserFound(false);
    }
  };

  const handleCheckUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setUserFound(false);
    setUserData(null);

    await fetchUserData(mobile);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData || !role) return;

    const payload = {
      id: userData.userId,
      isDoctor: role === "doctor",
      isPharmacy: role === "pharmacy",
      isProduct: role === "product",
      isLab: role === "lab",
    };

    try {
      setLoading(true);
      await axios.put("https://medbook-backend-1.onrender.com/api/user/role", payload);
      setSuccess(`✅ Role "${role}" successfully assigned to ${userData.name}`);

      // ✅ After successful update, refresh user data automatically
      await fetchUserData(mobile);
    } catch (err) {
      console.error(err);
      setError("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const getActiveRole = (data) => {
    if (data.isDoctor) return "Doctor";
    if (data.isPharmacy) return "Pharmacy";
    if (data.isProduct) return "Product";
    if (data.isLab) return "Lab";
    return null;
  };

  return (
    <div className="assignroles-page">
      <div className="assignroles-card">
        <div className="logo-container">
          <div className="logo-circle">M</div>
          <h2 className="assignroles-title">Assign Roles</h2>
        </div>

        {/* Step 1: Enter mobile number */}
        <form onSubmit={handleCheckUser} className="assignroles-form">
          <div className="input-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Checking..." : "Check User"}
          </button>
        </form>

        {/* Step 2: User info + role selector */}
        {userFound && userData && (
          <div className="fade-in">
            <div className="user-info-card">
              <h4>User Details</h4>
              <p>
                <strong>Name:</strong> {userData.name}
              </p>
              <p>
                <strong>Phone:</strong> {userData.phone}
              </p>

              {getActiveRole(userData) ? (
                <p className="active-role">
                  🔹 <strong>Role:</strong> {getActiveRole(userData)}
                </p>
              ) : (
                <p className="no-role">❌ No active role assigned</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="assignroles-form">
              <div className="input-group">
                <label>Select New Role</label>
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">-- Choose Role --</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="product">Product</option>
                  <option value="lab">Lab</option>
                </select>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </div>
    </div>
  );
}
