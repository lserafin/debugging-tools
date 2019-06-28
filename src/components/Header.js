import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <div id="app-header">
    <nav className="navbar navbar-expand-lg navbar-light" id="navbar">
      <div className="container">
        <Link className="navbar-brand mr-2" to={'/'}>Winding Tree</Link>
        <Link className="nav-link" to={'/debugger'}>Debugger</Link>
        <Link className="nav-link" to={'/guarantee-generator'}>Guarantee Generator</Link>
        <Link className="nav-link" to={'/contract-caller'}>Contract Caller</Link>
      </div>
    </nav>
  </div>
);

export default Header;
