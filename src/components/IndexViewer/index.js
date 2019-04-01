import React, { Component } from 'react';
const { WtJsLibs } = require('@windingtree/wt-js-libs');


export default ({index}) => {
  const libs = WtJsLibs.createInstance({
      segment: index.segment,
      dataModelOptions: {
        provider: `https://${index.network}.infura.io/`,
      },
    });
  const instance = libs.getWTIndex(index.address);
  console.log(instance);

  // TODO return based on segment
  return <div>{index.address}</div>
}

    