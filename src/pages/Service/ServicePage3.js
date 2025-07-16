import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getServiceById } from '../../api/api'; // adjust path if needed

function ServicePage3() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    getServiceById(serviceId)
      .then((res) => {
        if (res.data?.result === 'Success') {
          setService(res.data.resultData);
        }
      })
      .catch((err) => {
        console.error('Error fetching service:', err);
      });
  }, [serviceId]);

  if (!service) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      {/* Banner */}
      {service.bannerUrl && (
        <div className="mb-4">
          <img
            src={service.bannerUrl}
            alt="Banner"
            className="img-fluid rounded w-100"
            style={{ maxHeight: '300px', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Profile Image & Main Info */}
      <div className="text-center mb-4">
        <img
          src={service.imageUrl}
          alt={service.serviceName}
          className="rounded-circle border"
          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        />
        <h3 className="mt-3">{service.serviceName}</h3>
        <p className="mb-0 fw-bold">{service.businessName}</p>
        <p className="text-secondary">{service.location}</p>
      </div>

      {/* Other Details */}
      <div className="row mb-4">
        <div className="col-md-6">
          <ul className="list-group">
            <li className="list-group-item"><strong>Phone:</strong> {service.phone}</li>
            <li className="list-group-item"><strong>WhatsApp:</strong> {service.whatsapp}</li>
            <li className="list-group-item"><strong>Experience:</strong> {service.experience} years</li>
          </ul>
        </div>
        <div className="col-md-6">
          <ul className="list-group">
            <li className="list-group-item"><strong>Address Line 1:</strong> {service.addressLine1}</li>
            <li className="list-group-item"><strong>Address Line 2:</strong> {service.addressLine2}</li>
            {service.mapLink && (
              <li className="list-group-item">
                <strong>Map:</strong>{' '}
                <a href={service.mapLink} target="_blank" rel="noopener noreferrer">
                  View Location
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* About Section */}
      {service.about && (
        <div className="mb-4">
          <h5>About</h5>
          <p className="border p-3 rounded bg-light">{service.about}</p>
        </div>
      )}

      {/* YouTube Video */}
      {service.youtubeLink && (
        <div className="mb-4 text-center">
          <a
            href={service.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-danger"
          >
            View Video
          </a>
        </div>
      )}

      {/* Gallery Carousel */}
      {service.gallery && service.gallery.length > 0 && (
        <div className="mb-5">
          <h5 className="mb-3">Gallery</h5>
          <div id="serviceGalleryCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {service.gallery.map((img, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <img
                    src={img}
                    className="d-block w-100 rounded"
                    alt={`Gallery ${index + 1}`}
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
            {service.gallery.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#serviceGalleryCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#serviceGalleryCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicePage3;
