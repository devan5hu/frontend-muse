import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Muse Prototype</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/vertex" className={({ isActive }) => isActive ? 'active' : ''}>
            Vertex
          </NavLink>
        </li>
        <li>
          <NavLink to="/twelvelabs" className={({ isActive }) => isActive ? 'active' : ''}>
            TwelveLabs
          </NavLink>
        </li>
        <li>
          <NavLink to="/titan" className={({ isActive }) => isActive ? 'active' : ''}>
            Titan
          </NavLink>
        </li>
        <li>
          <NavLink to="/azure" className={({ isActive }) => isActive ? 'active' : ''}>
            Azure
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 