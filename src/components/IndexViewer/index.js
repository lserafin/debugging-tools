import React from 'react';
import { WtJsLibs } from '@windingtree/wt-js-libs';
import SwarmAdapter from '@windingtree/off-chain-adapter-swarm';
import HttpAdapter from '@windingtree/off-chain-adapter-http';

import IndexView from './IndexView';


export default ({ index }) => {
  const libs = WtJsLibs.createInstance({
    segment: index.segment,
    dataModelOptions: {
      provider: `https://${index.network}.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    },
    offChainDataOptions: {
      adapters: {
        'bzz-raw': {
          options: {
            swarmProviderUrl: 'https://swarm.windingtree.com',
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
  return <IndexView instance={libs.getWTIndex(index.address)} network={index.network} readApi={index.readApi} segment={index.segment} />;
};
