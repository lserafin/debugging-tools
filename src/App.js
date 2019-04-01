import React, { Component } from 'react';

import { Footer } from '@windingtree/wt-ui-react';

class App extends Component {
  state = {
    index: null,
  };

  constructor(props) {
    super(props);
    this.onWTIndexChange = this.onWTIndexChange.bind(this);
  }

  onWTIndexChange (e) {
    // TODO e.target.value
  }

  render() {
    const { index } = this.state;
    // TODO list wt indexes
    const options = [].map((l) => {
      return (<option key={l.name} value={l.link}>{l.name}</option>);
    });
    return (
      <div>
        <div className="mt-2">
          {! index && (<div class="alert alert-info">Select Winding Tree index first.</div>)}
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
