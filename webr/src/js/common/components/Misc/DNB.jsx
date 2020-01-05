import React, { PureComponent } from 'react';

import { Client, ConvertToSelect } from '../util'
import Select from 'react-select';
import { DropdownButton, MenuItem, ButtonToolbar, Nav, Navbar, NavItem, FormControl } from 'react-bootstrap';
import DNBBar from './DNBBar';

class DNB extends PureComponent {
    constructor() {
	super();
    }

    render() {
      console.log(this)
	return (
	    <div>
	      <DNBBar type='dnb' history={history}/>
	    </div>
	);
    }
}

export default DNB;
