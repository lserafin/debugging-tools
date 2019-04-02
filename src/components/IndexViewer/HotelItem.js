import React, {Component} from 'react';
import { Row, Col } from '@windingtree/wt-ui-react';
import Loader from '../Loader';
import EtherscanLink from '../EtherscanLink';

class HotelItem extends Component {
  state = {
    resolved: false,
    address: undefined,
    manager: undefined,
    dataUri: undefined,
  };

  async componentWillMount() {
    const { item } = this.props;
    const { resolved } = this.state;
    if (!resolved) {
      this.setState({
        address: await item.address,
        manager: await item.manager,
        dataUri: await item.dataUri,
        resolved: true,
      });
    }
  }

  render() {
    const { item, network } = this.props;
    const { resolved, address, manager, dataUri } = this.state;
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
          <EtherscanLink network={network} address={address}>{address}</EtherscanLink>
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
          </tbody>
        </table>
      </Col>
    </Row>
  }
}

export default HotelItem;
