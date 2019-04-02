import React, {Component} from 'react';
import { Container, Row, Col } from '@windingtree/wt-ui-react';
import Loader from '../Loader';
import AirlineItem from './Item';
import EtherscanLink from '../EtherscanLink';

class AirlineIndexViewer extends Component {
  state = {
    items: undefined,
    lifTokenAddress: undefined,
  };

  async componentDidMount() {
    const { instance } = this.props;
    this.setState({
      items: await instance.getAllAirlines(),
      lifTokenAddress: await ((await instance._getDeployedIndex()).methods.LifToken().call()),
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    const { instance } = this.props;
    if (prevProps.instance !== instance) {
      this.setState({
        items: undefined,
        lifTokenAddress: undefined,
      });
      this.setState({
        items: await instance.getAllAirlines(),
        lifTokenAddress: await ((await instance._getDeployedIndex()).methods.LifToken().call()),
      });
    }
  }

  render() {
    const { instance, network } = this.props;
    const { items, lifTokenAddress } = this.state;
    if (!items) {
      return <Loader label={`Loading items from ${instance.address}`} block={128} />
    }
    const airlineItems = items.map((i) => {
      return <AirlineItem item={i} key={i.address} network={network} />
    })
    return <Container>
      <Row>
        <Col>
          <h2>Index at <EtherscanLink network={network} address={instance.address}>{instance.address}</EtherscanLink></h2>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th>Lif token address</th>
                <td><EtherscanLink network={network} address={lifTokenAddress}>{lifTokenAddress}</EtherscanLink></td>
              </tr>
              <tr>
                <th>Airline count</th>
                <td>{items.length}</td>
              </tr>
            </tbody>
          </table>
          <h3>Airlines</h3>
        </Col>
      </Row>
      {airlineItems}
    </Container>
  }
}

export default AirlineIndexViewer;
