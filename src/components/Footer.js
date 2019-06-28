import React from 'react';
import { Footer as ReactFooter } from "@windingtree/wt-ui-react";

const Footer = () => (
  <ReactFooter
          copyrightHref="https://windingtree.com"
          copyrightText="Winding Tree"
        >
          <div className="col-6 col-md-3">
            <dl className="mb-1">
              <dt className="mb-1">About</dt>
              <dd>
                <nav className="nav flex-column small">
                  <a
                    href="https://windingtree.com"
                    className="nav-link px-0 text-white text--alpha-inverse"
                  >
                    Homepage
                  </a>
                  <a
                    href="https://blog.windingtree.com/"
                    className="nav-link px-0 text-white text--alpha-inverse"
                  >
                    Blog
                  </a>
                  <a
                    href="https://developers.windingtree.com"
                    className="nav-link px-0 text-white text--alpha-inverse"
                  >
                    Developer portal
                  </a>
                </nav>
              </dd>
            </dl>
          </div>
          <div className="col-6 col-md-3">
            <dl className="mb-1">
              <dt className="mb-1">Developers</dt>
              <dd>
                <nav className="nav flex-column small">
                  <a
                    href="https://github.com/windingtree/wt-guarantee-generator"
                    className="nav-link px-0 text-white text--alpha-inverse"
                  >
                    Source code
                  </a>
                  <a
                    href="https://github.com/windingtree"
                    className="nav-link px-0 text-white text--alpha-inverse"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://groups.google.com/forum/#!forum/windingtree"
                    className="nav-link px-0 text-white text--alpha-inverse"
                  >
                    Google Group
                  </a>
                </nav>
              </dd>
            </dl>
          </div>
        </ReactFooter>
);

export default Footer;
