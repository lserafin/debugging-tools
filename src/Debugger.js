import React, { Component } from 'react';
import { Form } from '@windingtree/wt-ui-react';
import Header from './components/Header';
import Footer from './components/Footer';
import IndexViewer from './components/IndexViewer';
import indices from './wt-indices';

class Debugger extends Component {
  state = {
    index: indices.length && indices[0],
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

  render() {
    const { index } = this.state;
    const options = indices.map((l) => {
      return (<option key={l.name} value={l.address}>{l.name} ({l.address})</option>);
    });
    return (
      <div>
        <Header />
        <div className="container mt-1">
          <Form.Group controlId="index">
            <Form.Control as="select" onChange={this.onIndexChange}>
              {options}
            </Form.Control>
          </Form.Group>
          <div className="mt-2">
            {! index && (<div className="alert alert-info">Select Winding Tree index first.</div>)}
            {index && <IndexViewer index={index} />}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Debugger;
