// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import barcodeImage from "../../assets/Untitled.png";
// import CategoryData from "./CategoryData";
// import jsPDF from "jspdf";

// // Import your logos (replace with your actual logo paths)
// import akTechLogo from "../../assets/splash.png";
// import medbookLogo from "../../assets/aktech.png";

// function Booking() {
//   const [formData, setFormData] = useState({
//     addInName: "",
//     contactPerson: "",
//     mobile: "",
//     additionalNo: "",
//     franchiseBranch: "",
//     email: "",
//     website: "",
//     address1: "",
//     address2: "",
//     district: "",
//     pincode: "",
//     additionalBranch: 0,
//     banner: 0,
//     premiumBanner: 0,
//     video: 0,
//     premiumVideo: 0,
//     paymentMode: "",
//     transactionId: "",
//     validFrom: "",
//     validityDays: 0,
//     executiveId: "",
//     executiveName: "",
//     executiveMobile: "",
//     category: "",
//     subCategory: "",
//     subSubCategory: "",
//     package: "",
//   });

//   const packagePrices = {
//     gold: 5000,
//     Diamond: 10000,
//   };

//   const featurePrices = {
//     additionalBranch: 2500,
//     banner: 5000,
//     premiumBanner: 10000,
//     video: 1000,
//     premiumVideo: 2500,
//   };

//   const calculateSubtotal = () => {
//     let subtotal = 0;
//     if (formData.package) {
//       subtotal += packagePrices[formData.package];
//     }
//     subtotal += formData.additionalBranch * featurePrices.additionalBranch;
//     subtotal += formData.banner * featurePrices.banner;
//     subtotal += formData.premiumBanner * featurePrices.premiumBanner;
//     subtotal += formData.video * featurePrices.video;
//     subtotal += formData.premiumVideo * featurePrices.premiumVideo;
//     return subtotal;
//   };

//   const calculateTotal = () => {
//     const subtotal = calculateSubtotal();
//     return subtotal + subtotal * 0.18; // incl GST
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Reset subcategory when category changes
//     if (name === "category") {
//       setFormData({
//         ...formData,
//         category: value,
//         subCategory: "",
//       });
//       return;
//     }

//     setFormData({
//       ...formData,
//       [name]: isNaN(value) ? value : Number(value),
//     });
//   };

//   const calculateValidTo = () => {
//     if (!formData.validFrom || !formData.validityDays) return "";
//     const startDate = new Date(formData.validFrom);
//     startDate.setDate(startDate.getDate() + Number(formData.validityDays));
//     return startDate.toISOString().split("T")[0];
//   };

//   // Sort categories by order_no
//   const getSortedCategories = (key) => {
//     return CategoryData[key]
//       ? [...CategoryData[key]].sort((a, b) => a.order_no - b.order_no)
//       : [];
//   };

//   // Main category options
//   const categoryOptions = Object.keys(CategoryData);

//   // Subcategories for selected category
//   const subCategoryOptions = formData.category
//     ? getSortedCategories(formData.category)
//     : [];

//   // Generate PDF receipt with professional design
// const generatePDF = () => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const today = new Date();
  
//   // Company details
//   const gstin = "29ABCDE1234F1Z5"; // Replace with your actual GSTIN
  
//   // Add logos to the PDF
//   doc.addImage(akTechLogo, 'PNG', 20, 15, 30, 30);
//   doc.addImage(medbookLogo, 'PNG', pageWidth - 50, 15, 30, 30);

//   // Add company names below logos
//   doc.setFontSize(14);
//   doc.setTextColor(60, 60, 60);
//   doc.text("Medbook", 25, 50);
//   doc.text("AK Technologies", pageWidth - 35, 50, { align: "center" });

//   // Add company addresses below names
//   doc.setFontSize(10);
 

//  doc.text("Sunrise Crystal Complex", pageWidth - 35, 56, { align: "center" });
//   doc.text("Coimbatore, Tamilnadu", pageWidth - 35, 62, { align: "center" });
  
//   // Add GSTIN
//   doc.text(`GSTIN: ${gstin}`, pageWidth / 2, 70, { align: "center" });
  
//   // Invoice title
//   doc.setFontSize(20);
//   doc.setTextColor(0, 0, 0);
//   doc.text("INVOICE", pageWidth / 2, 80, { align: "center" });
  
//   // Invoice details
//   doc.setFontSize(12);
//   doc.setTextColor(100, 100, 100);
  
//   // Bill To section
//   doc.text("Bill To:", 20, 90);
//   doc.setFontSize(10);
//   doc.setTextColor(0, 0, 0);
//   doc.text(formData.addInName, 20, 97);
//   if (formData.address1) {
//     doc.text(formData.address1, 20, 104);
//   }
//   if (formData.address2) {
//     doc.text(formData.address2, 20, 111);
//   }
//   if (formData.district || formData.pincode) {
//     doc.text(`${formData.district} - ${formData.pincode}`, 20, 118);
//   }
//   doc.text(`Mobile: ${formData.mobile}`, 20, 125);
//   if (formData.email) {
//     doc.text(`Email: ${formData.email}`, 20, 132);
//   }
  
//   // Invoice details on right side
//   doc.setFontSize(10);
//   doc.setTextColor(100, 100, 100);
//   doc.text(`Invoice #: MB-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${Math.floor(Math.random() * 1000)}`, pageWidth - 20, 90, { align: "right" });
//   doc.text(`Date: ${today.toLocaleDateString()}`, pageWidth - 20, 97, { align: "right" });
  
//   // Calculate due date (30 days from now)
//   const dueDate = new Date();
//   dueDate.setDate(today.getDate() + 30);
//   doc.text(`Due Date: ${dueDate.toLocaleDateString()}`, pageWidth - 20, 104, { align: "right" });
  
// // Define column positions with proper margins
// const colDesc = 30;              // Item Description (left)
// const colQty = 120;              // Qty (center)
// const colRate = pageWidth - 110; // Rate (right)
// const colAmt = pageWidth - 20;   // Amount (right)

// // Line separator above header
// doc.setDrawColor(200, 200, 200);
// doc.line(20, 140, pageWidth - 20, 140);

// // Table header background
// doc.setFillColor(245, 245, 245);
// doc.rect(20, 145, pageWidth - 40, 10, "F");

// // Table header text
// doc.setFontSize(12);
// doc.setTextColor(0, 0, 0);
// doc.text("Item Description", colDesc, 152);
// doc.text("Qty", colQty, 152, { align: "center" });
// doc.text("Rate", colRate, 152, { align: "right" });
// doc.text("Amount", colAmt, 152, { align: "right" });

// // Line under header
// doc.line(20, 155, pageWidth - 20, 155);

// // Table rows
// let yPos = 165;

// // Package row
// if (formData.package) {
//   doc.setFontSize(11);
//   doc.text(
//     `${formData.package.charAt(0).toUpperCase() + formData.package.slice(1)} Package`,
//     colDesc, yPos
//   );
//   doc.text("1", colQty, yPos, { align: "center" });
//   doc.text(`₹${packagePrices[formData.package].toLocaleString("en-IN")}`, colRate, yPos, { align: "right" });
//   doc.text(`₹${packagePrices[formData.package].toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
//   yPos += 12; // Slightly more space for better readability
// }

// // Add Row Function
// const addRow = (label, qty, rate) => {
//   doc.text(label, colDesc, yPos);
//   doc.text(qty.toString(), colQty, yPos, { align: "center" });
//   doc.text(`₹${rate.toLocaleString("en-IN")}`, colRate, yPos, { align: "right" });
//   doc.text(`₹${(qty * rate).toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
//   yPos += 12;
// };

// if (formData.additionalBranch > 0) addRow("Additional Branches", formData.additionalBranch, featurePrices.additionalBranch);
// if (formData.banner > 0) addRow("Banners", formData.banner, featurePrices.banner);
// if (formData.premiumBanner > 0) addRow("Premium Banners", formData.premiumBanner, featurePrices.premiumBanner);
// if (formData.video > 0) addRow("Videos", formData.video, featurePrices.video);
// if (formData.premiumVideo > 0) addRow("Premium Videos", formData.premiumVideo, featurePrices.premiumVideo);

// // Line above totals
// yPos += 5;
// doc.line(20, yPos, pageWidth - 20, yPos);
// yPos += 10;

// // Totals
// const subtotal = calculateSubtotal();
// const gstAmount = subtotal * 0.18;
// const total = subtotal + gstAmount;

// doc.setFontSize(12);
// doc.setTextColor(0, 0, 0);
// doc.text("Sub Total", colRate, yPos, { align: "right" });
// doc.text(`₹${subtotal.toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
// yPos += 12;

// doc.text("GST (18%)", colRate, yPos, { align: "right" });
// doc.text(`₹${gstAmount.toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
// yPos += 12;

// doc.setFontSize(14);
// doc.setTextColor(0, 100, 0);
// doc.text("TOTAL", colRate, yPos, { align: "right" });
// doc.text(`₹${total.toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
// yPos += 20;

// // Payment details
// doc.setFontSize(11);
// doc.setTextColor(0, 0, 0);
// doc.text(`Payment Mode: ${formData.paymentMode}`, 20, yPos);
// if (formData.transactionId) {
//   doc.text(`Transaction ID: ${formData.transactionId}`, 20, yPos + 7);
// }
// if (formData.validFrom) {
//   doc.text(
//     `Validity: ${formData.validFrom} to ${calculateValidTo()} (${formData.validityDays} days)`,
//     pageWidth - 20, yPos, { align: "right" }
//   );
// }
// yPos += 20;

// // Notes
// doc.setFontSize(11);
// doc.setTextColor(100, 100, 100);
// doc.text("Notes", 20, yPos);
// doc.setFontSize(10);
// doc.text("Thank you for your business with MedBook.", 20, yPos + 7);
// doc.text("Your advertisement will be live within 24 hours of payment confirmation.", 20, yPos + 14);

// // Terms & Conditions
// doc.setFontSize(11);
// doc.setTextColor(100, 100, 100);
// doc.text("Terms & Conditions", pageWidth - 20, yPos, { align: "right" });
// doc.setFontSize(10);
// doc.text("Please make payment by the due date.", pageWidth - 20, yPos + 7, { align: "right" });
// doc.text("Late payments may incur a fee.", pageWidth - 20, yPos + 14, { align: "right" });

// // Save the PDF
// doc.save(`MedBook_Invoice_${formData.addInName}_${today.getTime()}.pdf`);
// };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     generatePDF();
//     // You can also submit the form data to your backend here if needed
//   };

//   return (
//     <div className="container mt-4 mb-5">
//       <div className="card shadow-lg p-4">
//         <h2 className="text-center mb-4">Order Form</h2>
//         <form onSubmit={handleSubmit}>
//           {/* Add in Name & Contact Person */}
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Add in the Name of</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="addInName"
//                 value={formData.addInName}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Contact Person</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="contactPerson"
//                 value={formData.contactPerson}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           {/* Email, Mobile, Additional No, Franchise/Branch */}
//           <div className="row">
//             <div className="col-md-3 mb-3">
//               <label className="form-label">Email</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="col-md-3 mb-3">
//               <label className="form-label">Mobile No</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="mobile"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="col-md-3 mb-3">
//               <label className="form-label">Additional No</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="additionalNo"
//                 value={formData.additionalNo}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="col-md-3 mb-3">
//               <label className="form-label">Franchise/Branch</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="franchiseBranch"
//                 value={formData.franchiseBranch}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* Address Section */}
//           <h5 className="mt-3">Address</h5>
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Address 1</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="address1"
//                 value={formData.address1}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Address 2</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="address2"
//                 value={formData.address2}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label">District</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="district"
//                 value={formData.district}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Pincode</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* Category Section */}
//           <h5 className="mt-3">Category Selection</h5>
//           <div className="row">
//             <div className="col-md-4 mb-3">
//               <label className="form-label">Category</label>
//               <select
//                 className="form-select"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">-- Select Category --</option>
//                 {categoryOptions.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">Sub Category</label>
//               <select
//                 className="form-select"
//                 name="subCategory"
//                 value={formData.subCategory}
//                 onChange={handleChange}
//                 disabled={!formData.category}
//               >
//                 <option value="">-- Select Sub Category --</option>
//                 {subCategoryOptions.map((sub) => (
//                   <option key={sub.id} value={sub.name}>
//                     {sub.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">Sub Sub Category</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="subSubCategory"
//                 value={formData.subSubCategory}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* Package Selection */}
//           <h5 className="mt-3">Select Package</h5>
//           <div className="d-flex flex-wrap gap-3 mb-3">
//             {Object.keys(packagePrices).map((pkg) => (
//               <div key={pkg} className="form-check">
//                 <input
//                   type="radio"
//                   className="form-check-input"
//                   name="package"
//                   value={pkg}
//                   checked={formData.package === pkg}
//                   onChange={handleChange}
//                   required
//                 />
//                 <label className="form-check-label text-capitalize">
//                   {pkg} - ₹{packagePrices[pkg]}
//                 </label>
//               </div>
//             ))}
//           </div>

//           {/* Extra Features */}
//           <h5>Additional Features</h5>
//           {Object.keys(featurePrices).map((feature) => (
//             <div className="row mb-2" key={feature}>
//               <div className="col-md-6">
//                 <label className="form-label text-capitalize">
//                   {feature.replace(/([A-Z])/g, " $1")}
//                 </label>
//               </div>
//               <div className="col-md-3 d-flex">
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary"
//                   onClick={() =>
//                     setFormData({
//                       ...formData,
//                       [feature]: Math.max(0, formData[feature] - 1),
//                     })
//                   }
//                 >
//                   -
//                 </button>
//                 <input
//                   type="number"
//                   className="form-control text-center mx-1"
//                   name={feature}
//                   value={formData[feature]}
//                   onChange={handleChange}
//                   min="0"
//                 />
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary"
//                   onClick={() =>
//                     setFormData({
//                       ...formData,
//                       [feature]: formData[feature] + 1,
//                     })
//                   }
//                 >
//                   +
//                 </button>
//               </div>
//               <div className="col-md-3 d-flex align-items-center">
//                 <span>₹{featurePrices[feature]}</span>
//               </div>
//             </div>
//           ))}

//           {/* Payment Mode */}
//           <h5 className="mt-3">Payment Mode</h5>
//           <div className="d-flex gap-3 mb-3">
//             {["Cash", "UPI", "NEFT", "Card", "Cheque"].map((mode) => (
//               <div className="form-check" key={mode}>
//                 <input
//                   type="radio"
//                   className="form-check-input"
//                   name="paymentMode"
//                   value={mode}
//                   checked={formData.paymentMode === mode}
//                   onChange={handleChange}
//                   required
//                 />
//                 <label className="form-check-label">{mode}</label>
//               </div>
//             ))}
//           </div>

//           {/* Transaction ID */}
//           {formData.paymentMode && (
//             <div className="mb-3">
//               <label className="form-label">Transaction ID</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="transactionId"
//                 value={formData.transactionId}
//                 onChange={handleChange}
//               />
//             </div>
//           )}

//           {/* Barcode if UPI */}
//           {formData.paymentMode === "UPI" && (
//             <div className="text-center mb-3">
//               <img
//                 src={barcodeImage}
//                 alt="UPI Barcode"
//                 style={{ maxWidth: "200px" }}
//               />
//               <p className="mt-2">Scan this QR to Pay via UPI</p>
//             </div>
//           )}

//           {/* Validity Section */}
//           <h5 className="mt-3">Validity</h5>
//           <div className="row">
//             <div className="col-md-4 mb-3">
//               <label className="form-label">Valid From</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 name="validFrom"
//                 value={formData.validFrom}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">No. of Days</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="validityDays"
//                 value={formData.validityDays}
//                 onChange={handleChange}
//                 min="0"
//               />
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">Valid till</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={calculateValidTo()}
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* Executive Details */}
//           <h5 className="mt-3">Executive Details</h5>
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Executive ID</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="executiveId"
//                 value={formData.executiveId}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {formData.executiveId && (
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Executive Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="executiveName"
//                   value={formData.executiveName}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Executive Mobile No</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="executiveMobile"
//                   value={formData.executiveMobile}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Total */}
//           <div className="alert alert-info mt-3">
//             <h5>Total Amount (Incl. 18% GST): ₹{calculateTotal().toLocaleString('en-IN')}</h5>
//           </div>

//           <button type="submit" className="btn btn-primary w-100">
//             Submit & Download Receipt
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Booking;









import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import barcodeImage from "../../assets/upi.png";
import CategoryData from "./CategoryData";
import jsPDF from "jspdf";
import axios from "axios";

// Import your logos (replace with your actual logo paths)
import akTechLogo from "../../assets/medbook.jpg";
import medbookLogo from "../../assets/FINAL LOGO copy.jpg";

// API configuration
const BASE_URL = "https://medbook-backend-1.onrender.com";
const MEMBERSHIPS_API = `${BASE_URL}/api/memberships`;
const EMPLOYEES_API = `${BASE_URL}/api/employees`;

// API function to get employees
const getEmployees = () => {
  return axios.get(EMPLOYEES_API);
};

function Booking() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [membershipId, setMembershipId] = useState(null);
  
  const [formData, setFormData] = useState({
    addInName: "",
    contactPerson: "",
    mobile: "",
    additionalNo: "",
    franchiseBranch: "CBE1",
    email: "",
    address1: "",
    address2: "",
    district: "",
    pincode: "",
    additionalBranch: 0,
    banner: 0,
    premiumBanner: 0,
    video: 0,
    premiumVideo: 0,
    paymentMode: "",
    transactionId: "",
    validFrom: "",
    validityDays: 0,
    executiveId: "",
    executiveName: "",
    executiveMobile: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
    package: "",
  });

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getEmployees();
        if (response.data.result === "success") {
          setEmployees(response.data.resultdata);
          setFilteredEmployees(response.data.resultdata);
        } else {
          setError("Failed to fetch employees");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Error loading employee data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  // Filter employees based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter(emp => 
        emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.mobileNumber.includes(searchTerm)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  // Handle employee selection
  const handleEmployeeSelect = (employee) => {
    setFormData({
      ...formData,
      executiveId: employee.employeeNumber,
      executiveName: employee.employeeName,
      executiveMobile: employee.mobileNumber
    });
    setSearchTerm(`${employee.employeeNumber} - ${employee.employeeName}`);
    setShowDropdown(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.employee-search-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const packagePrices = {
    gold: 5000,
    Diamond: 10000,
    Premium: 15000 // Added Premium package price
  };

  const featurePrices = {
    additionalBranch: 2500,
    banner: 5000,
    premiumBanner: 10000,
    video: 1000,
    premiumVideo: 2500,
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    if (formData.package) {
      subtotal += packagePrices[formData.package] || 0;
    }
    subtotal += formData.additionalBranch * featurePrices.additionalBranch;
    subtotal += formData.banner * featurePrices.banner;
    subtotal += formData.premiumBanner * featurePrices.premiumBanner;
    subtotal += formData.video * featurePrices.video;
    subtotal += formData.premiumVideo * featurePrices.premiumVideo;
    return subtotal;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + subtotal * 0.18; // incl GST
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset subcategory when category changes
    if (name === "category") {
      setFormData({
        ...formData,
        category: value,
        subCategory: "",
      });
      return;
    }

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

  // Sort categories by order_no
  const getSortedCategories = (key) => {
    return CategoryData[key]
      ? [...CategoryData[key]].sort((a, b) => a.order_no - b.order_no)
      : [];
  };

  // Main category options
  const categoryOptions = Object.keys(CategoryData);

  // Subcategories for selected category
  const subCategoryOptions = formData.category
    ? getSortedCategories(formData.category)
    : [];

  // Generate PDF receipt with professional design
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const today = new Date();
    
    // Company details
    const gstin = "33CVZPB6682D1Z9"; // Replace with your actual GSTIN
    
    // Add logos to the PDF
    doc.addImage(akTechLogo, 'JPG', margin, 15, 30, 30);
    doc.addImage(medbookLogo, 'JPG', pageWidth - 50, 15, 30, 30);

    // Add company names below logos
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text("Medbook", margin + 5, 50);
    doc.text("AK Technologies", pageWidth - 35, 50, { align: "center" });

    // Add company addresses below names
    doc.setFontSize(10);
    doc.text("Sunrise Crystal Complex", pageWidth - 35, 56, { align: "center" });
    doc.text("Coimbatore, Tamilnadu", pageWidth - 35, 62, { align: "center" });
    
    // Add GSTIN
    doc.text(`GSTIN: ${gstin}`, pageWidth / 2, 70, { align: "center" });
    
    // Invoice title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("INVOICE", pageWidth / 2, 80, { align: "center" });
    
    // Invoice details
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    
    // Bill To section
    doc.text("Bill To:", margin, 90);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    let billToY = 97;
    if (formData.addInName) {
      doc.text(formData.addInName, margin, billToY);
      billToY += 7;
    }
    
    if (formData.contactPerson) {
      doc.text(`Attn: ${formData.contactPerson}`, margin, billToY);
      billToY += 7;
    }
    
    if (formData.address1) {
      doc.text(formData.address1, margin, billToY);
      billToY += 7;
    }
    
    if (formData.address2) {
      doc.text(formData.address2, margin, billToY);
      billToY += 7;
    }
    
    if (formData.district || formData.pincode) {
      doc.text(`${formData.district || ''} ${formData.pincode ? '- ' + formData.pincode : ''}`, margin, billToY);
      billToY += 7;
    }
    
    if (formData.mobile) {
      doc.text(`Mobile: ${formData.mobile}`, margin, billToY);
      billToY += 7;
    }
    
    if (formData.email) {
      doc.text(`Email: ${formData.email}`, margin, billToY);
      billToY += 7;
    }
    
    // Invoice details on right side
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    console.log("Membership ID:", membershipId);

    const invoiceNumber = membershipId ? `${membershipId}` : `MB-TEMP-${today.getTime()}`;
    doc.text(`Invoice #: ${invoiceNumber}`, pageWidth - margin, 90, { align: "right" });

    // doc.text(`Invoice #: MB-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${Math.floor(Math.random() * 1000)}`, pageWidth - margin, 90, { align: "right" });
    doc.text(`Date: ${today.toLocaleDateString()}`, pageWidth - margin, 97, { align: "right" });
    
    // Calculate due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);
    doc.text(`Due Date: ${dueDate.toLocaleDateString()}`, pageWidth - margin, 104, { align: "right" });
    
    // Define column positions with proper margins
    const colDesc = margin + 10;        // Item Description (left)
    const colQty = pageWidth - 90;      // Qty (center)
    const colRate = pageWidth - 60;     // Rate (right)
    const colAmt = pageWidth - margin;  // Amount (right)

    // Line separator above header
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 140, pageWidth - margin, 140);

    // Table header background
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, 145, pageWidth - (margin * 2), 10, "F");

    // Table header text
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Item Description", colDesc, 152);
    doc.text("Qty", colQty, 152, { align: "center" });
    doc.text("Rate", colRate, 152, { align: "right" });
    doc.text("Amount", colAmt, 152, { align: "right" });

    // Line under header
    doc.line(margin, 155, pageWidth - margin, 155);

    // Table rows
    let yPos = 165;

    // Package row
    if (formData.package) {
      doc.setFontSize(11);
      doc.text(
        `${formData.package.charAt(0).toUpperCase() + formData.package.slice(1)} Package`,
        colDesc, yPos
      );
      doc.text("1", colQty, yPos, { align: "center" });
      doc.text(`₹${packagePrices[formData.package].toLocaleString("en-IN")}`, colRate, yPos, { align: "right" });
      doc.text(`₹${packagePrices[formData.package].toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
      yPos += 8;
    }

    // Add Row Function
    const addRow = (label, qty, rate) => {
      if (qty > 0) {
        doc.text(label, colDesc, yPos);
        doc.text(qty.toString(), colQty, yPos, { align: "center" });
        doc.text(`₹${rate.toLocaleString("en-IN")}`, colRate, yPos, { align: "right" });
        doc.text(`₹${(qty * rate).toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
        yPos += 8;
      }
    };

    addRow("Additional Branches", formData.additionalBranch, featurePrices.additionalBranch);
    addRow("Banners", formData.banner, featurePrices.banner);
    addRow("Premium Banners", formData.premiumBanner, featurePrices.premiumBanner);
    addRow("Videos", formData.video, featurePrices.video);
    addRow("Premium Videos", formData.premiumVideo, featurePrices.premiumVideo);

    // Line above totals
    yPos += 5;
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Totals
    const subtotal = calculateSubtotal();
    const gstAmount = subtotal * 0.18;
    const total = subtotal + gstAmount;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Sub Total", colRate, yPos, { align: "right" });
    doc.text(`₹${subtotal.toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
    yPos += 8;

    doc.text("GST (18%)", colRate, yPos, { align: "right" });
    doc.text(`₹${gstAmount.toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
    yPos += 8;

    doc.setFontSize(14);
    doc.setTextColor(0, 100, 0);
    doc.text("TOTAL", colRate, yPos, { align: "right" });
    doc.text(`₹${total.toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
    yPos += 15;

    // Payment details
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Payment Mode: ${formData.paymentMode}`, margin, yPos);
    if (formData.transactionId) {
      doc.text(`Transaction ID: ${formData.transactionId}`, margin, yPos + 7);
    }
    if (formData.validFrom) {
      doc.text(
        `Validity: ${formData.validFrom} to ${calculateValidTo()} (${formData.validityDays} days)`,
        pageWidth - margin, yPos, { align: "right" }
      );
    }
    yPos += 20;
// Force Terms & Conditions to start on page 2
doc.addPage();

let currentY = margin; // start from top margin

// Heading (Bold + Dark Color)
doc.setFontSize(12);
doc.setFont("helvetica", "bold"); // make it bold
doc.setTextColor(0, 0, 0); // solid black
doc.text("Terms & Conditions", margin, currentY);

doc.setFontSize(10);
doc.setFont("helvetica", "normal"); // reset to normal for body text
doc.setTextColor(80, 80, 80); // dark gray for body

currentY += 10; // space after heading

// Full Terms text
const termsText = `
AK TECHNOLOGIES it is not a part or supported by any of the existing company. It may be clearly understood by those entering into an agreement to list their names in the proposed Mobile App that this Mobile App should not be misunderstood as from any other existing company.

AK TECHNOLOGIES does not assume responsibility of enforcing licensing requirements or to check for licenses with respect to licensed professions prior to accepting advertising agreements.

AK TECHNOLOGIES does not assume responsibility of the Trade mark(s), Trade Name(s), Portraits, Pictures or illustrations given in the advertisements matter and the advertiser must assume the responsibility of any liability which may arise on account of any claim of its infringement or otherwise by any party.

Payments overdue beyond the due date will attract 24% interest.

AK TECHNOLOGIES will not be responsible for any cash payments, payments must be made by cheque / DD Favoring / UPI - AK TECHNOLOGIES Only.

AK TECHNOLOGIES will not entertain any claim for refund of full or part of payment made under any circumstances. AK TECHNOLOGIES reserves the right to cancel the contract for non-payment or in case any balance is pending before the release of the Mobile App. The paid amount will not be adjusted for an equivalent package or any other considerations whatsoever.

AK TECHNOLOGIES will not be liable for error or deviations or omissions, if any, in advertisements / listings. Any liability for any claims, demands or units resulting from the contents of advertisements submitted and published will rest entirely with the advertiser.

AK TECHNOLOGIES agrees to exercise reasonable care to ensure that all entries are updated correctly in its Mobile App. AK TECHNOLOGIES will not entertain any claim for compensation if any representation is cancelled, omitted, abbreviated or inserted incorrectly either as to the wordings, space or position in the Mobile App or otherwise.

AK TECHNOLOGIES reserves the unconditional right to amend or alter any or all of the above clauses and to add further clauses to those mentioned above.

Every signatory of this contract is deemed to have read and understood the terms and conditions before signing this contract and therefore cannot plead ignorance of the said terms and conditions.

All disputes will be subject to Coimbatore Jurisdiction only.
`;

// Wrap text inside margins
const wrappedText = doc.splitTextToSize(termsText, pageWidth - margin * 2);

const lineHeight = 6;

wrappedText.forEach(line => {
  if (currentY > pageHeight - margin) {
    doc.addPage();
    currentY = margin; // reset Y for new page
  }
  doc.text(line, margin, currentY);
  currentY += lineHeight;
});




    // Executive details if available
    if (formData.executiveName || formData.executiveId) {
      yPos += 30;
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("Executive Details", margin, yPos);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      if (formData.executiveId) {
        doc.text(`ID: ${formData.executiveId}`, margin, yPos + 7);
      }
      if (formData.executiveName) {
        doc.text(`Name: ${formData.executiveName}`, margin, yPos + 14);
      }
      if (formData.executiveMobile) {
        doc.text(`Mobile: ${formData.executiveMobile}`, margin, yPos + 21);
      }
    }

    // Save the PDF
    doc.save(`MedBook_Invoice_${formData.addInName}_${today.getTime()}.pdf`);

    const pdfBlob = doc.output("blob"); 
    return pdfBlob;
  };

  // Function to submit form data to API
  const submitToAPI = async () => {
    setApiLoading(true);
    setError(null);
    setSuccessMessage("");
    
    try {
      // Prepare the data for API submission
      const apiData = {
        addInName: formData.addInName,
        contactPerson: formData.contactPerson,
        mobile: formData.mobile,
        additionalNo: formData.additionalNo,
        franchiseBranch: formData.franchiseBranch,
        email: formData.email,
        address1: formData.address1,
        address2: formData.address2,
        district: formData.district,
        pincode: formData.pincode,
        additionalBranch: formData.additionalBranch,
        banner: formData.banner,
        premiumBanner: formData.premiumBanner,
        video: formData.video,
        premiumVideo: formData.premiumVideo,
        paymentMode: formData.paymentMode,
        transactionId: formData.transactionId,
        validFrom: formData.validFrom,
        validityDays: formData.validityDays,
        executiveId: formData.executiveId,
        executiveName: formData.executiveName,
        executiveMobile: formData.executiveMobile,
        category: formData.category,
        subCategory: formData.subCategory,
        subSubCategory: formData.subSubCategory,
        package: formData.package,
        totalAmount: calculateTotal()
      };

      const response = await axios.post(MEMBERSHIPS_API, apiData);
      
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Membership created successfully!");
        setMembershipId(response.data.resultData.membershipCode || null);
        console.log("API membershipCode:", response.data.resultData.membershipCode);
        return true;
      } else {
        throw new Error("Failed to create membership");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to submit data. Please try again.");
      return false;
    } finally {
      setApiLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   // First submit to API
  //   const apiSuccess = await submitToAPI();
    
  //   // If API submission was successful, generate PDF
  //   if (apiSuccess) {
  //     generatePDF();
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // First submit to API
  const apiSuccess = await submitToAPI();

  if (apiSuccess) {
    const pdfBlob = generatePDF(); // ✅ create blob instead of save

    // Send to backend API
    const formDataToSend = new FormData();
    formDataToSend.append("pdf", pdfBlob, "invoice.pdf");
    formDataToSend.append("email", formData.email);
    formDataToSend.append("name", formData.contactPerson);
    formDataToSend.append("packageName", formData.package);

    try {
      const res = await axios.post(
        "https://medbook-backend-1.onrender.com/api/email/send-email",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Email sent:", res.data);
      setSuccessMessage("Invoice created and emailed successfully!");
    } catch (err) {
      console.error("Email send error:", err);
      setError("Invoice created, but failed to send email.");
    }
  }
};


  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Order Form</h2>
        
        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Add in Name & Contact Person */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Add in the Name of</label>
              <input
                type="text"
                className="form-control"
                name="addInName"
                value={formData.addInName}
                onChange={handleChange}
                required
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
                required
              />
            </div>
          </div>

          {/* Email, Mobile, Additional No, Franchise/Branch */}
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Mobile No</label>
              <input
                type="text"
                className="form-control"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Additional No</label>
              <input
                type="text"
                className="form-control"
                name="additionalNo"
                value={formData.additionalNo}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Franchise/Branch</label>
              <input
                type="text"
                className="form-control"
                name="franchiseBranch"
                value={formData.franchiseBranch}
                onChange={handleChange}
              />
            </div>
          </div>

  
          {/* Address Section */}
          <h5 className="mt-3">Address</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Address 1</label>
              <input
                type="text"
                className="form-control"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Address 2</label>
              <input
                type="text"
                className="form-control"
                name="address2"
                value={formData.address2}
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

          {/* Category Section */}
          <h5 className="mt-3">Category Selection</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Category --</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Sub Category</label>
              <select
                className="form-select"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                disabled={!formData.category}
              >
                <option value="">-- Select Sub Category --</option>
                {subCategoryOptions.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
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
                  required
                />
                <label className="form-check-label text-capitalize">
                  {pkg} - ₹{packagePrices[pkg]}
                </label>
              </div>
            ))}
          </div>

          {/* Extra Features */}
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
                  required
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

          {/* Barcode if UPI */}
          {formData.paymentMode === "UPI" && (
            <div className="text-center mb-3">
              <img
                src={barcodeImage}
                alt="UPI Barcode"
                style={{ maxWidth: "200px" }}
              />
              <p className="mt-2">Scan this QR to Pay via UPI</p>
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
            <div className="col-md-4 mb-3 employee-search-container">
              <label className="form-label">Executive ID</label>
              <div className="dropdown position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by ID, name or mobile"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  autoComplete="off"
                />
                {isLoading && (
                  <div className="position-absolute top-100 start-0 w-100 mt-1 p-2 bg-white border rounded">
                    <div className="text-center">Loading employees...</div>
                  </div>
                )}
                {showDropdown && !isLoading && filteredEmployees.length > 0 && (
                  <div className="position-absolute top-100 start-0 w-100 mt-1 p-0 bg-white border rounded shadow-lg" style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}>
                    {filteredEmployees.map((employee) => (
                      <button
                        key={employee.employeeNumber}
                        type="button"
                        className="dropdown-item d-block w-100 text-start p-2 border-bottom"
                        onClick={() => handleEmployeeSelect(employee)}
                      >
                        <div className="fw-bold">{employee.employeeNumber} - {employee.employeeName}</div>
                        <small className="text-muted">Mobile: {employee.mobileNumber}</small>
                      </button>
                    ))}
                  </div>
                )}
                {showDropdown && !isLoading && filteredEmployees.length === 0 && searchTerm && (
                  <div className="position-absolute top-100 start-0 w-100 mt-1 p-2 bg-white border rounded">
                    <div className="text-center">No employees found</div>
                  </div>
                )}
              </div>
              {error && <div className="text-danger small mt-1">{error}</div>}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Executive Name</label>
              <input
                type="text"
                className="form-control"
                name="executiveName"
                value={formData.executiveName}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Executive Mobile No</label>
              <input
                type="text"
                className="form-control"
                name="executiveMobile"
                value={formData.executiveMobile}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          {/* Total */}
          <div className="alert alert-info mt-3">
            <h5>Total Amount (Incl. 18% GST): ₹{calculateTotal().toLocaleString('en-IN')}</h5>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={apiLoading}
          >
            {apiLoading ? "Submitting..." : "Submit & Download Receipt"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;