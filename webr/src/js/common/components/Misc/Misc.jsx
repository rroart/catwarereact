import React, { PureComponent } from 'react';

import { Client, ConvertToSelect } from '../util'
import Select from 'react-select';
import { DropdownButton, MenuItem, ButtonToolbar, Nav, Navbar, NavItem, FormControl } from 'react-bootstrap';
import MiscBar from './MiscBar';

class Misc extends PureComponent {
    state = {
	creators: [],
	years: []
    }
    constructor() {
	super();
    }

    render() {
	return (
	    <div>
	      <MiscBar type='payex'/>
	    </div>
	);
    }
}

export default Misc;
