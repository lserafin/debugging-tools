import React, {Component} from 'react';
import { Container, Row, Col, Button } from '@windingtree/wt-ui-react';
import Loader from '../Loader';
import Item from './Item';
import EtherscanLink from '../EtherscanLink';

const PAGE_SIZE = 5;
const segments = {
  hotels: {
    readApiSuffix: 'hotels',
    singular: 'hotel',
    plural: 'hotels',
  },
  airlines: {
    readApiSuffix: 'airlines',
    singular: 'airline',
    plural: 'airlines',
  }
};

class IndexViewer extends Component {
  state = {
    config: undefined,
    items: undefined,
    lifTokenAddress: undefined,
    nextItemPage: 1,
  };

  constructor(props) {
    super(props);
    this.getItems = this.getItems.bind(this);
  }

  async componentDidMount() {
    const { instance, segment } = this.props;
    this.setState({
      config: segments[segment]
    });
    this.setState({
      items: await instance.getOrganizations(),
      lifTokenAddress: await ((await instance._getDeployedDirectory()).methods.getLifToken().call()),
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    const { instance, segment } = this.props;
    if (prevProps.instance !== instance) {
      this.setState({
        config: segments[segment]
      });
      this.setState({
        items: undefined,
        lifTokenAddress: undefined,
      });
      this.setState({
        items: await instance.getOrganizations(),
        lifTokenAddress: await ((await instance._getDeployedDirectory()).methods.getLifToken().call()),
      });
    }
  }

  getItems() {
    const { nextItemPage, items, config } = this.state;
    const { readApi, network } = this.props;
    return items.slice(0, nextItemPage * PAGE_SIZE).map((i) => {
      const readApiUrl = readApi ? `${readApi}/${config.readApiSuffix}` : undefined;
      return <Item item={i} key={i.address} network={network} readApi={readApiUrl} />
    })
  }

  render() {
    const { instance, network } = this.props;
    const { items, lifTokenAddress, config, nextItemPage } = this.state;
    if (!items) {
      return <Loader label={`Loading items from ${instance.address}`} block={128} />
    }
    const itemElements = this.getItems();
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
                <th>{config.singular} count</th>
                <td>{items.length}</td>
              </tr>
            </tbody>
          </table>
          <h3>{config.plural.substr(0, 1).toUpperCase()}{config.plural.substr(1)}</h3>
        </Col>
      </Row>
      {itemElements}
      {nextItemPage * PAGE_SIZE < items.length &&
        <Row>
          <Col>
          <p className="text-center mb-2">
            <Button onClick={() => {
              const { nextItemPage } = this.state;
              this.setState({
                nextItemPage: nextItemPage + 1
              });
            }}>Load more</Button>
          </p>
        </Col>
      </Row>
    }
    </Container>
  }
}

export default IndexViewer;
