import React, { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { MetamaskLoadedGateway } from './components/MetamaskGateway';
import ContractCaller from "./components/ContractCaller";

class Caller extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container mt-1 caller">
          <h2 className="text-center">Call a contract</h2>
          <MetamaskLoadedGateway>
            <ContractCaller />
          </MetamaskLoadedGateway>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Caller;
