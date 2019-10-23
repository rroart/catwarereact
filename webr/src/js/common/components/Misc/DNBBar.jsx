import React, { PureComponent } from 'react';

import { Client, ConvertToSelect } from '../util'
import Select from 'react-select';
import { Button, DropdownButton, MenuItem, ButtonToolbar, Nav, Navbar, NavItem, FormControl, Form, FormGroup, ControlLabel } from 'react-bootstrap';

const bank = "DNB";

class DNBBar extends PureComponent {
    type : string;
    state = {
	page: 1,
	subpage: 1,
	subsubpage: 1,
	psuid: undefined,
	logon: undefined,
	accounts : undefined,
	myaccount : undefined,
	otheraccount : undefined,
	money : undefined,
	result: undefined,
	paymentid: undefined,
    }
    constructor(props) {
	super(props);
	this.type = props.type;
	//this.handleChange = this.handleChange.bind(this);
	this.addMessage = this.addMessage.bind(this);
	this.buttonClick = this.buttonClick.bind(this);
	this.dropdownkonto = this.dropdownkonto.bind(this);
	this.dropdownbetale = this.dropdownbetale.bind(this);
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
	Client.post("/accounts/pay", { psuid : this.state.psuid, creditor : this.state.otheraccount, creditorname : "Othername", debtor : this.state.myaccount , amount : this.state.money }, (result) => {
            this.setState({
                paymentid: result.paymentId,
                logon: result.href
            });
	});
	console.log("here");
	this.state.subsubpage = 3
    }

    handleSubmit(event) {
	console.log(event);
	console.log(event.target.value);
	this.state.psuid = event.target.value;
	Client.post("/consents", { bank : bank, psuid : event.target.value }, (result) => {
	    console.log("here");
	    console.log(result);
	    console.log(result.body);
	    console.log(typeof result.body);
	    this.setState({
		logon: result.href
	    });
	});
	this.state.page = 2
	this.state.subpage = 0
	this.state.subsubpage = 0
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
	Client.search("/accounts/" + bank + "/"+ this.state.psuid, (result) => {
	    this.setState({
		accounts : result.accounts
	    });
	});
	console.log("here")
        console.log(this.state)
	this.state.subsubpage = 2

    }

    dropdownkonto(unknown, event) {
	console.log(unknown)
	console.log(event.target.id)
	console.log(event.target.name)
        console.log(this.state)
	console.log("here");
	this.setState({
	    page : 2,
	    subpage : event.target.id,
	    subsubpage : 1
	});
    }

    dropdownbetale(unknown, event) {
	console.log(event)
	console.log(event.target.id)
	console.log(event.target.value)
        console.log(this.state)
	console.log("here");
	this.setState({
	    page : 3,
	    subpage : event.target.id,
	    subsubpage : 1
	});
    }

    render() {
	console.log("xxx")
	console.log(this.state.page)
	console.log(this.state.subpage)
	console.log(this.state.subsubpage)
	console.log(this.state.value == undefined)
	console.log(this.state)
	console.log(this.state.psuid == undefined)
	if (this.state.psuid != undefined) {
	    console.log(this.state.psuid)
	}
	let menu;
	menu = (
	    <h2>Login</h2>
	)
	if (this.state.page != 1) {
	    menu = (
		<div>
		<DropdownButton id="1" title="Konto" onSelect={this.dropdownkonto}>
		  <MenuItem id="1" name="kontooversikt">Min kontooversikt</MenuItem>
		  <MenuItem id="2" name="transaksjoner">Siste transaksjoner</MenuItem>
		</DropdownButton>
		<DropdownButton id="2" title="Betale og overføre" onSelect={this.dropdownbetale}>
		  <MenuItem id="1" name="betaleen">Betale til en</MenuItem>
		  <MenuItem id="2" name="egne">Overføre egne kontoer</MenuItem>
		  <MenuItem id="3" name="betalingsoversikt">Betalingsoversikt</MenuItem>
		  <MenuItem id="4" name="betalinger">Utførte betalinger</MenuItem>
		</DropdownButton>
		</div>
	    )
	}
	let comp;
	if (this.state.page == 1) {
	    comp = (
		<Navbar>
		  <Navbar.Header>
		    <Navbar.Brand>
		      <a href="#home">{this.type}</a>
		    </Navbar.Brand>
		  </Navbar.Header>
		  <Nav>
		    <NavItem eventKey={3} href="#">
		      Logg inn
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
	if (this.state.page == 2) {
	    //window.location.href = this.state.logon;
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
	    this.state.page = 3;
	}
	if (this.state.page == 3) {
	    if (this.state.subpage == 1) {
		if (this.state.subsubpage == 1) {
		    comp = (
			<Navbar>
			  <Navbar.Header>
			    <Navbar.Brand>
			      <a href="#home">{this.type}</a>
			    </Navbar.Brand>
			  </Navbar.Header>
			  <Nav>
			    <NavItem eventKey={3} href="#">
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
		}
		if (this.state.subsubpage == 2) {
		    var accts = ConvertToSelect.convert(this.state.accounts);
		    console.log("here");
		    comp = (
			<Navbar>
			  <Navbar.Header>
			    <Navbar.Brand>
			      <a href="#home">{this.type}</a>
			    </Navbar.Brand>
			  </Navbar.Header>
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
				    <Button
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
		}
		if (this.state.subsubpage == 3) {
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
			      <h2>Betaling registrert med id {this.state.paymentid}</h2>
			    </NavItem>
			  </Nav>
			</Navbar>
		    )
		}
	    }
	}
	return (
	    <div>
	      { menu }
	      { comp }
	    </div>
	);
    }
}

export default DNBBar;
