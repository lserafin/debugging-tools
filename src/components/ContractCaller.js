import React from 'react';
import Eth from 'ethjs';
import Web3Eth from 'web3-eth';
import { Button, Form } from '@windingtree/wt-ui-react';
import { MetamaskSignInGateway } from './MetamaskGateway';

class ContractCaller extends React.Component {
  state = {
    ethAddress: '0x1e44E361Ea97859d249592175167171f558c7562',
    // https://cdn.jsdelivr.net/npm/@windingtree/wt-contracts@0.6.1/build/contracts/WTHotelIndex.json
    abi: `[ { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "uint256" } ], "name": "organizationsByOwnerDeprecated", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "__owner", "type": "address" }, { "name": "_lifToken", "type": "address" } ], "name": "initialize", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "LifToken", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "organizationsByOwnerIndexDeprecated", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "organizationsIndex", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getOrganizations", "outputs": [ { "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getOrganizationsLength", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "organizations", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_lifToken", "type": "address" } ], "name": "setLifToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "organization", "type": "address" } ], "name": "OrganizationCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "organization", "type": "address" }, { "indexed": false, "name": "index", "type": "uint256" } ], "name": "OrganizationAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "organization", "type": "address" } ], "name": "OrganizationRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "constant": false, "inputs": [ { "name": "dataUri", "type": "string" } ], "name": "createHotel", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "hotel", "type": "address" } ], "name": "addHotel", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "dataUri", "type": "string" } ], "name": "createAndAddHotel", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "hotel", "type": "address" } ], "name": "removeHotel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getHotelsLength", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getHotels", "outputs": [ { "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "hotel", "type": "address" } ], "name": "hotelsIndex", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "index", "type": "uint256" } ], "name": "hotels", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" } ]`,
    parsedAbi: null,
    abiOK: false,
    lastResult: null,
    lastError: null,
    selectedMethod: null,
  };

  constructor (props) {
    super(props);
    this.callSmartContractMethod = this.callSmartContractMethod.bind(this);
    this.web3Eth = new Web3Eth(window.ethereum);
  }

  async componentWillMount() {
    this.parseAbi();
  }

  parseAbi () {
    let abi;
    try {
      abi = JSON.parse(this.state.abi);
    } catch (err) {
      this.setState({ abiOK: false });
      this.setState({ lastError: err });
      return undefined;
    }
    this.setState({parsedAbi: abi, abiOK: true});
    // this.state.abiOK = true;
    // this.setState({abiOK: true});

    return abi;
  }

  err (err) {
    this.setState({ lastError: err });
    console.error(this.state.lastError);
  }

  callSmartContractMethod (event, methodName) {
    event.target.blur();
    //this.state.lastResult = this.state.lastError = undefined
    let targetElement = event.target.parentElement.parentElement;
    let args = Array.from(
      targetElement.querySelectorAll('input[type=text]').values()
    ).map(el => el.value);
    try {
      this._callSmartContractMethod(methodName, args).catch(this.err.bind(this));
    } catch (err) {
      this.err(err);
    }
  }

  _callSmartContractMethod (methodName, args) {
    // let self = this;
    console.log('Calling ' + methodName + '(' + args.join(', ') + ')');
    if (!window.ethereum || !window.web3) throw new Error('Missing ethereum provider, consider installing Metamask');
    window.ethereum.enable();
    let eth = new Eth(window.web3.currentProvider);
    if (!this.state.parsedAbi) throw new Error('ABI missing or not a json.');
    return eth.accounts().then((accounts) => {
      const contract = eth.contract(this.state.parsedAbi, undefined, {
        from: accounts[0],
        gas: 3000000,
      }).at(this.state.ethAddress);
      console.log(methodName);
      console.log(args);
      return contract[methodName](...args).then((result) => {
        this.setState({ lastResult: result });
        console.log(result);
        console.log(JSON.stringify(result, null, 2));
      }).catch(this.err.bind(this));
    });
  }

  render () {
    // no metamask
    if (typeof window.ethereum === 'undefined') {
      return <React.Fragment/>;
    }

    const { ethAddress, abi, parsedAbi, abiOK, lastResult, lastError, selectedMethod } = this.state;

    return (
      <div>
        <h3>
          Functions
        </h3>
        <em>
          Smart contract on {ethAddress} has following functions to call. Click on a function name to
          set parameters and call the function.
        </em>
        <MetamaskSignInGateway>
          {parsedAbi.map((entry) => {
            return (entry.type === 'function') && <div key={entry.name}>
            <span className={entry.name === selectedMethod ? `card` : ``}>
              <span onClick={() => { this.setState({ selectedMethod: selectedMethod === entry.name ? null : entry.name }); }}
                    className="btn btn-link">
                 {entry.name}
              </span>

              {selectedMethod === entry.name && <span className="input-group">
                {entry.inputs.map((input) => {
                  return <Form.Control type="text" className="form-control" placeholder={input.name} key={input.name}/>;
                })}
                <Button onClick={(e) => this.callSmartContractMethod(e, entry.name)}
                        className="btn form-control btn-primary">
                  Call!
                </Button>
              </span>}
            </span>
            </div>;
          })}

          <label>Address</label>
          <Form.Control type="text"
                        placeholder="0x..."
                        className="form-control"
                        value={ethAddress}
                        onChange={(e) => { this.setState({ ethAddress: e.target.value }); }}/>
          <label>ABI</label>
          <textarea className={!abiOK ? `form-control text-danger` : `form-control`}
                    value={abi}
                    onChange={(e) => { this.setState({ abi: e.target.value }); }}>
          </textarea>
        </MetamaskSignInGateway>

        {lastResult && (<div className="alert alert-success alert-dismissable" role="alert">
          <h4 className="alert-heading">Result:</h4>
          <pre>{JSON.stringify(lastResult, null, 2)}</pre>
          <br/>
          <Button className="btn" onClick={() => { this.setState({ lastResult: null });}}>
            Close
          </Button>
        </div>)}

        {lastError && <div className="alert alert-danger alert-dismissable" role="alert">
          <strong>ERROR:</strong> {lastError.toString()} <br/>
          <button className="btn" onClick={() => { this.setState({ lastError: null });}}>
            Close
          </button>
        </div>}
      </div>
    );
  }

}

export default ContractCaller;