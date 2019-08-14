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
    let touchLink = false;
    if (field && field.ref && field.ref.indexOf('bzz-raw:') === 0) {
      link = `${SWARM_GATEWAY}/${field.ref}`;
      touchLink = true;
    } else if (field && field.ref) {
      link = field.ref;
      touchLink = true;
    } else if (link.startsWith && link.startsWith('https://')) {
      touchLink = true;
    }
    this.setState({
      field,
      link,
    });
    if (touchLink) {
      fetch(link)
        .then(() => {
          this.setState({status: true});
        })
        .catch(() => {
          this.setState({status: false});
        });
    }
  }

  render() {
    const { field, link, status } = this.state;
    const { fieldName } = this.props;
    if ((!field || !field.ref) && fieldName.indexOf('Uri') !== fieldName.length - 3) {
      if (typeof field === 'object') {
        const subFields = Object.keys(field).sort((a, b) => a > b ? 1 : -1).map((k) => {
          return <li key={k}><strong>{k}</strong>: <OffChainLink index={field} fieldName={k} /></li>;
        });
        return <ul>{subFields}</ul>;
      } else {
        return <span>{field}</span>;
      }
    }

    return (<span>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >{(field && field.ref) || field}</a>
      {status === undefined && <Loader />}
      {status === true && <i className="mdi mdi-24px mdi-check" style={{color: 'green'}} />}
      {status === false && <i className="mdi mdi-24px mdi-exclamation" style={{color: 'red'}} />}
    </span>);
  }

}

class Item extends Component {
  _isMounted = false;
  state = {
    resolved: false,
    address: undefined,
    owner: undefined,
    orgJsonUri: undefined,
    orgJsonHash: undefined,
    orgJsonHashValid: undefined,
    resolvedOrgJson: false,
    orgJson: undefined,
    orgJsonError: undefined
  };

  async componentDidMount() {
    this._isMounted = true;
  }

  async componentWillMount() {
    const { item } = this.props;
    const { resolved, resolvedOrgJson } = this.state;
    if (!resolved) {
      const newState = {
        address: await item.address,
        owner: await item.owner,
        orgJsonUri: await item.orgJsonUri,
        orgJsonHash: await item.orgJsonHash,
        resolved: true,
      };
      if (this._isMounted) {
        this.setState(newState);
      }
    }
    if (!resolvedOrgJson) {
      try {
        const orgJson = await (await item.orgJson).contents;
        let isOrgJsonHashValid = false;
        try {
          isOrgJsonHashValid = await item.validateOrgJsonHash();
        } catch (e) {
          // silent pass
        }
        if (this._isMounted) {
          this.setState({
            orgJson: orgJson,
            orgJsonHashValid: isOrgJsonHashValid,
            resolvedOrgJson: true,
            orgJsonError: undefined,
          })
        }
      } catch (e) {
        if (this._isMounted) {
          this.setState({
            orgJsonError: e.toString(),
            resolvedOrgJson: true,
          })
        }
      }
    }
  }

  async componentWillUnmount () {
    this._isMounted = false;
  }

  render() {
    const { item, network, segment, entrypoint, readApi } = this.props;
    const { resolved, address, owner, orgJsonUri, orgJsonHash, orgJsonHashValid,
      resolvedOrgJson, orgJson, orgJsonError } = this.state;
    if (!resolved) {
      return <Row>
        <Col>
          <Loader label={`Loading data from ${item.address}`} block={128} />
        </Col>
      </Row>
    }
    let orgJsonMembers = [];
    if (resolvedOrgJson && orgJson) {
      orgJsonMembers = Object.keys(orgJson).sort((a, b) => a > b ? 1 : -1).map((k) => {
        return <li key={k}><strong>{k}</strong>: <OffChainLink index={orgJson} fieldName={k} /></li>;
      })
    }

    return <Row>
      <Col className="mb-1">
        <h4>
          {address}
          <span className="badge badge-pill badge-primary ml-1">
            <a href={`/debugger/${entrypoint}/${segment}/${address}`} target="_blank" rel="noopener noreferrer">Permalink</a>
          </span>
          <span className="badge badge-pill badge-primary ml-1"><EtherscanLink network={network} address={address}>Etherscan</EtherscanLink></span>
          {readApi && <span className="badge badge-pill badge-primary ml-1"><a href={`${readApi}/${address}`} target="_blank" rel="noopener noreferrer">Read API</a></span>}
        </h4>
        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th>Owner</th>
              <td>
                <EtherscanLink network={network} address={owner}>{owner}</EtherscanLink>
              </td>
            </tr>
            <tr>
              <th>ORG.JSON URI</th>
              <td><OffChainLink index={{uri: {ref: orgJsonUri}}} fieldName='uri' /></td>
            </tr>
            <tr>
              <th>ORG.JSON hash</th>
              <td>
              {orgJsonHash}
              {orgJsonHashValid ?
                <i className="mdi mdi-24px mdi-check" style={{color: 'green'}} /> :
                <i className="mdi mdi-24px mdi-exclamation" style={{color: 'red'}} />
              }</td>
            </tr>
            <tr>
              <th>ORG.JSON contents</th>
              <td>
                {! resolvedOrgJson && <Loader />}
                {resolvedOrgJson && orgJsonError && <p className="alert alert-danger">{orgJsonError}</p>}
                {resolvedOrgJson && orgJson && <ul>
                  {orgJsonMembers}
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
