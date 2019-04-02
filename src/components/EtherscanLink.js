import React from 'react';

export default ({ network, address, children }) =>  <a
  href={`https://${network !== 'mainnet' ? `${network}.` : ''}etherscan.io/address/${address}`}
  target="_blank"
  rel="noopener noreferrer"
>{children}</a>;
