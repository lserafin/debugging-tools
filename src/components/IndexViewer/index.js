import React, {Component} from 'react';
import { WtJsLibs } from '@windingtree/wt-js-libs';
import SwarmAdapter from '@windingtree/off-chain-adapter-swarm';
import HttpAdapter from '@windingtree/off-chain-adapter-http';
import { SWARM_GATEWAY } from '../../constants';
import IndexView from './IndexView';

class IndexViewer extends Component {
   state = {
    directory: undefined,
  };

  async _setDirectory (index) {
    const libs = WtJsLibs.createInstance({
      onChainDataOptions: {
        provider: `https://${index.network}.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
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
    const entrypoint = libs.getEntrypoint(index.entrypoint);
    this.setState({
      directory: await entrypoint.getSegmentDirectory(index.segment),
    });
  }

  async componentWillMount() {
    const { index } = this.props;
    await this._setDirectory(index);
  }

  async componentDidUpdate(prevProps) {
    const { index } = this.props;
    if (index.address === prevProps.index.address) {
      return;
    }
    await this._setDirectory(index);
  }

  render() {
    const { index, ethAddress } = this.props;
    const { directory } = this.state;
    return (<div>
      {directory && <IndexView instance={directory} network={index.network} readApi={index.readApi} segment={index.segment} ethAddress={ethAddress} />}
    </div>);
  }
}

export default IndexViewer;
