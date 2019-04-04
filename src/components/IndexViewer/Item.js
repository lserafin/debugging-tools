import React, {Component} from 'react';
import { Row, Col } from '@windingtree/wt-ui-react';
import Loader from '../Loader';
import EtherscanLink from '../EtherscanLink';
import { SWARM_GATEWAY } from '../../constants';


class OffChainLink extends Component {
  state = {
    field: undefined,
    link: undefined,
    status: undefined,
  };

  async componentWillMount() {
    const { index, fieldName } = this.props;
    const field = await index[fieldName] || index[fieldName];
    let link = field;
    if (field && field.ref && field.ref.indexOf('bzz-raw:') === 0) {
      link = `${SWARM_GATEWAY}/${field.ref}`;
    } else if (field && field.ref) {
      link = field.ref;
    }
    this.setState({
      field,
      link,
    });
    fetch(link)
      .then(() => {
        this.setState({status: true})
      })
      .catch(() => {
        this.setState({status: false})
      })
  }

  render() {
    const { field, link, status } = this.state;
    const { fieldName } = this.props;
    if ((!field || !field.ref) && fieldName.indexOf('Uri') !== fieldName.length - 3) {
      return <span>{field}</span>;
    }

    return (<span>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >{(field && field.ref) || field}</a>
      {status === undefined && <Loader />}
      {status === true && <i className="mdi mdi-24px mdi-check"  style={{color: 'green'}} />}
      {status === false && <i className="mdi mdi-24px mdi-exclamation" style={{color: 'red'}} />}
    </span>);
  }

}

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
      } catch (e) {
        this.setState({
          dataIndexError: e.toString(),
          resolvedDataIndex: true,
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
    let dataIndexMembers = [];
    if (resolvedDataIndex && dataIndex) {
      dataIndexMembers = Object.keys(dataIndex).sort((a, b) => a > b ? 1 : -1).map((k) => {
        return <li key={k}><strong>{k}</strong>: <OffChainLink index={dataIndex} fieldName={k} /></li>;
      })
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
              <td><OffChainLink index={{uri: {ref: dataUri}}} fieldName='uri' /></td>
            </tr>
            <tr>
              <th>Data URI contents</th>
              <td>
                {! resolvedDataIndex && <Loader />}
                {resolvedDataIndex && dataIndexError && <p className="alert alert-danger">{dataIndexError}</p>}
                {resolvedDataIndex && dataIndex && <ul>
                  {dataIndexMembers}
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
