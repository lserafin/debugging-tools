import React, { Component } from 'react';
import {
  Alert,
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Form,
  FormGroup,
  Input,
} from 'reactstrap';

class App extends Component {
  state = {
    index: null,
  };

  constructor(props) {
    super(props);
    this.onWTIndexChange = this.onWTIndexChange.bind(this);
  }

  onWTIndexChange (e) {
    // TODO e.target.value
  }

  render() {
    const { index } = this.state;
    // TODO list wt indexes
    const options = [].map((l) => {
      return (<option key={l.name} value={l.link}>{l.name}</option>);
    });
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">Winding Tree Index debugger</NavbarBrand>
          <Nav className="ml-auto" navbar>
          <NavItem>
            <Form inline>
              <FormGroup>
                <Input type="select" name="index" id="index" onChange={this.onWTIndexChange}>
                {options}
                </Input>
              </FormGroup>
            </Form>
            </NavItem>
          </Nav>
        </Navbar>
        <Container className="mt-2">
          {! index && (<Alert color="info">Select Winding Tree index first.</Alert>)}
        </Container>
      </div>
    );
  }
}

export default App;
