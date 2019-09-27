import React, { PureComponent } from 'react';

import { Client, ConvertToSelect } from '../util'
import Select from 'react-select';
import { DropdownButton, MenuItem, ButtonToolbar, Nav, Navbar, NavItem, FormControl } from 'react-bootstrap';

class MiscBar extends PureComponent {
    type : string;
    state = {
	firmanavn: '',
	suggestion: ''
    }
    constructor(props) {
	super(props);
	this.type = props.type;
	this.handleChange = this.handleChange.bind(this);
	this.addMessage = this.addMessage.bind(this);
    }

    handleChange(event) {
	console.log(event);
	console.log(event.target.value);
	Client.search("/misc/" + "payex" + "/firmanavn/suggest/" + event.target.value, (firmanavn) => {
	    console.log(firmanavn);
	}); 
	Client.search("/misc/" + "payex" + "/firmanavn/suggest/" + event.target.value, (firmanavn) => {
	    this.setState({
		suggestion: firmanavn
	    });
	});
    }
    
    handleSubmit(event) {
	console.log(event);
	console.log(event.target.value);
	Client.search("/misc/" + "payex" + "/firmanavn/search/" + event.target.value, (firmanavn) => {
	    console.log(firmanavn);
	}); 
	Client.search("/misc/" + "payex" + "/firmanavn/search/" + event.target.value, (firma) => {
	    this.setState({
		firma: firma
	    });
	});
	console.log("here")
    }

    addMessage(event) {
	if(event.keyCode == 13 && event.shiftKey == false) {
	    this.handleSubmit(event); // <--- all the form values are in a prop
	}
    }
    render() {
	let suggestionComponent;
	suggestionComponent = (
	    <h4>{this.state.suggestion}</h4>
	)
	console.log("xxx")
	console.log(this.state.value == undefined)
	console.log(this.state)
	console.log(this.state.firmanavn == undefined)
	if (this.state.firma != undefined) {
	    console.log(this.state.firma)
	}
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
		    <NavItem eventKey={3} href="#">
		      Firmanavn
		      <FormControl
			type="text"
			value={this.state.value}
			placeholder="Enter text"
			onChange={this.handleChange}
			onKeyDown={this.addMessage}
			/>
		      { suggestionComponent }
		    </NavItem>
		  </Nav>
		</Navbar>
	    )
	}
	if (this.state.firma != undefined) {
	    comp = (
		<Navbar>
		  <Navbar.Header>
		    <Navbar.Brand>
		      <a href="#home">{this.type}</a>
		    </Navbar.Brand>
		  </Navbar.Header>
		  <h2>Generell firmainformasjon</h2>
		  <Nav>
		    <NavItem eventKey={4} href="#">
		      ORGANISASJONSNUMMER
		      <FormControl
			type="text"
			value={this.state.firma.orgnr}
			placeholder="Enter text"
			onChange={this.handleChange}
			/>
		    </NavItem>
		    <NavItem eventKey={5} href="#">
		      FIRMANAVN
		      <FormControl
			type="text"
			value={this.state.firma.firmanavn}
			placeholder="Enter text"
			onChange={this.handleChange}
			/>
		    </NavItem>
		    <NavItem eventKey={6} href="#">
		      FIRMANAVN
		      <FormControl
			type="text"
			value={this.state.firma.navn}
			placeholder="Enter text"
			onChange={this.handleChange}
			/>
		    </NavItem>
		  </Nav>
		  <Nav>
		    <h2>FAKTURERINGSADRESSE</h2>
		    <NavItem eventKey={7} href="#">
		      ADRESSE
		      <FormControl
			type="text"
			value={this.state.firma.faktureringsadresse.adresse}
			placeholder="Enter text"
			onChange={this.handleChange}
			/>
		    </NavItem>
		    <NavItem eventKey={8} href="#">
		      POSTNUMMER
		      <FormControl
			type="text"
			value={this.state.firma.faktureringsadresse.postnummer}
			placeholder="Enter text"
			onChange={this.handleChange}
			/>
		    </NavItem>
		    <NavItem eventKey={9} href="#">
		      POSTSTED
		      <FormControl
			type="text"
			value={this.state.firma.faktureringsadresse.poststed}
			placeholder="Enter text"
			onChange={this.handleChange}
			/>
		    </NavItem>
		  </Nav>
		  <Nav>
		    <h2>BESØKSADRESSE</h2>
		    <NavItem eventKey={10} href="#">
		      ADRESSE
		      <FormControl
			type="text"
			value={this.state.firma.besoksadresse.adresse}
			placeholder="Enter text"
			onChange={this.handleChange}
			/>
		    </NavItem>
		    <NavItem eventKey={11} href="#">
		      POSTNUMMER
		      <FormControl
			type="text"
			value={this.state.firma.besoksadresse.postnummer}
			placeholder="Enter text"
			onChange={this.handleChange}
			/>
		    </NavItem>
		    <NavItem eventKey={12} href="#">
		      POSTSTED
		      <FormControl
			type="text"
			value={this.state.firma.besoksadresse.poststed}
			placeholder="Enter text"
			onChange={this.handleChange}
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

export default MiscBar;
