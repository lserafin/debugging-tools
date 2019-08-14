import React, { Component } from 'react';
import { Form } from '@windingtree/wt-ui-react';
import Header from './components/Header';
import Footer from './components/Footer';
import EntrypointViewer from './components/EntrypointViewer';
import entrypoints from './entrypoints';

class Debugger extends Component {
  state = {
    entrypoint: entrypoints.length && entrypoints[0],
  };

  constructor(props) {
    super(props);
    this.onEntrypointChange = this.onEntrypointChange.bind(this);
  }

  async onEntrypointChange (e) {
    const selectedEntrypoint = entrypoints.find((i) => i.address === e.target.value);
    this.setState({
      entrypoint: selectedEntrypoint
    });
  }

  componentDidMount () {
    // TODO fix entrypoint setting
    const params = this.props.match.params;
    if (params.entrypointAddress) {
      this.onEntrypointChange({target: {value: params.entrypoint}});
    }
  }

  render() {
    const { entrypoint } = this.state;
    const { match } = this.props;
    const options = entrypoints.map((l) => {
      return (<option key={l.name} value={l.address}>{l.name} ({l.address})</option>);
    });
    return (
      <div>
        <Header />
        <div className="container mt-1">
          <Form.Group controlId="entrypoint">
            <Form.Control as="select" onChange={this.onEntrypointChange} defaultValue={entrypoint.address}>
              {options}
            </Form.Control>
          </Form.Group>
          <div className="mt-2">
            {! entrypoint && (<div className="alert alert-info">Select Winding Tree entrypoint first.</div>)}
            {entrypoint && <EntrypointViewer entrypoint={entrypoint} urlParams={match.params} />}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Debugger;
