import React from "react";
import { Alert, Button } from "@windingtree/wt-ui-react";

const MetamaskLoadedGateway = ({ children }) => {
  if (typeof window.ethereum !== "undefined") {
    return <React.Fragment>{children}</React.Fragment>;
  } else {
    return (
      <Alert variant="warning" show dismissible={false}>
        You need to install and allow{" "}
        <a
          href="https://metamask.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Metamask
        </a>{" "}
        or another Web3 enabled browser that supports{" "}
        <a
          href="https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign"
          target="_blank"
          rel="noopener noreferrer"
        >
          eth_sign call
        </a>
        !
      </Alert>
    );
  }
};

class MetamaskSignInGateway extends React.Component {
  state = {
    inProgress: false,
    sub: undefined,
    tick: undefined,
  };

  componentWillMount() {
    const { sub } = this.state;
    if (!sub) {
      const self = this;
      this.setState({
        sub: window.ethereum.on("accountsChanged", function(accounts) {
          self.setState({ tick: new Date() });
        })
      });
    }
  }

  render() {
    const { children, blocking } = this.props;
    const { inProgress } = this.state;

    if (blocking === false || window.ethereum.selectedAddress !== undefined) {
      return <React.Fragment>{children}</React.Fragment>;
    } else {
      return (
        <Button
          onClick={() => {
            this.setState({
              inProgress: true
            });
            window.ethereum.enable().then(() => {
              this.setState({
                inProgress: false
              });
            });
          }}
          active={inProgress}
          block={true}
          disabled={inProgress}
          outlined={false}
          className="btn-warning"
        >
          You need to sign in to{" "}
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Metamask
          </a>{" "}
          first.
        </Button>
      );
    }
  }
}

export { MetamaskLoadedGateway, MetamaskSignInGateway };
