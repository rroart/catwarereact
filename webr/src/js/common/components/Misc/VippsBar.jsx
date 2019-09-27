import React, { PureComponent } from 'react';

import { Client, ConvertToSelect } from '../util'
import Select from 'react-select';
import { DropdownButton, MenuItem, ButtonToolbar, Nav, Navbar, NavItem, FormControl } from 'react-bootstrap';

class VippsBar extends PureComponent {
    type : string;
    state = {
    }
    constructor(props) {
	super(props);
	this.type = props.type;
    }

    handleChange(event) {
	console.log(event);
	console.log(event.value);
    }
    
    render() {
	let comp;
	if (this.state.firma == undefined) {
	    comp = (
		<Navbar>
		  <Navbar.Header>
		    <Navbar.Brand>
		      <a href="#home">{this.type}</a>
		    </Navbar.Brand>
		  </Navbar.Header>
		  <Nav>
		    <h2>Organisasjon</h2>
		    <NavItem eventKey={3} href="#">
		      Organisasjonsnummer
		      <FormControl
			type="text"
			value={this.state.value}
			placeholder="Organisasjonsnummer"
			onChange={this.handleChange}
			onKeyDown={this.addMessage}
			/>
		    </NavItem>
		    <NavItem eventKey={4} href="#">
		      Navn på utsalgssted slik det vil vises for kunde i Vipps-appen
		      <FormControl
			type="text"
			value={this.state.value}
			placeholder="Navn på utsalgssted"
			onChange={this.handleChange}
			onKeyDown={this.addMessage}
			/>
		    </NavItem>
		    <NavItem eventKey={5} href="#">
		      Bedriftskonto
		      <FormControl
			type="text"
			value={this.state.value}
			placeholder="Bedriftskonto for oppgjør"
			onChange={this.handleChange}
			onKeyDown={this.addMessage}
			/>
		    </NavItem>
		  </Nav>
		</Navbar>
	    )
	}
	return (
	    <div>
	      { comp }
	    </div>
	);
    }
}

export default VippsBar;
