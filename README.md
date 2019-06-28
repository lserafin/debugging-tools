# Winding Tree debugging tools

The debugger provides following tools
- index debugger
- guarantee generator
- contract caller

Note that you need [Metamask](https://metamask.io/) extension to use
some features.

## Index debugger
If you are working with Winding Tree it might be sometimes necessary
to directly inspect the on-chain or off-chain data without any interference
introduced by tooling such as [Read API](https://github.com/windingtree/wt-read-api).

Choose a directory contract to browse its records. If you are only
interested in a specific hotel, you can filter by its ethereum address.

Permalinks in following format are supported:
- /debugger/:directoryAddress - share a
  link for specific directory
- /debugger/:directoryAddress/:organizationAddress
  \- share a link for specific organization
  
## Guarantee generator
Can be used to generate a guarantee claim manually.
 
See more about
[guarantee claims](https://developers.windingtree.com/onboarding/building-trust.html#2-appointed-guarantor)
on the developer portal.

## Contract caller
Interact directly with smart contracts.

Can be used to call any contract by address and ABI but is intended
mainly for use with WT contracts (and provides ABIs for them).

Use the default address of Ropsten WindingTreeEntrypoint to get
addresses of segment directories and factories.

## Requirements

- Node 10
