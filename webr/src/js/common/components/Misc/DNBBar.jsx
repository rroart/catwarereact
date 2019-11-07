import React, {PureComponent} from 'react';

import {Client, ConvertToSelect} from '../util'
import Select from 'react-select';
import {
  Button,
  ControlLabel,
  DropdownButton,
  Form,
  FormControl,
  FormGroup,
  MenuItem,
  Nav,
  Navbar,
  NavItem
} from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import {MyTable} from '../Table'

const bank = "DNB";

class DNBBar extends PureComponent {
  type: string;
  state = {
    page: 1,
    subpage: 1,
    subsubpage: 1,
    psuid: undefined,
    logon: undefined,
    accounts: undefined,
    account: undefined,
    transactions: undefined,
    myaccount: undefined,
    otheraccount: undefined,
    money: undefined,
    result: undefined,
    paymentid: undefined,
    error: undefined,
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

  // very bad code
  sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  }

  getAccounts(list, date, props) {
    console.log("here");
    console.log(list);
    console.log(typeof list);
    console.log(Object.keys(list));
    const array = list['accounts']
    console.log(array);
    if (array === undefined || array.length == 0) {
      return (
        <div>
          <h3>{list.title}</h3>
        </div>
      );
    }
    const head = Object.keys(array[0]);
    const rest = array
    const columns = [];
    const result = array;
    columns.push({
      accessor: "bban",
      Header: "Kontonummer",
      sort: true,
      id: 'button',
      Cell: ({value}) => (<a onClick={(e) => this.handleTransactionClick(props, e, value)}>{value}</a>)
    });
    columns.push({accessor: "name", Header: "Kontonavn", sort: true});
    columns.push({accessor: "authorisedBalance", Header: "Disponibel saldo", sort: true});
    columns.push({accessor: "openingBookedBalance", Header: "Bokført", sort: true});
    console.log(columns);
    console.log(head);
    console.log(head.length);
    console.log(rest);
    console.log(rest.length);
    console.log(result);
    console.log(columns);
    return (
      <div>
        <h3>>{list.title}</h3>
        <ReactTable key={date} data={result} columns={columns}/>
      </div>
    );
  }

  getTransactions(transactions, date, props) {
    console.log("here");
    console.log(transactions);
    console.log(transactions.transactions);
    var booked = transactions.transactions.booked;
    var pending = transactions.transactions.pending;
    console.log(booked);
    console.log(typeof booked);
    console.log(Object.keys(booked));
    const array = booked['accounts']
    console.log(array);
    if ((booked === undefined || booked.length == 0) && (pending === undefined || pending.length == 0)) {
      return (
        <div>
          <h3>Ingen transaksjoner</h3>
        </div>
      );
    }
    const rest = array
    const columns = [];
    const result = array;
    columns.push({accessor: "transactionId", Header: "Id", sort: true});
    columns.push({accessor: d => new Date(d.bookingDate).toDateString(), Header: "Bokført dato", sort: true, id: "bookingDate"});
    columns.push({accessor: d => new Date(d.valueDate).toDateString(), Header: "Dato", sort: true, id: "valueDate"});
    columns.push({accessor: "transactionAmount.amount", Header: "Beløp", sort: true});
    console.log(columns);
    return (
      <div>
        <ReactTable key={date} data={booked} columns={columns}/>
        <ReactTable key={date} data={pending} columns={columns}/>
      </div>
    );
  }

  handleButtonClick(mythis, e, value) {
    console.log("hhaha");
    console.log(e);
    console.log(value);
    console.log(mythis);
    mythis.setState({
      page: 3,
      subpage: 2,
      subsubpage: 1,
      account: value,
    });
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
    Client.post("/accounts/pay", {
      psuid: this.state.psuid,
      creditor: this.state.otheraccount,
      creditorname: "Othername",
      debtor: this.state.myaccount,
      amount: this.state.money
    }, (result) => {
      this.setState({
        paymentid: result.paymentId,
        logon: result.href
      });
    });
    console.log("here");
    this.state.subsubpage = 3
  }

  async handleloginresult(mythis, result, statuscode) {
    console.log(result);
    var result2 = await result.json();
    if (result2.body !== undefined) {
      console.log("RESULT HAS BODY");
      result2 = result2.body;
    }
    console.log(result2);
    if (statuscode >= 200 && statuscode < 300) {
      //console.log(result.body);
      //console.log(typeof result.body);
      mythis.setState({
        logon: result2.href,
        page: 2,
        subpage: 0,
        subsubpage: 0,
      });
    } else {
      mythis.setState({
        error: result2,
        page: 99,
      });
    }
  }

  async handlekontoresult(mythis, result, statuscode) {
    console.log(result);
    var result2 = await result.json();
    if (result2.body !== undefined) {
      console.log("RESULT HAS BODY");
      result2 = result2.body;
    }
    console.log(statuscode);
    console.log(result2);
    if (statuscode >= 200 && statuscode < 300) {
      //console.log(result.body);
      //console.log(typeof result.body);
      mythis.setState({
        accounts: JSON.parse(result2),
        page: 3,
        subpage: 0,
    });
    } else {
      mythis.setState({
        error: result2,
        page: 99,
      });
    }
  }

  async handletransactionresult(mythis, result, statuscode) {
    console.log(result);
    var result2 = await result.json();
    if (result2.body !== undefined) {
      console.log("RESULT HAS BODY");
      result2 = result2.body;
    }
    console.log(statuscode);
    console.log(result2);
    if (statuscode >= 200 && statuscode < 300) {
      //console.log(result.body);
      //console.log(typeof result.body);
      mythis.setState({
        transactions: JSON.parse(result2),
        page: 4,
        subpage: 2,
    });
    } else {
      mythis.setState({
        error: result2,
        page: 99,
      });
    }
  }

  handleSubmit(event) {
    console.log(event);
    console.log(event.target.value);
    this.state.psuid = event.target.value;
    Client.post("/consents", {bank: bank, psuid: event.target.value}, resultarray => {
      console.log("here");
      console.log(resultarray);
      var statuscode = resultarray[0];
      var result = resultarray[1];
      console.log(statuscode);
      console.log(typeof statuscode);
      console.log(result);
      console.log(typeof result);
      //const bla2 = result.json().;
      //console.log(bla2);
      //var nn = result.then(e => e, e => e);
      //console.log(typeof nn);
      //console.log(nn);
      //console.log(nn.tppMessages);
      //console.log(result.then(this.f.bind(this)).catch());
      //var bla = result.then(this.f.bind(this)).catch();
      //console.log(bla);
      //result = this.state.fetchresult;
      //console.log(this.state);
      //console.log(result);
      const vv = result.then(this.handleloginresult(this, result, statuscode)).catch((error) => console.log(error.message));
      console.log(vv);
    });
    console.log("here")
    console.log(this.state)
  }

  addMessage(event) {
    if (event.keyCode == 13 && event.shiftKey == false) {
      this.handleSubmit(event); // <--- all the form values are in a prop
    }
  }

  buttonClick(event) {
    this.state.logon = undefined;
    Client.search("/accounts/" + bank + "/" + this.state.psuid, (result) => {
      this.setState({
        accounts: result.accounts
      });
    });
    console.log("here")
    console.log(this.state)
    this.state.subsubpage = 2

  }

   handleTransactionClick(props, event, value) {
    console.log(props);
    console.log(event);
    console.log(value);
    var account = value;
    this.state.logon = undefined;
    Client.search("/accounts/" + bank + "/" + this.state.psuid + "/" + account + "/transactions", (resultarray) => {
      console.log(resultarray);
      var statuscode = resultarray[0];
      var result = resultarray[1];
      const vv = result.then(this.handletransactionresult(this, result, statuscode)).catch((error) => console.log(error.message));
      console.log(vv);
    });
    console.log("here")
    console.log(this.state)
  }

  dropdownkonto(unknown, event) {
    console.log(unknown)
    console.log(event.target.id)
    const targetid = event.target.id
    console.log(event.target.name)
    console.log(this.state)
    console.log("here");
    this.setState({
      page: 4,
      subpage: event.target.id,
      subsubpage: 1
    });
    //readAccounts();
  }

  readAccounts() {
    Client.search("/accounts/" + bank + "/" + this.state.psuid, (resultarray) => {
      console.log("here");
      console.log(resultarray);
      var statuscode = resultarray[0];
      var result = resultarray[1];
      console.log(statuscode);
      console.log(typeof statuscode);
      console.log(result);
      console.log(typeof result);
      this.handlekontoresult(this, result, statuscode);
      //const vv = result.then(this.handlekontoresult(this, result, statuscode)).catch((error) => console.log(error.message));
      //console.log(vv);
    });
  }

  dropdownbetale(unknown, event) {
    console.log(event)
    console.log(event.target.id)
    console.log(event.target.value)
    console.log(this.state)
    console.log("here");
    this.setState({
      page: 5,
      subpage: event.target.id,
      subsubpage: 1
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
    let comp2 = (
      <h2></h2>
    )
    if (this.state.page != 1 && this.state.page != 99) {
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
      console.log(this.state.logon)
      console.log(win)
      if (win != null) {
        win.focus();
      }
      console.log(new Date().getSeconds())
      this.sleep(15000);
      console.log(new Date().getSeconds())
      console.log("undef");
      this.state.logon = undefined;
      this.readAccounts();
      console.log(this.state);
    }
    if (this.state.page == 3) {
      console.log(this.state);
      if (this.state.subpage == 0) {
        let comp0;
        comp0 = this.getAccounts(this.state.accounts, new Date().toISOString(), this.props);
        comp = comp0;
      }
    }
    if (this.state.page == 4) {
      console.log(this.state);
      let comp0;
      comp0 = this.getAccounts(this.state.accounts, new Date().toISOString(), this.props);
      comp = comp0;
      if (this.state.subpage == 1) {

      }
      if (this.state.subpage == 2) {
        var accountmenu = ConvertToSelect.convertAccounts(this.state.accounts.accounts);
        if (this.state.account === undefined) {
          this.state.account = this.state.accounts.accounts[0].bban;
        }
        comp = (
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#home">{this.type}</a>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <Form>
                <FormGroup controlId="form">
                  <ControlLabel>Working example without validation</ControlLabel>
                  <NavItem eventKey={1} href="#">
                    Konto
                    <Select onChange={this.handleAccountChange} options={accountmenu}/>
                  </NavItem>
                </FormGroup>
              </Form>
            </Nav>
          </Navbar>
        )
        comp2 = this.getTransactions(this.state.transactions, new Date().toISOString(), this.props);
      }
    }
    if (this.state.page == 5) {
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
                  <FormGroup controlId="form">
                    <ControlLabel>Working example without validation</ControlLabel>
                    <NavItem eventKey={1} href="#">
                      Konto
                      <Select onChange={this.handleAccountChange} options={accts}/>
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
    if (this.state.page == 99) {
      console.log(this.state);
      console.log(this.state.error);
      var msgs = this.state.error.tppMessages;
      let lines = []
      var i;
      for (i = 0; i < msgs.length; i++) {
        lines.push(<h3>{msgs[i].text}</h3>);
      }
      comp = (
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#home">ERROR</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={3} href="#">
              {lines}
            </NavItem>
          </Nav>
        </Navbar>
      )
    }
    return (
      <div>
        {menu}
        {comp}
        {comp2}
      </div>
    );
  }
}

export default DNBBar;

