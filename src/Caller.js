import React, { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { MetamaskLoadedGateway } from './components/MetamaskGateway';
import ContractCaller from "./components/ContractCaller/ContractCaller";

class Caller extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container mt-1">
          <h2 className="text-center">Call a contract</h2>
          <p>
            Set contract address and ABI (or select from preloaded contracts) and choose a function to call.
            See <a href="https://developers.windingtree.com/tutorials/how-to-call-smartcontract.html">developer portal</a> for documentation.
          </p>
          <p>
            If you have trouble calling contracts, be aware that the ABIs provided here will only work with a <code>^0.8.1</code> version of <code>@windingtree/wt-contracts</code>.
            You can get ABIs for previous version on <a href="https://cdn.jsdelivr.net/npm/@windingtree/wt-contracts/">jsDelivr</a>.
          </p>
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
