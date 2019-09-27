import React, { PureComponent } from 'react';

import { Client, ConvertToSelect } from '../util'
import Select from 'react-select';
import { DropdownButton, MenuItem, ButtonToolbar, Nav, Navbar, NavItem, FormControl } from 'react-bootstrap';
import VippsBar from './VippsBar';

class Vipps extends PureComponent {
  state = {
  }
  constructor() {
    super();
}

  render() {
    return (
      <div>
	<VippsBar type='vipps'/>
      </div>
    );
  }
}

export default Vipps;
