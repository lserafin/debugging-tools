import React, { Component } from 'react';
import { Form } from '@windingtree/wt-ui-react';
import Header from './components/Header';
import Footer from './components/Footer';
import IndexViewer from './components/IndexViewer';
import indices from './wt-indices';

class Debugger extends Component {
  state = {
    index: indices.length && indices[0],
    ethAddress: '',
  };

  constructor(props) {
    super(props);
    this.onIndexChange = this.onIndexChange.bind(this);
  }

  async onIndexChange (e) {
    const selectedIndex = indices.find((i) => i.address === e.target.value);
    this.setState({
      index: selectedIndex
    });
  }

  componentWillMount () {
    const params = this.props.match.params;
    if (params.organizationAddress) {
      this.setState({
        ethAddress: params.organizationAddress,
      });
    }
    if (params.indexAddress) {
      this.onIndexChange({target: {value: params.indexAddress}});
    }
  }

  render() {
    const { index, ethAddress } = this.state;
    const options = indices.map((l) => {
      return (<option key={l.name} value={l.address}>{l.name} ({l.address})</option>);
    });
    return (
      <div>
        <Header />
        <div className="container mt-1">
          <Form.Group controlId="index">
            <Form.Control as="select" onChange={this.onIndexChange} defaultValue={index.address}>
              {options}
            </Form.Control>
            <Form.Control type="text"
                          placeholder="optionally filter by organization address"
                          className="form-control"
                          value={ethAddress}
                          onChange={(e) => { this.setState({ ethAddress: e.target.value }); }}/>
          </Form.Group>
          <div className="mt-2">
            {! index && (<div className="alert alert-info">Select Winding Tree index first.</div>)}
            {index && <IndexViewer index={index} ethAddress={ethAddress} />}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Debugger;
