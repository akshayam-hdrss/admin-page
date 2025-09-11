import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { Button } from 'react-bootstrap';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/primecareicon', label: 'Primecare Icon' },
  { to: '/topstars', label: 'Topstars' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/hospital', label: 'Hospital' },
  { to: '/doctor', label: 'Doctor' },
  { to: '/traditional', label: 'Traditional Treatments' },
  { to: '/product', label: 'Product' },
  { to: '/service', label: 'Service' },
  { to: '/charities', label: 'Charities' },
  { to: '/event', label: 'Events' },
  { to: '/offers', label: 'Offers' },
  {to :'/stages', label:'Quiz Stages'},
  {to :'/userdata', label:'Quiz User Data'},
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // Sidebar state
  const toggleSidebar = () => setIsOpen(!isOpen); // Toggle function for sidebar

  return (
    <>
      {/* Hamburger button only visible between 600px and 800px */}
      <Button
        className="sidebar-toggle-btn d-block d-sm-none"
        onClick={toggleSidebar}
        aria-expanded={isOpen}
        variant="light"
      >
        ☰
      </Button>

      {/* Sidebar navigation */}
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">MEDBOOK</h2>
        </div>

        <ul className="sidebar-list">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link active' : 'sidebar-link'
                }
                end
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar overlay when the sidebar is open on mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
    </>
  );
}
