import React, {Component} from 'react';
import { Form } from '@windingtree/wt-ui-react';
import { WtJsLibs } from '@windingtree/wt-js-libs';
import SwarmAdapter from '@windingtree/off-chain-adapter-swarm';
import HttpAdapter from '@windingtree/off-chain-adapter-http';
import { SWARM_GATEWAY } from '../../constants';
import DirectoryView from './DirectoryView';

class EntrypointViewer extends Component {
   state = {
    libs: undefined,
    entrypointInst: undefined,
    selectedDirectoryInst: undefined,
    selectedDirectory: '',
    directories: [],
    addressFilter: '',
  };

  constructor(props) {
    super(props);
    this.onDirectoryChange = this.onDirectoryChange.bind(this);
  }

  _getLibs (entrypoint) {
    const { libs } = this.state;
    if (!entrypoint.network) {
      return libs;
    }
    if (libs &&
      libs.options &&
      libs.options.onChainDataOptions &&
      libs.options.onChainDataOptions.provider &&
      libs.options.onChainDataOptions.provider.indexOf(entrypoint.network) > -1) {
      return libs;
    }
    return WtJsLibs.createInstance({
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
  }

  async _setupEntrypoint (entrypoint) {
    const libs = this._getLibs(entrypoint);
    const entrypointInst = libs.getEntrypoint(entrypoint.address);
    const directories = await entrypointInst.getSegments();
    this.setState({
      libs,
      entrypointInst,
      directories,
      selectedDirectoryInst: await entrypointInst.getSegmentDirectory(directories[0]),
      selectedDirectory: directories[0],
    });
  }

  async onDirectoryChange (e) {
    const selectedSegmentName = e.target.value;
    if (selectedSegmentName) {
      const { entrypointInst } = this.state;
      this.setState({
        selectedDirectoryInst: await entrypointInst.getSegmentDirectory(selectedSegmentName),
        selectedDirectory: selectedSegmentName,
      });
    }
  }

  async componentDidMount () {
    const { entrypoint, urlParams } = this.props;
    if (urlParams.organizationAddress) {
      this.setState({
        addressFilter: urlParams.organizationAddress,
      });
    }
    await this._setupEntrypoint(entrypoint);
  }

  async componentDidUpdate(prevProps) {
    const { entrypoint } = this.props;
    if (entrypoint.address === prevProps.entrypoint.address) {
      return;
    }
    this.setState({
      selectedDirectoryInst: undefined,
      selectedDirectory: '',
      directories: [],
      addressFilter: '',
    });
    await this._setupEntrypoint(entrypoint);
  }

  render() {
    const { entrypoint } = this.props;
    const { directories, selectedDirectory, selectedDirectoryInst, addressFilter } = this.state;
    const options = directories.map((l) => {
      return (<option key={l} value={l}>{l}</option>);
    });
    return (
      <div>
        <Form.Group controlId="entrypoint">
          <Form.Control as="select" onChange={this.onDirectoryChange} value={selectedDirectory}>
              {options}
            </Form.Control>
          <Form.Control type="text"
                        placeholder="Optionally filter by organization address"
                        className="form-control"
                        value={addressFilter}
                        onChange={(e) => { this.setState({ addressFilter: e.target.value }); }}/>
        </Form.Group>
        <div className="mt-2">
          {selectedDirectory && <DirectoryView instance={selectedDirectoryInst} network={entrypoint.network} readApi={entrypoint.readApi} segment={selectedDirectory} addressFilter={addressFilter} />}
        </div>
    </div>);
  }
}

export default EntrypointViewer;
