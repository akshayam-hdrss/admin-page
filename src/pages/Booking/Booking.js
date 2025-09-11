import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Booking() {
  const [formData, setFormData] = useState({
    addInName: "",
    contactPerson: "",
    designation: "",
    mobile: "",
    address: "",
    email: "",
    website: "",
    package: "",
    additionalNo: 0,
    additionalBranch: 0,
    banner: 0,
    premiumBanner: 0,
    video: 0,
    premiumVideo: 0,
    paymentMode: "",
    transactionId: "",
    validFrom: "",
    validityDays: 0,
    executiveName: "",
    executiveMobile: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
  });

  const packagePrices = {
    gold: 5000,
    Diamond: 10000,
  };

  const featurePrices = {
    additionalNo: 1500,
    additionalBranch: 2500,
    banner: 5000,
    premiumBanner: 10000,
    video: 1000,
    premiumVideo: 2500,
  };

  const calculateTotal = () => {
    let total = 0;
    if (formData.package) {
      total += packagePrices[formData.package];
    }
    total += formData.additionalNo * featurePrices.additionalNo;
    total += formData.additionalBranch * featurePrices.additionalBranch;
    total += formData.banner * featurePrices.banner;
    total += formData.premiumBanner * featurePrices.premiumBanner;
    total += formData.video * featurePrices.video;
    total += formData.premiumVideo * featurePrices.premiumVideo;

    // add 18% tax
    return total + total * 0.18;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: isNaN(value) ? value : Number(value),
    });
  };

  const calculateValidTo = () => {
    if (!formData.validFrom || !formData.validityDays) return "";
    const startDate = new Date(formData.validFrom);
    startDate.setDate(startDate.getDate() + Number(formData.validityDays));
    return startDate.toISOString().split("T")[0];
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Order Form</h2>
        <form>
          {/* Existing Fields */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Add in the Name of</label>
              <input
                type="text"
                className="form-control"
                name="addInName"
                value={formData.addInName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Contact Person</label>
              <input
                type="text"
                className="form-control"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Category Section */}
          <h5 className="mt-3">Category Selection</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Sub Category</label>
              <input
                type="text"
                className="form-control"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Sub Sub Category</label>
              <input
                type="text"
                className="form-control"
                name="subSubCategory"
                value={formData.subSubCategory}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Package Selection */}
          <h5 className="mt-3">Select Package</h5>
          <div className="d-flex flex-wrap gap-3 mb-3">
            {Object.keys(packagePrices).map((pkg) => (
              <div key={pkg} className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="package"
                  value={pkg}
                  checked={formData.package === pkg}
                  onChange={handleChange}
                />
                <label className="form-check-label text-capitalize">
                  {pkg} - ₹{packagePrices[pkg]}
                </label>
              </div>
            ))}
          </div>

          {/* Extra Features with +/- */}
          <h5>Additional Features</h5>
          {Object.keys(featurePrices).map((feature) => (
            <div className="row mb-2" key={feature}>
              <div className="col-md-6">
                <label className="form-label text-capitalize">
                  {feature.replace(/([A-Z])/g, " $1")}
                </label>
              </div>
              <div className="col-md-3 d-flex">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      [feature]: Math.max(0, formData[feature] - 1),
                    })
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center mx-1"
                  name={feature}
                  value={formData[feature]}
                  onChange={handleChange}
                  min="0"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      [feature]: formData[feature] + 1,
                    })
                  }
                >
                  +
                </button>
              </div>
              <div className="col-md-3 d-flex align-items-center">
                <span>₹{featurePrices[feature]}</span>
              </div>
            </div>
          ))}

          {/* Payment Mode */}
          <h5 className="mt-3">Payment Mode</h5>
          <div className="d-flex gap-3 mb-3">
            {["Cash", "UPI", "NEFT", "Card", "Cheque"].map((mode) => (
              <div className="form-check" key={mode}>
                <input
                  type="radio"
                  className="form-check-input"
                  name="paymentMode"
                  value={mode}
                  checked={formData.paymentMode === mode}
                  onChange={handleChange}
                />
                <label className="form-check-label">{mode}</label>
              </div>
            ))}
          </div>

          {/* Transaction ID */}
          {formData.paymentMode && (
            <div className="mb-3">
              <label className="form-label">Transaction ID</label>
              <input
                type="text"
                className="form-control"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Validity Section */}
          <h5 className="mt-3">Validity</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Valid From</label>
              <input
                type="date"
                className="form-control"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">No. of Days</label>
              <input
                type="number"
                className="form-control"
                name="validityDays"
                value={formData.validityDays}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Valid till</label>
              <input
                type="date"
                className="form-control"
                value={calculateValidTo()}
                readOnly
              />
            </div>
          </div>

          {/* Executive Details */}
          <h5 className="mt-3">Executive Details</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Executive Name</label>
              <input
                type="text"
                className="form-control"
                name="executiveName"
                value={formData.executiveName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Executive Mobile No</label>
              <input
                type="text"
                className="form-control"
                name="executiveMobile"
                value={formData.executiveMobile}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Total */}
          <div className="alert alert-info mt-3">
            <h5>Total Amount (Incl. 18% GST): ₹{calculateTotal()}</h5>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
