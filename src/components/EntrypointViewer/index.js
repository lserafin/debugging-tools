import React, {Component} from 'react';
import { WtJsLibs } from '@windingtree/wt-js-libs';
import SwarmAdapter from '@windingtree/off-chain-adapter-swarm';
import HttpAdapter from '@windingtree/off-chain-adapter-http';
import { SWARM_GATEWAY } from '../../constants';
import DirectoryView from './DirectoryView';

class EntrypointViewer extends Component {
   state = {
    directory: undefined,
  };

  async _setDirectory (entrypoint) {
    const libs = WtJsLibs.createInstance({
      onChainDataOptions: {
        provider: `https://${entrypoint.network}.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
      },
      offChainDataOptions: {
        adapters: {
          'bzz-raw': {
            options: {
              swarmProviderUrl: SWARM_GATEWAY,
            },
            create: (options) => {
              return new SwarmAdapter(options);
            },
          },
          'https': {
            options: {},
            create: (options) => {
              return new HttpAdapter(options);
            },
          },
        },
      },
    });
    /*
    const entrypoint = libs.getEntrypoint(entrypoint.address);
    this.setState({
      directory: await entrypoint.getSegmentDirectory(entrypoint.segment),
    });
    */
  }

  async componentWillMount() {
    const { entrypoint } = this.props;
    await this._setDirectory(entrypoint);
  }

  async componentDidUpdate(prevProps) {
    const { entrypoint } = this.props;
    if (entrypoint.address === prevProps.entrypoint.address) {
      return;
    }
    await this._setDirectory(entrypoint);
  }

  render() {
    const { entrypoint, addressFilter } = this.props;
    const { directory } = this.state;
    return (<div>
      {directory && <DirectoryView instance={directory} network={entrypoint.network} readApi={entrypoint.readApi} segment={entrypoint.segment} addressFilter={addressFilter} />}
    </div>);
  }
}

export default EntrypointViewer;
