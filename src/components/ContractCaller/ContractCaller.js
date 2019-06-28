import React from 'react';
import Select from 'react-select'
import Eth from 'ethjs';
import Web3Eth from 'web3-eth';
import { Button, Form } from '@windingtree/wt-ui-react';
import { MetamaskSignInGateway } from '../MetamaskGateway';
import './styles.css';

const CONTRACTS_TO_SHOW = [
  './Organization.json',
  './OrganizationFactory.json',
  './SegmentDirectory.json',
  './WindingTreeEntrypoint.json',
];
const DEFAULT_CONTRACT_INDEX = 3; // Entrypoint

class ContractCaller extends React.Component {
  state = {
    // WindingTreeEntrypoint Lisbon
    ethAddress: '0x7EB7c3B768D75C740B6d08D3b3eA411B3296ceBB',
    abi: null,
    parsedAbi: [],
    abiOK: false,
    lastResult: null,
    lastError: null,
    selectedMethod: null,
    contractAbis: null,
  };

  constructor (props) {
    super(props);
    this.callSmartContractMethod = this.callSmartContractMethod.bind(this);
    this.web3Eth = new Web3Eth(window.ethereum);
  }

  async componentWillMount() {
    this.loadAbis();
  }

  loadAbis () {
    const contracts = {};
    function requireAll(requireContext) {
      return requireContext.keys().forEach(key => contracts[key] = requireContext(key));
    }
    requireAll(require.context('@windingtree/wt-contracts/build/contracts/', false,  /^\.\/.*\.json$/));
    const abis = [];
    for (let name in contracts) {
      if (CONTRACTS_TO_SHOW.indexOf(name) !== -1) {
        const c = contracts[name];
        abis.push({ value: c.abi, label: c.contractName });
      }
    }
    this.setState({ contractAbis: abis });
    this.fillAbi(abis[DEFAULT_CONTRACT_INDEX], {action: 'select-option'});
  }

  fillAbi = (inputValue, {action}) => {
    if (action === 'select-option') {
      this.setState({
        abi: JSON.stringify(inputValue.value),
        parsedAbi: inputValue.value,
        abiOK: true,
      })
    }
  };

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

    const { ethAddress, abi, parsedAbi, abiOK, lastResult, lastError, selectedMethod, contractAbis } = this.state;

    return (
      <div>
        <label>Address</label>
        <Form.Control type="text"
                      placeholder="0x..."
                      className="form-control"
                      value={ethAddress}
                      onChange={(e) => { this.setState({ ethAddress: e.target.value }); }}/>
        <label>Contract</label>
        <Select options={contractAbis} onChange={this.fillAbi} defaultValue={contractAbis[DEFAULT_CONTRACT_INDEX]} />
        <label>ABI</label>
        <textarea className={!abiOK ? `form-control text-danger` : `form-control`}
                  value={abi}
                  onChange={(e) => { this.setState({ abi: e.target.value }); this.parseAbi() }}>
        </textarea>
        <br />
        <MetamaskSignInGateway>
          <h3>
            Functions
            <small>
              Click on a function name to set parameters and call the function.
            </small>
          </h3>
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
        </MetamaskSignInGateway>
      </div>
    );
  }

}

export default ContractCaller;