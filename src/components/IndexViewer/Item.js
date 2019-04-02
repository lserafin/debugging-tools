import React, {Component} from 'react';
import { Row, Col } from '@windingtree/wt-ui-react';
import Loader from '../Loader';
import EtherscanLink from '../EtherscanLink';

class Item extends Component {
  state = {
    resolved: false,
    address: undefined,
    manager: undefined,
    dataUri: undefined,
    resolvedDataIndex: false,
    dataIndex: undefined,
    dataIndexError: undefined
  };

  async componentWillMount() {
    const { item } = this.props;
    const { resolved, resolvedDataIndex } = this.state;
    if (!resolved) {
      this.setState({
        address: await item.address,
        manager: await item.manager,
        dataUri: await item.dataUri,
        resolved: true,
      });
    }
    if (!resolvedDataIndex) {
      try {
        this.setState({
          dataIndex: await (await item.dataIndex).contents,
          resolvedDataIndex: true,
          dataIndexError: undefined,
        })
      // TODO this doesn't work
      } catch (e) {
        this.setState({
          dataIndexError: e.toString()
        })
      }
    }
  }

  render() {
    const { item, network, readApi } = this.props;
    const { resolved, address, manager, dataUri, resolvedDataIndex, dataIndex, dataIndexError } = this.state;
    if (!resolved) {
      return <Row>
        <Col>
          <Loader label={`Loading data from ${item.address}`} block={128} />
        </Col>
      </Row>
    }

    return <Row>
      <Col className="mb-1">
        <h4>
          {address}
          <span className="badge badge-pill badge-primary ml-1"><EtherscanLink network={network} address={address}>Etherscan</EtherscanLink></span>
          <span className="badge badge-pill badge-primary ml-1"><a href={`${readApi}/${address}`} target="_blank" rel="noopener noreferrer">Read API</a></span>
        </h4>
        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th>Manager</th>
              <td>
                <EtherscanLink network={network} address={manager}>{manager}</EtherscanLink>
              </td>
            </tr>
            <tr>
              <th>Data URI</th>
              <td>{dataUri}</td>
            </tr>
            <tr>
              <th>Data URI contents</th>
              <td>
                {! resolvedDataIndex && <Loader />}
                {resolvedDataIndex && dataIndexError && <p className="alert alert-error">{dataIndexError}</p>}
                {resolvedDataIndex && dataIndex && <ul>
                  <li><strong>dataFormatVersion</strong>: {dataIndex.dataFormatVersion}</li>
                  <li><strong>defaultLocale</strong>: {dataIndex.defaultLocale}</li>
                  <li><strong>descriptionUri</strong>: {dataIndex.descriptionUri && dataIndex.descriptionUri.ref}</li>
                  <li><strong>availabilityUri</strong>: {dataIndex.availabilityUri && dataIndex.availabilityUri.ref}</li>
                  <li><strong>ratePlansUri</strong>: {dataIndex.ratePlansUri && dataIndex.ratePlansUri.ref}</li>
                </ul>}
              </td>
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  }
}

export default Item;
