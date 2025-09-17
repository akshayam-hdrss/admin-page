import React, { useState, useEffect } from 'react';
import './RegisterOrder.css';

const RegisterOrder = () => {
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="membership-details">
        <div className="details-header">
          <h2>Membership Details</h2>
          <button className="back-button" onClick={() => setActiveTab('list')}>
            &larr; Back to List
          </button>
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
