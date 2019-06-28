import React from 'react';
import { WtJsLibs } from '@windingtree/wt-js-libs';
import SwarmAdapter from '@windingtree/off-chain-adapter-swarm';
import HttpAdapter from '@windingtree/off-chain-adapter-http';
import { SWARM_GATEWAY } from '../../constants';
import IndexView from './IndexView';


export default ({ index, ethAddress }) => {
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
  return <IndexView instance={libs.getDirectory(index.segment, index.address)} network={index.network} readApi={index.readApi} segment={index.segment} ethAddress={ethAddress} />;
};
