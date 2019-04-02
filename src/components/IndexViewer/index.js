import React from 'react';
import { WtJsLibs } from '@windingtree/wt-js-libs';
import HotelIndexViewer from './HotelIndexViewer';
import AirlineIndexViewer from './AirlineIndexViewer';


export default ({ index }) => {
  const libs = WtJsLibs.createInstance({
    segment: index.segment,
    dataModelOptions: {
      provider: `https://${index.network}.infura.io/`,
    },
  });
  const instance = libs.getWTIndex(index.address);

  if (index.segment === 'hotels') {
    return <HotelIndexViewer instance={instance} network={index.network} />;
  } if (index.segment === 'airlines') {
    return <AirlineIndexViewer instance={instance} network={index.network} />;
  }
  return (
    <div>
      <h1>
Unknown index segment
        {index.segment}
        {' '}
on
        {index.address}
      </h1>
    </div>
  );
};
