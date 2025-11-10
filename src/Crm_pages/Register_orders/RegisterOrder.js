// import React, { useState, useEffect } from 'react';
// import './RegisterOrder.css';
// import jsPDF from "jspdf";
// import akTechLogo from "./assets/akTechLogo.jpg";
// import medbookLogo from "./assets/medbookLogo.jpg"; 

// const RegisterOrder = () => {
//   const [memberships, setMemberships] = useState([]);
//   const [selectedMembership, setSelectedMembership] = useState(null);
//   const [activeTab, setActiveTab] = useState('list');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);


//     const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.setFont("helvetica", "normal");
//     const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 20;
//   const today = new Date();
  
//   // Company details
//   const gstin = "33CVZPB6682D1Z9";
  
//   // Add logos to the PDF
//   doc.addImage(akTechLogo, 'JPG', margin, 15, 30, 30);
//   doc.addImage(medbookLogo, 'JPG', pageWidth - 50, 15, 30, 30);

//   // Add company names below logos
//   doc.setFontSize(14);
//   doc.setTextColor(60, 60, 60);
//   doc.text("Medbook", margin + 5, 50);
//   doc.text("AK Technologies", pageWidth - 35, 50, { align: "center" });

//   // Add company addresses below names
//   doc.setFontSize(10);
//   doc.text("Sunrise Crystal Complex", pageWidth - 35, 56, { align: "center" });
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
//   doc.text("Bill To:", margin, 90);
//   doc.setFontSize(10);
//   doc.setTextColor(0, 0, 0);
  
//   let billToY = 97;
//   if (formData.addInName) {
//     doc.text(formData.addInName, margin, billToY);
//     billToY += 7;
//   }
  
//   if (formData.contactPerson) {
//     doc.text(`Attn: ${formData.contactPerson}`, margin, billToY);
//     billToY += 7;
//   }
  
//   if (formData.address1) {
//     doc.text(formData.address1, margin, billToY);
//     billToY += 7;
//   }
  
//   if (formData.address2) {
//     doc.text(formData.address2, margin, billToY);
//     billToY += 7;
//   }
  
//   if (formData.district || formData.pincode) {
//     doc.text(`${formData.district || ''} ${formData.pincode ? '- ' + formData.pincode : ''}`, margin, billToY);
//     billToY += 7;
//   }
  
//   if (formData.mobile) {
//     doc.text(`Mobile: ${formData.mobile}`, margin, billToY);
//     billToY += 7;
//   }
  
//   if (formData.email) {
//     doc.text(`Email: ${formData.email}`, margin, billToY);
//     billToY += 7;
//   }
  
//   // Invoice details on right side
//   doc.setFontSize(10);
//   doc.setTextColor(100, 100, 100);

//   const invoiceNumber = membershipId ? `${membershipId}` : `MB-${today.getTime()}`;
//   doc.text(`Invoice #: ${invoiceNumber}`, pageWidth - margin, 90, { align: "right" });
//   doc.text(`Date: ${today.toLocaleDateString()}`, pageWidth - margin, 97, { align: "right" });
  
//   // Calculate due date (30 days from now)
//   const dueDate = new Date();
//   dueDate.setDate(today.getDate() + 30);
//   doc.text(`Due Date: ${dueDate.toLocaleDateString()}`, pageWidth - margin, 104, { align: "right" });
  
//   // Define column positions with proper margins
//   const colDesc = margin + 10;
//   const colQty = pageWidth - 90;
//   const colRate = pageWidth - 60;
//   const colAmt = pageWidth - margin;

//   // Line separator above header
//   doc.setDrawColor(200, 200, 200);
//   doc.line(margin, 140, pageWidth - margin, 140);

//   // Table header background
//   doc.setFillColor(245, 245, 245);
//   doc.rect(margin, 145, pageWidth - (margin * 2), 10, "F");

//   // Table header text
//   doc.setFontSize(12);
//   doc.setTextColor(0, 0, 0);
//   doc.text("Item Description", colDesc, 152);
//   doc.text("Qty", colQty, 152, { align: "center" });
//   doc.text("Rate", colRate, 152, { align: "right" });
//   doc.text("Amount", colAmt, 152, { align: "right" });

//   // Line under header
//   doc.line(margin, 155, pageWidth - margin, 155);

//   // Table rows
//   let yPos = 165;

//   // Package row
//   if (formData.package) {
//     doc.setFontSize(11);
//     doc.text(
//       `${formData.package.charAt(0).toUpperCase() + formData.package.slice(1)} Package`,
//       colDesc, yPos
//     );
//     doc.text("1", colQty, yPos, { align: "center" });
//     doc.text(`Rs.${packagePrices[formData.package].toLocaleString("en-IN")}`, colRate, yPos, { align: "right" });
//     doc.text(`Rs.${packagePrices[formData.package].toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
//     yPos += 8;
//   }

//   // Add Row Function
//   const addRow = (label, qty, rate) => {
//     if (qty > 0) {
//       doc.text(label, colDesc, yPos);
//       doc.text(qty.toString(), colQty, yPos, { align: "center" });
//       doc.text(`Rs.${rate.toLocaleString("en-IN")}`, colRate, yPos, { align: "right" });
//       doc.text(`Rs.${(qty * rate).toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
//       yPos += 8;
//     }
//   };

//   addRow("Additional Branches", formData.additionalBranch, featurePrices.additionalBranch);
//   addRow("Additional Doctors", formData.additionalDoctor, featurePrices.additionalDoctor);
//   addRow("Banners", formData.banner, featurePrices.banner);
//   addRow("Premium Banners", formData.premiumBanner, featurePrices.premiumBanner);
//   addRow("Videos", formData.video, featurePrices.video);
//   addRow("Premium Videos", formData.premiumVideo, featurePrices.premiumVideo);

//   // Line above totals
//   yPos += 5;
//   doc.line(margin, yPos, pageWidth - margin, yPos);
//   yPos += 10;

//   // Totals
//   const subtotal = calculateSubtotal();
//   const cgst = subtotal * 0.09;
//   const sgst = subtotal * 0.09;
//   const total = subtotal + cgst + sgst;

//   doc.setFontSize(12);
//   doc.setTextColor(0, 0, 0);

//   // Subtotal
//   doc.text("Sub Total", colRate, yPos, { align: "right" });
//   doc.text(`Rs.${subtotal.toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
//   yPos += 8;

//   // CGST
//   doc.text("CGST (9%)", colRate, yPos, { align: "right" });
//   doc.text(`Rs.${cgst.toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
//   yPos += 8;

//   // SGST
//   doc.text("SGST (9%)", colRate, yPos, { align: "right" });
//   doc.text(`Rs.${sgst.toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
//   yPos += 8;

//   // Total
//   doc.setFontSize(14);
//   doc.setTextColor(0, 100, 0);
//   doc.text("TOTAL", colRate, yPos, { align: "right" });
//   doc.text(`Rs.${total.toLocaleString("en-IN")}`, colAmt, yPos, { align: "right" });
//   yPos += 15;

//   // Payment details
//   doc.setFontSize(11);
//   doc.setTextColor(0, 0, 0);
//   doc.text(`Payment Mode: ${formData.paymentMode}`, margin, yPos);
//   if (formData.transactionId) {
//     doc.text(`Transaction ID: ${formData.transactionId}`, margin, yPos + 7);
//   }
//   if (formData.validFrom) {
//     doc.text(
//       `Validity: ${formData.validFrom} to ${calculateValidTo()} (${formData.validityDays} days)`,
//       pageWidth - margin, yPos, { align: "right" }
//     );
//   }
//   yPos += 20;



//   // ✅ Add system-generated note at the very bottom of page 1
// const noteY = pageHeight - 10; // 10 units above bottom
// doc.setFontSize(9); // small footer text
// doc.setTextColor(120, 120, 120);
// doc.setFont("helvetica", "italic");

// doc.text(
//   "* This is a system-generated invoice and does not require a signature *",
//   pageWidth / 2,
//   noteY,
//   { align: "center" }
// );


//   // Force Terms & Conditions to start on page 2
//   doc.addPage();

//   let currentY = margin;

//   // Heading
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor(0, 0, 0);
//   doc.text("Terms & Conditions", margin, currentY);

//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.setTextColor(80, 80, 80);

//   currentY += 10;

//   // Full Terms text
//   const termsText = `AK TECHNOLOGIES it is not a part or supported by any of the existing company. It may be clearly understood by those entering into an agreement to list their names in the proposed Mobile App that this Mobile App should not be misunderstood as from any other existing company.

// AK TECHNOLOGIES does not assume responsibility of enforcing licensing requirements or to check for licenses with respect to licensed professions prior to accepting advertising agreements.

// AK TECHNOLOGIES does not assume responsibility of the Trade mark(s), Trade Name(s), Portraits, Pictures or illustrations given in the advertisements matter and the advertiser must assume the responsibility of any liability which may arise on account of any claim of its infringement or otherwise by any party.

// Payments overdue beyond the due date will attract 24% interest.

// AK TECHNOLOGIES will not be responsible for any cash payments, payments must be made by cheque / DD Favoring / UPI - AK TECHNOLOGIES Only.

// AK TECHNOLOGIES will not entertain any claim for refund of full or part of payment made under any circumstances. AK TECHNOLOGIES reserves the right to cancel the contract for non-payment or in case any balance is pending before the release of the Mobile App. The paid amount will not be adjusted for an equivalent package or any other considerations whatsoever.

// AK TECHNOLOGIES will not be liable for error or deviations or omissions, if any, in advertisements / listings. Any liability for any claims, demands or units resulting from the contents of advertisements submitted and published will rest entirely with the advertiser.

// AK TECHNOLOGIES agrees to exercise reasonable care to ensure that all entries are updated correctly in its Mobile App. AK TECHNOLOGIES will not entertain any claim for compensation if any representation is cancelled, omitted, abbreviated or inserted incorrectly either as to the wordings, space or position in the Mobile App or otherwise.

// AK TECHNOLOGIES reserves the unconditional right to amend or alter any or all of the above clauses and to add further clauses to those mentioned above.

// Every signatory of this contract is deemed to have read and understood the terms and conditions before signing this contract and therefore cannot plead ignorance of the said terms and conditions.

// All disputes will be subject to Coimbatore Jurisdiction only.`;

//   // Wrap text inside margins
//   const wrappedText = doc.splitTextToSize(termsText, pageWidth - margin * 2);
//   const lineHeight = 6;

//   wrappedText.forEach(line => {
//     if (currentY > pageHeight - margin) {
//       doc.addPage();
//       currentY = margin;
//     }
//     doc.text(line, margin, currentY);
//     currentY += lineHeight;
//   });

//   // Executive details if available
//   if (formData.executiveName || formData.executiveId) {
//     currentY += 30;
//     doc.setFontSize(11);
//     doc.setTextColor(100, 100, 100);
//     doc.text("Executive Details", margin, currentY);
//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);
    
//     if (formData.executiveId) {
//       doc.text(`ID: ${formData.executiveId}`, margin, currentY + 7);
//     }
//     if (formData.executiveName) {
//       doc.text(`Name: ${formData.executiveName}`, margin, currentY + 14);
//     }
//     if (formData.executiveMobile) {
//       doc.text(`Mobile: ${formData.executiveMobile}`, margin, currentY + 21);
//     }
//   }

//   // Save the PDF
//   doc.save(`MedBook_Invoice_${formData.addInName}_${today.getTime()}.pdf`);
//     }

//   useEffect(() => {
//     fetchMemberships();
//   }, []);

// /*************  ✨ Windsurf Command ⭐  *************/
// /**
//  * Fetches memberships from the API.
//  *
//  * @returns {Promise<void>} - Resolves when the fetching is done.
//  *
//  * @throws {Error} - If there is an HTTP error or if the API returns an error.
//  */
// /*******  faa5cfe0-ae01-4a19-bcd7-f7db5c34c79f  *******/
//   const fetchMemberships = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('https://medbook-backend-1.onrender.com/api/memberships');
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.result) {
//         setMemberships(data.resultData);
//       } else {
//         throw new Error(data.message || 'Failed to fetch memberships');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching memberships:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
    
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const handleRowClick = (membership) => {
//     setSelectedMembership(membership);
//     setActiveTab('details');
//   };

//   const getStatus = (validTo) => {
//     if (!validTo) return 'Unknown';
    
//     const today = new Date();
//     const validToDate = new Date(validTo);
    
//     if (validToDate < today) {
//       return 'Expired';
//     } else {
//       return 'Active';
//     }
//   };

//   const renderLoading = () => (
//     <div className="loading-container">
//       <div className="loading-spinner"></div>
//       <p>Loading memberships...</p>
//     </div>
//   );

//   const renderError = () => (
//     <div className="error-container">
//       <h3>Error Loading Data</h3>
//       <p>{error}</p>
//       <button onClick={fetchMemberships} className="retry-button">
//         Try Again
//       </button>
//     </div>
//   );

//   const renderMembershipList = () => (
//     <div className="membership-list">
//       <div className="list-header">
//         <h2>Membership Registrations</h2>
//         <button onClick={fetchMemberships} className="refresh-button">
//           Refresh
//         </button>
//       </div>
//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Membership Code</th>
//               <th>Business Name</th>
//               <th>Contact Person</th>
//               <th>Mobile</th>
//               <th>Package</th>
//               <th>Valid From</th>
//               <th>Valid To</th>
//               <th>System Status</th>
//               <th>Expiry Status</th>
//               <th>Additional Doctors</th>
//             </tr>
//           </thead>
//           <tbody>
//             {memberships.map((membership) => {
//               const expiryStatus = getStatus(membership.validTo);
//               return (
//                 <tr key={membership.id} onClick={() => handleRowClick(membership)}>
//                   <td>{membership.id}</td>
//                   <td>{membership.membershipCode || 'N/A'}</td>
//                   <td>{membership.addInName}</td>
//                   <td>{membership.contactPerson}</td>
//                   <td>{membership.mobile}</td>
//                   <td>
//                     <span className={`package-badge ${membership.package ? membership.package.toLowerCase() : 'unknown'}`}>
//                       {membership.package || 'N/A'}
//                     </span>
//                   </td>
//                   <td>{formatDate(membership.validFrom)}</td>
//                   <td>{formatDate(membership.validTo)}</td>
//                   <td>{membership.status || 'N/A'}</td>
//                   <td>
//                     <span className={`status-${expiryStatus.toLowerCase()}`}>
//                       {expiryStatus}
//                     </span>
//                   </td>
//                   <td>{membership.additionalDoctor || 0}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   const renderMembershipDetails = () => {
//     if (!selectedMembership) return null;
    
//     const m = selectedMembership;
//     const expiryStatus = getStatus(m.validTo);
    
//     return (
//       <div className="membership-details">
//         <div className="details-header">
//           <h2>Membership Details</h2>
//           <button className="back-button" onClick={() => setActiveTab('list')}>
//             &larr; Back to List
//           </button>
//             <button className="download-pdf-btn" onClick={() => generatePDF(m)}>
//       📄 Download PDF
//     </button>
//         </div>
        
//         <div className="details-card">
//           <div className="card-header">
//             <div>
//               <h3>{m.addInName || 'N/A'}</h3>
//               <span className={`status-badge status-${expiryStatus.toLowerCase()}`}>
//                 {expiryStatus}
//               </span>
//             </div>
//             <div className="membership-code">{m.membershipCode || 'Pending Assignment'}</div>
//           </div>
          
//           <div className="card-body">
//             <div className="details-grid">
//               <div className="detail-group">
//                 <h4>Contact Information</h4>
//                 <div className="detail-item">
//                   <span className="label">Contact Person:</span>
//                   <span className="value">{m.contactPerson || 'N/A'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Mobile:</span>
//                   <span className="value">{m.mobile || 'N/A'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Additional No:</span>
//                   <span className="value">{m.additionalNo || 'N/A'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Email:</span>
//                   <span className="value">{m.email || 'N/A'}</span>
//                 </div>
//                 {m.website && (
//                   <div className="detail-item">
//                     <span className="label">Website:</span>
//                     <span className="value">
//                       <a href={m.website} target="_blank" rel="noopener noreferrer">
//                         {m.website}
//                       </a>
//                     </span>
//                   </div>
//                 )}
//               </div>
              
//               <div className="detail-group">
//                 <h4>Address</h4>
//                 <div className="detail-item">
//                   <span className="label">Address:</span>
//                   <span className="value">
//                     {[m.address1, m.address2].filter(Boolean).join(', ') || 'N/A'}
//                   </span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">District:</span>
//                   <span className="value">{m.district || 'N/A'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Pincode:</span>
//                   <span className="value">{m.pincode || 'N/A'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Franchise Branch:</span>
//                   <span className="value">{m.franchiseBranch || 'N/A'}</span>
//                 </div>
//               </div>
              
//               <div className="detail-group">
//                 <h4>Membership Details</h4>
//                 <div className="detail-item">
//                   <span className="label">Category:</span>
//                   <span className="value">{m.category || 'N/A'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Sub Category:</span>
//                   <span className="value">{m.subCategory || 'N/A'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Sub Sub Category:</span>
//                   <span className="value">{m.subSubCategory || 'N/A'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Package:</span>
//                   <span className={`value package-badge ${m.package ? m.package.toLowerCase() : 'unknown'}`}>
//                     {m.package || 'N/A'}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="detail-group">
//                 <h4>Validity & Features</h4>
//                 <div className="detail-item">
//                   <span className="label">Valid From:</span>
//                   <span className="value">{formatDate(m.validFrom)}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Valid To:</span>
//                   <span className="value">{formatDate(m.validTo)}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Validity Days:</span>
//                   <span className="value">{m.validityDays || 'N/A'} days</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Banner Ads:</span>
//                   <span className="value">{m.banner || 0} standard, {m.premiumBanner || 0} premium</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Video Ads:</span>
//                   <span className="value">{m.video || 0} standard, {m.premiumVideo || 0} premium</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Additional Branches:</span>
//                   <span className="value">{m.additionalBranch || 0}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Additional Doctors:</span>
//                   <span className="value">{m.additionalDoctor || 0}</span>
//                 </div>
//               </div>
              
//               <div className="detail-group">
//                 <h4>Payment Information</h4>
//                 <div className="detail-item">
//                   <span className="label">Payment Mode:</span>
//                   <span className="value">{m.paymentMode || 'N/A'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Transaction ID:</span>
//                   <span className="value">{m.transactionId || 'N/A'}</span>
//                 </div>
//               </div>
              
//               <div className="detail-group">
//                 <h4>Executive Information</h4>
//                 <div className="detail-item">
//                   <span className="label">Executive ID:</span>
//                   <span className="value">{m.executiveId || 'N/A'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Executive Name:</span>
//                   <span className="value">{m.executiveName || 'N/A'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Executive Mobile:</span>
//                   <span className="value">{m.executiveMobile || 'N/A'}</span>
//                 </div>
//               </div>

//               <div className="detail-group">
//                 <h4>System Info</h4>
//                 <div className="detail-item">
//                   <span className="label">Status:</span>
//                   <span className="value">{m.status || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="card-footer">
//             <div className="meta-info">
//               <span>Created: {formatDate(m.createdAt)}</span>
//               <span>Last Updated: {formatDate(m.updatedAt)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return renderLoading();
//   }

//   if (error) {
//     return renderError();
//   }

//   return (
//     <div className="register-order-container">
//       {activeTab === 'list' ? renderMembershipList() : renderMembershipDetails()}
//     </div>
//   );
// };

// export default RegisterOrder;

















import React, { useState, useEffect } from 'react';
import './RegisterOrder.css';
import jsPDF from "jspdf";
import akTechLogo from "../../assets/medbook.jpg";
import medbookLogo from "../../assets/FINAL LOGO copy.jpg"; 

const RegisterOrder = () => {
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [membershipId, setMembershipId] = useState(null);
// Define package prices
const packagePrices = {

  gold: 5000,
  diamond: 10000,
};

// Define feature prices
const featurePrices = {
  additionalBranch: 2500,
  additionalDoctor: 1500,
  banner: 5000,
  premiumBanner: 10000,
  video: 1000,
  premiumVideo: 2500,
};

// ✅ Pass formData as parameter
const calculateSubtotal = (formData) => {
  if (!formData) return 0;

  let subtotal = 0;

  if (formData.package) {
    const pkg = formData.package.toLowerCase(); // normalize
    subtotal += packagePrices[pkg] || 0;
  }

  subtotal += (formData.additionalBranch || 0) * featurePrices.additionalBranch;
  subtotal += (formData.additionalDoctor || 0) * featurePrices.additionalDoctor;
  subtotal += (formData.banner || 0) * featurePrices.banner;
  subtotal += (formData.premiumBanner || 0) * featurePrices.premiumBanner;
  subtotal += (formData.video || 0) * featurePrices.video;
  subtotal += (formData.premiumVideo || 0) * featurePrices.premiumVideo;

  return subtotal;
};
// ✅ Pass formData as parameter
const calculateTotal = (formData) => {
  if (!formData) return { baseAmount: 0, cgst: 0, sgst: 0, total: 0 };

  let baseAmount = 0;

  if (formData.package) {
    baseAmount += packagePrices[formData.package] || 0;
  }
  baseAmount += (formData.additionalBranch || 0) * featurePrices.additionalBranch;
  baseAmount += (formData.additionalDoctor || 0) * featurePrices.additionalDoctor;
  baseAmount += (formData.banner || 0) * featurePrices.banner;
  baseAmount += (formData.premiumBanner || 0) * featurePrices.premiumBanner;
  baseAmount += (formData.video || 0) * featurePrices.video;
  baseAmount += (formData.premiumVideo || 0) * featurePrices.premiumVideo;

  const cgst = baseAmount * 0.09; // 9%
  const sgst = baseAmount * 0.09; // 9%
  const total = baseAmount + cgst + sgst;

  return {
    baseAmount,
    cgst,
    sgst,
    total
  };
};

// Calculate valid-to date from valid-from date and validity days
const calculateValidTo = (validFrom, validityDays) => {
  if (!validFrom || !validityDays) return 'N/A';

  const date = new Date(validFrom);
  date.setDate(date.getDate() + parseInt(validityDays, 10));
  return date.toLocaleDateString('en-IN');
};



const generatePDF = (formData) => {
  if (!formData) return;

  const safeNumber = (num) => {
    if (typeof num !== "number" || isNaN(num)) return "0";
    return num.toLocaleString("en-IN");
  };

  const doc = new jsPDF();

  // Use only built-in fonts to avoid the 'widths' error
  doc.setFont("helvetica", "normal");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const today = new Date();

  // Company details
  const gstin = "33CVZPB6682D1Z9";

  // Add logos to the PDF
  doc.addImage(akTechLogo, "JPG", margin, 15, 30, 30);
  doc.addImage(medbookLogo, "JPG", pageWidth - 50, 15, 30, 30);

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
    doc.text(
      `${formData.district || ""} ${
        formData.pincode ? "- " + formData.pincode : ""
      }`,
      margin,
      billToY
    );
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

  const invoiceNumber = membershipId
    ? `${membershipId}`
    : `MB-${today.getTime()}`;
  doc.text(`Invoice #: ${invoiceNumber}`, pageWidth - margin, 90, {
    align: "right",
  });
  doc.text(`Date: ${today.toLocaleDateString()}`, pageWidth - margin, 97, {
    align: "right",
  });

  // Calculate due date (30 days from now)
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 30);
  doc.text(`Due Date: ${dueDate.toLocaleDateString()}`, pageWidth - margin, 104, {
    align: "right",
  });

  // Define column positions with proper margins
  const colDesc = margin + 10;
  const colQty = pageWidth - 90;
  const colRate = pageWidth - 60;
  const colAmt = pageWidth - margin;

  // Line separator above header
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, 140, pageWidth - margin, 140);

  // Table header background
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, 145, pageWidth - margin * 2, 10, "F");

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
    const pkg = formData.package.toLowerCase();
    const packageRate = packagePrices[pkg] || 0;

    doc.setFontSize(11);
    doc.text(
      `${formData.package.charAt(0).toUpperCase() + formData.package.slice(1)} Package`,
      colDesc,
      yPos
    );
    doc.text("1", colQty, yPos, { align: "center" });
    doc.text(`Rs.${safeNumber(packageRate)}`, colRate, yPos, { align: "right" });
    doc.text(`Rs.${safeNumber(packageRate)}`, colAmt, yPos, { align: "right" });
    yPos += 8;
  }

  // Add Row Function
  const addRow = (label, qty, rate) => {
    if (qty > 0) {
      doc.text(label, colDesc, yPos);
      doc.text(qty.toString(), colQty, yPos, { align: "center" });
      doc.text(`Rs.${safeNumber(rate)}`, colRate, yPos, { align: "right" });
      doc.text(`Rs.${safeNumber(qty * rate)}`, colAmt, yPos, { align: "right" });
      yPos += 8;
    }
  };

  addRow("Additional Branches", formData.additionalBranch, featurePrices.additionalBranch);
  addRow("Additional Doctors", formData.additionalDoctor, featurePrices.additionalDoctor);
  addRow("Banners", formData.banner, featurePrices.banner);
  addRow("Premium Banners", formData.premiumBanner, featurePrices.premiumBanner);
  addRow("Videos", formData.video, featurePrices.video);
  addRow("Premium Videos", formData.premiumVideo, featurePrices.premiumVideo);

  // Line above totals
  yPos += 5;
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Totals (with formData passed)
  const subtotal = calculateSubtotal(formData);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  // Subtotal
  doc.text("Sub Total", colRate, yPos, { align: "right" });
  doc.text(`Rs.${safeNumber(subtotal)}`, colAmt, yPos, { align: "right" });
  yPos += 8;

  // CGST
  doc.text("CGST (9%)", colRate, yPos, { align: "right" });
  doc.text(`Rs.${safeNumber(cgst)}`, colAmt, yPos, { align: "right" });
  yPos += 8;

  // SGST
  doc.text("SGST (9%)", colRate, yPos, { align: "right" });
  doc.text(`Rs.${safeNumber(sgst)}`, colAmt, yPos, { align: "right" });
  yPos += 8;

  // Total
  doc.setFontSize(14);
  doc.setTextColor(0, 100, 0);
  doc.text("TOTAL", colRate, yPos, { align: "right" });
  doc.text(`Rs.${safeNumber(total)}`, colAmt, yPos, { align: "right" });
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
      `Validity: ${formData.validFrom} to ${calculateValidTo(
        formData.validFrom,
        formData.validityDays
      )} (${formData.validityDays} days)`,
      pageWidth - margin,
      yPos,
      { align: "right" }
    );
  }
  yPos += 20;

  // ✅ Footer note
  const noteY = pageHeight - 10;
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "italic");

  doc.text(
    "* This is a system-generated invoice and does not require a signature *",
    pageWidth / 2,
    noteY,
    { align: "center" }
  );

  // Force Terms & Conditions to start on page 2
  doc.addPage();

  let currentY = margin;

  // Heading
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Terms & Conditions", margin, currentY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);

  currentY += 10;
  const termsText = `AK TECHNOLOGIES it is not a part or supported by any of the existing company. It may be clearly understood by those entering into an agreement to list their names in the proposed Mobile App that this Mobile App should not be misunderstood as from any other existing company.

AK TECHNOLOGIES does not assume responsibility of enforcing licensing requirements or to check for licenses with respect to licensed professions prior to accepting advertising agreements.

AK TECHNOLOGIES does not assume responsibility of the Trade mark(s), Trade Name(s), Portraits, Pictures or illustrations given in the advertisements matter and the advertiser must assume the responsibility of any liability which may arise on account of any claim of its infringement or otherwise by any party.

Payments overdue beyond the due date will attract 24% interest.

AK TECHNOLOGIES will not be responsible for any cash payments, payments must be made by cheque / DD Favoring / UPI - AK TECHNOLOGIES Only.

AK TECHNOLOGIES will not entertain any claim for refund of full or part of payment made under any circumstances. AK TECHNOLOGIES reserves the right to cancel the contract for non-payment or in case any balance is pending before the release of the Mobile App. The paid amount will not be adjusted for an equivalent package or any other considerations whatsoever.

AK TECHNOLOGIES will not be liable for error or deviations or omissions, if any, in advertisements / listings. Any liability for any claims, demands or units resulting from the contents of advertisements submitted and published will rest entirely with the advertiser.

AK TECHNOLOGIES agrees to exercise reasonable care to ensure that all entries are updated correctly in its Mobile App. AK TECHNOLOGIES will not entertain any claim for compensation if any representation is cancelled, omitted, abbreviated or inserted incorrectly either as to the wordings, space or position in the Mobile App or otherwise.

AK TECHNOLOGIES reserves the unconditional right to amend or alter any or all of the above clauses and to add further clauses to those mentioned above.

Every signatory of this contract is deemed to have read and understood the terms and conditions before signing this contract and therefore cannot plead ignorance of the said terms and conditions.

All disputes will be subject to Coimbatore Jurisdiction only.`;
  // Wrap text inside margins
  const wrappedText = doc.splitTextToSize(termsText, pageWidth - margin * 2);
  const lineHeight = 6;

  wrappedText.forEach((line) => {
    if (currentY > pageHeight - margin) {
      doc.addPage();
      currentY = margin + 20;
    }
    doc.text(line, margin, currentY);
    currentY += lineHeight;
  });

if (formData.executiveName || formData.executiveId || formData.executiveMobile) {
  // Heading
  doc.setFontSize(13);
  doc.setTextColor(0, 51, 153); // Dark blue
  doc.setFont("helvetica", "bold");
  doc.text("Executive Details", margin, currentY);

  // Reset style for values
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Add smaller spacing
  let y = currentY + 8; // 🔹 closer to heading

  if (formData.executiveId) {
    doc.text(`ID: ${formData.executiveId}`, margin, y);
    y += 7; // 🔹 tighter spacing
  }
  if (formData.executiveName) {
    doc.text(`Name: ${formData.executiveName}`, margin, y);
    y += 7;
  }
  if (formData.executiveMobile) {
    doc.text(`Mobile: ${formData.executiveMobile}`, margin, y);
    y += 7;
  }

  currentY = y + 12; // 🔹 add neat padding after section
}


  // Save PDF
  doc.save(
    `MedBook_Invoice_${formData.addInName || "Unknown"}_${today.getTime()}.pdf`
  );
};


  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://medbook-backend-1.onrender.com/api/memberships');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.result) {
        setMemberships(data.resultData);
      } else {
        throw new Error(data.message || 'Failed to fetch memberships');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching memberships:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleRowClick = (membership) => {
    setSelectedMembership(membership);
    setActiveTab('details');
  };

  const getStatus = (validTo) => {
    if (!validTo) return 'Unknown';
    
    const today = new Date();
    const validToDate = new Date(validTo);
    
    if (validToDate < today) {
      return 'Expired';
    } else {
      return 'Active';
    }
  };

  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading memberships...</p>
    </div>
  );

  const renderError = () => (
    <div className="error-container">
      <h3>Error Loading Data</h3>
      <p>{error}</p>
      <button onClick={fetchMemberships} className="retry-button">
        Try Again
      </button>
    </div>
  );

  const renderMembershipList = () => (
    <div className="membership-list">
      <div className="list-header">
        <h2>Membership Registrations</h2>
        <button onClick={fetchMemberships} className="refresh-button">
          Refresh
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Membership Code</th>
              <th>Business Name</th>
              <th>Contact Person</th>
              <th>Mobile</th>
              <th>Package</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>System Status</th>
              <th>Expiry Status</th>
              <th>Additional Doctors</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership) => {
              const expiryStatus = getStatus(membership.validTo);
              return (
                <tr key={membership.id} onClick={() => handleRowClick(membership)}>
                  <td>{membership.id}</td>
                  <td>{membership.membershipCode || 'N/A'}</td>
                  <td>{membership.addInName}</td>
                  <td>{membership.contactPerson}</td>
                  <td>{membership.mobile}</td>
                  <td>
                    <span className={`package-badge ${membership.package ? membership.package.toLowerCase() : 'unknown'}`}>
                      {membership.package || 'N/A'}
                    </span>
                  </td>
                  <td>{formatDate(membership.validFrom)}</td>
                  <td>{formatDate(membership.validTo)}</td>
                  <td>{membership.status || 'N/A'}</td>
                  <td>
                    <span className={`status-${expiryStatus.toLowerCase()}`}>
                      {expiryStatus}
                    </span>
                  </td>
                  <td>{membership.additionalDoctor || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMembershipDetails = () => {
    if (!selectedMembership) return null;
    
    const m = selectedMembership;
    const expiryStatus = getStatus(m.validTo);
    
  return (
  <div className="membership-details container mt-4">
    <div className="card shadow-sm p-3 rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Title */}
        <h2 className="mb-0 text-primary fw-bold">Membership Details</h2>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setActiveTab("list")}
          >
            <i className="fas fa-arrow-left me-2"></i> Back to List
          </button>

          <button
            className="btn btn-success"
            onClick={() => generatePDF(m)}
          >
            <i className="fas fa-file-pdf me-2"></i> Download PDF
          </button>
        </div>
      </div>
    </div>


        
        <div className="details-card">
          <div className="card-header">
            <div>
              <h3>{m.addInName || 'N/A'}</h3>
              <span className={`status-badge status-${expiryStatus.toLowerCase()}`}>
                {expiryStatus}
              </span>
            </div>
            <div className="membership-code">{m.membershipCode || 'Pending Assignment'}</div>
          </div>
          
          <div className="card-body">
            <div className="details-grid">
              <div className="detail-group">
                <h4>Contact Information</h4>
                <div className="detail-item">
                  <span className="label">Contact Person:</span>
                  <span className="value">{m.contactPerson || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Mobile:</span>
                  <span className="value">{m.mobile || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Additional No:</span>
                  <span className="value">{m.additionalNo || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{m.email || 'N/A'}</span>
                </div>
                {m.website && (
                  <div className="detail-item">
                    <span className="label">Website:</span>
                    <span className="value">
                      <a href={m.website} target="_blank" rel="noopener noreferrer">
                        {m.website}
                      </a>
                    </span>
                  </div>
                )}
              </div>
              
              <div className="detail-group">
                <h4>Address</h4>
                <div className="detail-item">
                  <span className="label">Address:</span>
                  <span className="value">
                    {[m.address1, m.address2].filter(Boolean).join(', ') || 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">District:</span>
                  <span className="value">{m.district || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Pincode:</span>
                  <span className="value">{m.pincode || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Franchise Branch:</span>
                  <span className="value">{m.franchiseBranch || 'N/A'}</span>
                </div>
              </div>
              
              <div className="detail-group">
                <h4>Membership Details</h4>
                <div className="detail-item">
                  <span className="label">Category:</span>
                  <span className="value">{m.category || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Sub Category:</span>
                  <span className="value">{m.subCategory || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Sub Sub Category:</span>
                  <span className="value">{m.subSubCategory || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Package:</span>
                  <span className={`value package-badge ${m.package ? m.package.toLowerCase() : 'unknown'}`}>
                    {m.package || 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="detail-group">
                <h4>Validity & Features</h4>
                <div className="detail-item">
                  <span className="label">Valid From:</span>
                  <span className="value">{formatDate(m.validFrom)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Valid To:</span>
                  <span className="value">{formatDate(m.validTo)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Validity Days:</span>
                  <span className="value">{m.validityDays || 'N/A'} days</span>
                </div>
                <div className="detail-item">
                  <span className="label">Banner Ads:</span>
                  <span className="value">{m.banner || 0} standard, {m.premiumBanner || 0} premium</span>
                </div>
                <div className="detail-item">
                  <span className="label">Video Ads:</span>
                  <span className="value">{m.video || 0} standard, {m.premiumVideo || 0} premium</span>
                </div>
                <div className="detail-item">
                  <span className="label">Additional Branches:</span>
                  <span className="value">{m.additionalBranch || 0}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Additional Doctors:</span>
                  <span className="value">{m.additionalDoctor || 0}</span>
                </div>
              </div>
              
              <div className="detail-group">
                <h4>Payment Information</h4>
                <div className="detail-item">
                  <span className="label">Payment Mode:</span>
                  <span className="value">{m.paymentMode || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Transaction ID:</span>
                  <span className="value">{m.transactionId || 'N/A'}</span>
                </div>
              </div>
              
              <div className="detail-group">
                <h4>Executive Information</h4>
                <div className="detail-item">
                  <span className="label">Executive ID:</span>
                  <span className="value">{m.executiveId || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Executive Name:</span>
                  <span className="value">{m.executiveName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Executive Mobile:</span>
                  <span className="value">{m.executiveMobile || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-group">
                <h4>System Info</h4>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className="value">{m.status || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="meta-info">
              <span>Created: {formatDate(m.createdAt)}</span>
              <span>Last Updated: {formatDate(m.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  return (
    <div className="register-order-container">
      {activeTab === 'list' ? renderMembershipList() : renderMembershipDetails()}
    </div>
  );
};

export default RegisterOrder;