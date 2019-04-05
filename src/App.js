import React, { Component } from 'react';
import { Footer, Form } from '@windingtree/wt-ui-react';
import Header from './components/Header';
import IndexViewer from './components/IndexViewer';
import indices from './wt-indices';

class App extends Component {
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
        <Footer copyrightHref="https://windingtree.com" copyrightText="Winding Tree">
          <div className="col-6 col-md-3">
            <dl className="mb-1">
              <dt className="mb-1">About</dt>
              <dd>
                <nav className="nav flex-column small">
                  <a href="https://windingtree.com" className="nav-link px-0 text-white text--alpha-inverse">Homepage</a>
                  <a href="https://blog.windingtree.com/" className="nav-link px-0 text-white text--alpha-inverse">Blog</a>
                  <a href="https://developers.windingtree.com" className="nav-link px-0 text-white text--alpha-inverse">Developer portal</a>
                </nav>
              </dd>
            </dl>
          </div>
          <div className="col-6 col-md-3">
            <dl className="mb-1">
              <dt className="mb-1">Developers</dt>
              <dd>
                <nav className="nav flex-column small">
                  <a href="https://github.com/windingtree/wt-index-debugger" className="nav-link px-0 text-white text--alpha-inverse">Source code</a>
                  <a href="https://github.com/windingtree" className="nav-link px-0 text-white text--alpha-inverse">GitHub</a>
                  <a href="https://groups.google.com/forum/#!forum/windingtree" className="nav-link px-0 text-white text--alpha-inverse">Google Group</a>
                </nav>
              </dd>
            </dl>
          </div>
        </Footer>
      </div>
    );
  }
}

export default App;
