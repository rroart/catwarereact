import React, { PureComponent } from 'react';

import { Client, ConvertToSelect } from '../util'
import Select from 'react-select';
import { Button, DropdownButton, MenuItem, ButtonToolbar, Nav, Navbar, NavItem, FormControl, Form, FormGroup, ControlLabel } from 'react-bootstrap';

class DNBBar extends PureComponent {
    type : string;
    state = {
	personnummer: undefined,
	consentid: '',
	logon: undefined,
	accounts : undefined,
	myaccount : undefined,
	otheraccount : undefined,
	money : undefined,
	result: undefined,
    }
    constructor(props) {
	super(props);
	this.type = props.type;
	//this.handleChange = this.handleChange.bind(this);
	this.addMessage = this.addMessage.bind(this);
	this.buttonClick = this.buttonClick.bind(this);
	this.handleAccountChange = this.handleAccountChange.bind(this);
	this.handleOtherChange = this.handleOtherChange.bind(this);
	this.handleMoneyChange = this.handleMoneyChange.bind(this);
	this.submitMoney = this.submitMoney.bind(this);
    }

    handleAccountChange(event) {
	console.log(event);
	console.log(event.value);
	this.state.myaccount = event.value;
	console.log(this.state);
    }

    handleOtherChange(event) {
       this.state.otheraccount = event.target.value;
        console.log(this.state)
    }

    handleMoneyChange(event) {
       this.state.money = event.target.value;
        console.log(this.state)
    }

    submitMoney(event) {
        console.log(this.state)
	Client.search("/dnb/accounts/pay/" + this.state.personnummer + "/" + this.state.otheraccount + "/" + "Othername" + "/" + this.state.myaccount + "/" + this.state.money, (result) => {
	    this.setState({
		result: result
	    });
	});
	console.log("here");
    }

    handleSubmit(event) {
	console.log(event);
	console.log(event.target.value);
	this.state.personnummer = event.target.value;
	Client.search("/dnb/consents/" + event.target.value, (result) => {
	    console.log(result)
	});
	Client.search("/dnb/consents/" + event.target.value, (result) => {
	    this.setState({
		consentid: result.consentId,
		logon: result.href
	    });
	});
	/*
	Client.search("/dnb/consents/ +  personnummer + "/" + this.state.consentid }, (consentid) => {
	    this.setState({
		consentid: consentid.consentId
	    });
	});
	*/
	/*
	Client.search("/dnb/consents/" + event.target.value, (consentid) => {
	    this.setState({
		consentid: consentid.consentId
	    });
	});
        */
	console.log("here")
	console.log(this.state)
    }

    addMessage(event) {
	if(event.keyCode == 13 && event.shiftKey == false) {
	    this.handleSubmit(event); // <--- all the form values are in a prop
	}
    }

    buttonClick(event) {
	this.state.logon = undefined;
	Client.search("/dnb/accounts/"+ this.state.consentid, (result) => {
	    this.setState({
		accounts : result.accounts
	    });
	});
	console.log("here")
        console.log(this.state)

    }

    render() {
	console.log("xxx")
	console.log(this.state.value == undefined)
	console.log(this.state)
	console.log(this.state.personnummer == undefined)
	if (this.state.personnummer != undefined) {
	    console.log(this.state.personnummer)
	}
	let comp;
	if (this.state.personnummer == undefined) {
	    comp = (
		<Navbar>
		  <Navbar.Header>
		    <Navbar.Brand>
		      <a href="#home">{this.type}</a>
		    </Navbar.Brand>
		  </Navbar.Header>
		  <Nav>
		    <NavItem eventKey={3} href="#">
		      Personnummer
		      <FormControl
			type="text"
			value={this.state.value}
			placeholder="Enter text"
			onKeyDown={this.addMessage}
			/>
		    </NavItem>
		  </Nav>
		</Navbar>
	    )
	}
	if (this.state.personnummer != undefined) {
	    if (this.state.logon != undefined) {
		var win = window.open(this.state.logon, '_blank');
		win.focus();
		const sleep = (milliseconds) => {
		    return new Promise(resolve => setTimeout(resolve, milliseconds))
		}
		sleep(15000).then(() => {
		    //do stuff
		})
		console.log("undef");
		this.state.logon = undefined;
		comp = (
		<Navbar>
		  <Navbar.Header>
		    <Navbar.Brand>
		      <a href="#home">{this.type}</a>
		    </Navbar.Brand>
		  </Navbar.Header>
		  <Nav>
		    <NavItem eventKey={3} href="#">
		      Personnummer
		      <Button
			value={this.state.value}
			placeholder="Enter text"
			onClick={this.buttonClick}
			>
		      See accounts
                     </Button>
		    </NavItem>
		  </Nav>
		</Navbar>
		)
	    } else {
		var accts = ConvertToSelect.convert(this.state.accounts);
		console.log("here");
	    comp = (
		<Navbar>
		  <Navbar.Header>
		    <Navbar.Brand>
		      <a href="#home">{this.type}</a>
		    </Navbar.Brand>
		  </Navbar.Header>
		  <h2>Generell firmainformasjon</h2>
		  <Nav>
		      <Form>
			<FormGroup controlId="form" >
			  <ControlLabel>Working example without validation</ControlLabel>
			  <NavItem eventKey={1} href="#">
			    Konto
			    <Select onChange={this.handleAccountChange} options={ accts } />
			  </NavItem>
		    <NavItem eventKey={5} href="#">
		      Til konto
		      <FormControl
			type="text"
			value={this.state.otheraccount}
			placeholder="Enter text"
			onChange={this.handleOtherChange}
			/>
		    </NavItem>
		    <NavItem eventKey={6} href="#">
		      Beløp
		      <FormControl
			type="text"
			value={this.state.money}
			placeholder="Enter text"
			onChange={this.handleMoneyChange}
			/>
		    </NavItem>
		  <Nav>
		    <NavItem eventKey={3} href="#">
		      Send penger
		      <Button
			type="text"
			value={this.state.value}
			placeholder="Enter text"
			onClick={this.submitMoney}
			>
		      Send penger
                     </Button>
		    </NavItem>
		  </Nav>
		    </FormGroup>
		    </Form>
		  </Nav>
		</Navbar>
	    )
		if (this.state.result != undefined) {
		    comp = comp + (
			<h2>{result}</h2>
		    )
		}
	    }
	}
	return (
	    <div>
	      { comp }
	    </div>
	);
    }
}

export default DNBBar;
