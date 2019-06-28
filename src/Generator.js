import React, { Component } from "react";
import Header from './components/Header';
import Footer from './components/Footer';
import { MetamaskLoadedGateway } from "./components/MetamaskGateway";
import SigningForm from "./components/SigningForm";

class Generator extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container mt-1">
          <h2 className="text-center">Generate a relationship guarantee</h2>
          <MetamaskLoadedGateway>
            <SigningForm />
          </MetamaskLoadedGateway>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Generator;
