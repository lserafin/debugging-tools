import React from "react";
import { Alert, Form, Button } from "@windingtree/wt-ui-react";
import Web3Utils from "web3-utils";
import Web3Eth from "web3-eth";
import moment from "moment";
import qs from "query-string";
import ClipboardableSnippet from "./ClipboardableSnippet";
import { MetamaskSignInGateway } from "./MetamaskGateway";

class SigningForm extends React.Component {
  state = {
    sub: undefined,
    claimParts: {
      subject: "",
      guarantor: (window.ethereum && window.ethereum.selectedAddress) || "",
      expiresAt: moment()
        .add(1, "month")
        .format("YYYY-MM-DD HH:mm:ss")
    },
    errors: {},
    claim: "",
    signature: ""
  };

  constructor(props) {
    super(props);
    this.handleClaimPartChange = this.handleClaimPartChange.bind(this);
    this.generateClaim = this.generateClaim.bind(this);
    this.web3Eth = new Web3Eth(window.ethereum);
  }

  async componentWillMount() {
    const { sub } = this.state;
    const params = qs.parse(window.location.hash);
    if (params.msg) {
      try {
        const rawMsg = Web3Utils.hexToUtf8(params.msg);
        const msg = JSON.parse(rawMsg);
        this.setState({
          claimParts: {
            subject: msg.subject,
            guarantor: msg.guarantor,
            expiresAt: moment(msg.expiresAt).format("YYYY-MM-DD HH:mm:ss")
          },
          claim: rawMsg
        });
      } catch (e) {
        delete params.msg;
        window.location.hash = qs.stringify(params);
        this.setState({
          errors: {
            global: `Cannot process URL parameters: ${e.toString()}`
          }
        });
      }
    }
    if (!sub && !params.msg) {
      const self = this;
      this.setState({
        sub: window.ethereum.on("accountsChanged", function(accounts) {
          const { claimParts } = self.state;
          if (!claimParts.guarantor && window.ethereum.selectedAddress) {
            self.setState({
              claimParts: Object.assign({}, claimParts, {
                guarantor: window.ethereum.selectedAddress
              })
            });
          }
        })
      });
    }
  }

  handleClaimPartChange(e) {
    const name = e.target.id;
    const value = e.target.value;
    const { errors, claimParts } = this.state;
    let newClaimParts = Object.assign(claimParts, {
      [name]: value
    });
    let newErrors = {};
    if (["subject", "guarantor"].indexOf(name) > -1) {
      if (!Web3Utils.isAddress(value)) {
        newClaimParts = Object.assign(claimParts, {
          [name]: value
        });
        newErrors = Object.assign(errors, {
          [name]: "Invalid ethereum address"
        });
      }
    } else if (name === "expiresAt") {
      if (moment(value).format() === "Invalid date") {
        newClaimParts = Object.assign(claimParts, {
          [name]: value
        });
        newErrors = Object.assign(errors, {
          [name]: "Invalid date"
        });
      }
      if (!moment(value).isAfter(new Date())) {
        newClaimParts = Object.assign(claimParts, {
          [name]: value
        });
        newErrors = Object.assign(errors, {
          [name]: "Expiration has to be in the future"
        });
      }
    }

    window.location.hash = "";
    this.setState({
      claimParts: newClaimParts,
      errors: newErrors,
      signature: "",
      claim: ""
    });
  }

  generateClaim() {
    const { claimParts, errors } = this.state;
    let newClaim = "";
    if (
      claimParts.subject &&
      claimParts.guarantor &&
      claimParts.expiresAt &&
      !Object.keys(errors).length
    ) {
      newClaim = JSON.stringify(
        Object.assign({}, claimParts, {
          expiresAt: (moment(claimParts.expiresAt).valueOf()) / 1000
        })
      );
    }
    window.location.hash = qs.stringify({
      msg: Web3Utils.utf8ToHex(newClaim)
    });
    this.setState({
      claim: newClaim,
      signature: ""
    });
  }

  render() {
    // no metamask
    if (typeof window.ethereum === "undefined") {
      return <React.Fragment />;
    }
    const { claimParts, errors, claim, signature } = this.state;

    return (
      <div className="container">
        <div className="container mb-2">
          {errors.global && (
            <Alert variant="danger" show dismissible={true}>
              {errors.global}
            </Alert>
          )}
          <h3>1. Claim</h3>
          <Form.Group controlId="subject">
            <Form.Label>ORG.ID (Subject's Ethereum address)</Form.Label>
            <Form.Control
              type="text"
              placeholder="0x..."
              value={claimParts.subject}
              onChange={this.handleClaimPartChange}
              className={errors.subject ? `is-invalid` : ""}
            />
            <Form.Text className="text-muted">
              This is the address assigned to the 0xORG smart contract.
            </Form.Text>
            {errors.subject && (
              <Form.Text className="text-danger">{errors.subject}</Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="guarantor">
            <Form.Label>Guarantor's Ethereum address</Form.Label>
            <Form.Control
              type="text"
              placeholder="0x..."
              value={claimParts.guarantor}
              onChange={this.handleClaimPartChange}
              className={errors.guarantor ? `is-invalid` : ""}
            />
            <Form.Text className="text-muted">
              This address will be used when checking the trust level of the
              hotel. It should be set as an <code>associatedKey</code> in an ORG.ID.
            </Form.Text>
            {errors.guarantor && (
              <Form.Text className="text-danger">{errors.guarantor}</Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="expiresAt">
            <Form.Label>Expiration date and time</Form.Label>
            <Form.Control
              type="string"
              value={claimParts.expiresAt}
              onChange={this.handleClaimPartChange}
              className={errors.expiresAt ? `is-invalid` : ""}
            />
            {errors.expiresAt && (
              <Form.Text className="text-danger">{errors.expiresAt}</Form.Text>
            )}
          </Form.Group>
          <Button
            onClick={this.generateClaim}
            block={true}
            disabled={
              !(
                claimParts.subject &&
                claimParts.guarantor &&
                claimParts.expiresAt
              ) || Object.keys(errors).length
            }
          >
            Generate claim
          </Button>
          {claim && (
            <div>
              <h4 className="mt-1">Serialized claim</h4>
              <ClipboardableSnippet contents={claim} />
              <h4 className="mt-1">Hex-encoded serialized claim</h4>
              <ClipboardableSnippet contents={Web3Utils.utf8ToHex(claim)} />
            </div>
          )}
        </div>
        <div className="container mb-2">
          <h3>2. Signature</h3>
          <div>
            <MetamaskSignInGateway>
              {signature && <ClipboardableSnippet contents={signature} />}
              <Button
                onClick={() => {
                  this.web3Eth.personal
                    .sign(claim, window.ethereum.selectedAddress)
                    .then(signature => {
                      this.setState({
                        signature
                      });
                    });
                }}
                active={false}
                block={true}
                disabled={
                  signature ||
                  !claim ||
                  !window.ethereum.selectedAddress ||
                  window.ethereum.selectedAddress.toLowerCase() !==
                    claimParts.guarantor.toLowerCase()
                }
                outlined={false}
                className=""
              >
                Create signature
              </Button>
              {(!claim ||
                !window.ethereum.selectedAddress ||
                window.ethereum.selectedAddress.toLowerCase() !==
                  claimParts.guarantor.toLowerCase()) && (
                <p className="text-muted">
                  You can sign the claim if it is generated and if you are
                  logged into Metamask with the same address as Guarantor's
                  address.
                </p>
              )}
              {signature && (
                <React.Fragment>
                  <p className="mt-1">
                    <a
                      href="https://www.etherchain.org/tools/verifySignature"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verify independently on Etherchain:
                    </a>
                  </p>
                  <ClipboardableSnippet
                    contents={`{
  "version": "2",
  "address": "${claimParts.guarantor}",
  "msg": "${Web3Utils.utf8ToHex(claim)}",
  "sig": "${signature}"
}`}
                  />
                </React.Fragment>
              )}
            </MetamaskSignInGateway>
          </div>
        </div>

        {claim && signature && (
          <div className="container mb-2">
            <h3>4. Result</h3>
            <ClipboardableSnippet
              contents={`{
  "claim": "${Web3Utils.utf8ToHex(claim)}",
  "signature": "${signature}"
}`}
            />
            <p>Send the result back to the ORG.ID owner.</p>
          </div>
        )}
      </div>
    );
  }
}

export default SigningForm;
