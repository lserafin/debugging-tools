import React from 'react';

const Header = () => (
  <div id="app-header">
    <nav className="navbar navbar-expand-lg navbar-light" id="navbar">
      <div className="container">
        <a className="navbar-brand mr-2" href="/">Winding Tree</a>
        <a className="nav-link" href="/debugger">Debugger</a>
        <a className="nav-link" href="/guarantee-generator">Guarantee Generator</a>
        <a className="nav-link" href="/contract-caller">Contract Caller</a>
      </div>
    </nav>
  </div>
);

export default Header;
