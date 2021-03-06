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

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
            data: [],
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
      this.submitMoreMoney = this.submitMoreMoney.bind(this);
      this.addNewQnaToTable = this.addNewQnaToTable.bind(this);
      this.renderEditable = this.renderEditable.bind(this);
      this.renderEditableSelect = this.renderEditableSelect.bind(this);
      this.renderEditableDate = this.renderEditableDate.bind(this);
      //this.state.data.push({firstName: 'f', lastName: 'l'});
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
      var amount = new Object();
      amount['amount'] = this.state.money;
      amount['currency'] = 'NOK';
      var aData = this.state.data[0];
      var payment = new Object();
      payment['psuid'] = this.state.psuid;
      payment['bank'] = bank;
      payment['creditorAccount'] = { "bban" : aData.creditor };
      payment['creditorName'] = 'My Name';
      payment['debtorAccount'] = { "bban" : aData.account };
	  payment['instructedAmount'] = { "amount" : aData.amount, "currency": "NOK" };
	  payment['requestedExecutionDate'] = aData.date;
      Client.post("/accounts/pay", payment, (resultarray) => {
      console.log(resultarray);
      var statuscode = resultarray[0];
      var result = resultarray[1];
      console.log(statuscode);
      console.log(typeof statuscode);
      console.log(result);
      console.log(typeof result);
      const vv = result.then(this.handlepayresult(this, result, statuscode)).catch((error) => console.log(error.message));
      console.log(vv);
    });
    console.log("here")
    console.log(this.state)
  }

  async handlepayresult(mythis, result, statuscode) {
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
	var result3 = JSON.parse(result2);
      mythis.setState({
        paymentid: result3.paymentId,
        logon: result3._links.scaRedirect.href,
        subsubpage: 2,
	  data: [],
    });
    } else {
      mythis.setState({
        error: result2,
        page: 99,
      });
    }
  }

  async handlepaymentsresult(mythis, result, statuscode) {
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
	var result3 = JSON.parse(result2);
      mythis.setState({
        //paymentid: result3.paymentId,
        logon: result3._links.scaRedirect.href,
        subsubpage: 2,
	  data: [],
    });
    } else {
      mythis.setState({
        error: result2,
          page: 99,
      });
    }
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
    //console.log("window reset")
    //window.location.search = 'psu='+mythis.state.psuid;
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

  // deprecated
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
	subsubpage: 1,
	data: [],
    });
  }

  submitMoreMoney(event) {
      console.log(this.state)
      var amount = new Object();
      amount['amount'] = this.state.money;
      amount['currency'] = 'NOK';
      var payments = [];
      var i;
      for (i = 0; i < this.state.data.length; i++) {
	  var aData = this.state.data[i];
      var payment = new Object();
      payment['psuid'] = this.state.psuid;
      payment['bank'] = bank;
      payment['creditorAccount'] = { "bban" : aData.creditor };
      payment['creditorName'] = 'My Name';
      payment['debtorAccount'] = { "bban" : aData.account };
	  payment['instructedAmount'] = { "amount" : aData.amount, "currency": "NOK" };
	  payment['requestedExecutionDate'] = aData.date;
	  payments.push(payment);
      }
      var mypayments = new Object();
      mypayments['payments'] = payments;
      console.log(mypayments);
      Client.post("/accounts/payments", mypayments, (resultarray) => {
      console.log(resultarray);
      var statuscode = resultarray[0];
      var result = resultarray[1];
      console.log(statuscode);
      console.log(typeof statuscode);
      console.log(result);
      console.log(typeof result);
      const vv = result.then(this.handlepaymentsresult(this, result, statuscode)).catch((error) => console.log(error.message));
      console.log(vv);
    });
    console.log("here")
    console.log(this.state)
  }

    getColumns() {
		    const columns = [];
	    columns.push({
                Header: "Kontonr",
                accessor: "account",
                Cell: this.renderEditableSelect
            });
	    columns.push({
                Header: "Dato",
                accessor: "date",
                Cell: this.renderEditableDate
            });
	    columns.push({
                Header: "Beløp",
                accessor: "amount",
                Cell: this.renderEditable
            });
	    columns.push({
                Header: "Melding",
                accessor: "message",
                Cell: this.renderEditable
            });
	    columns.push({
                Header: "Mottaker",
                accessor: "creditor",
                Cell: this.renderEditable
            });
	return columns;
    }

  render() {
    console.log("xxx")
    console.log(this.state.psuid)
    console.log(this)
    console.log(this.state.page)
    console.log(this.state.subpage)
    console.log(this.state.subsubpage)
    console.log(this.state.value == undefined)
    console.log(this.state)
    console.log(this.state.psuid == undefined)
      console.log(this.state.data)
    var urlParams = new URLSearchParams(window.location.search);
    var psu = urlParams.get('psu');
    var go = urlParams.get('go');
    console.log(psu);
    console.log(go);
    if (psu != undefined) {
      console.log(this.state.psuid);
      this.state.psuid = psu;
      console.log(window.location.pathname);
      console.log(window.location.href);
      this.props.history.pushState({ myid : "here"}, "", window.location.pathname)
      if (go == undefined) {

      }
      if (go == 1) {
        this.state.logon = undefined;
        this.readAccounts();
      }
      if (go == 2) {
        this.state.page = 5;
        this.state.subpage = 1;
        this.state.subsubpage = 3;
      }
      if (go == 3) {
        this.state.page = 5;
        this.state.subpage = 2;
        this.state.subsubpage = 3;
      }
       //this.props.history.push(`${window.location.pathname}`)
      console.log("reset window.location.search");
      //window.location.search = 'psu='+psu;
      console.log("reset window.location.search");
    }
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
            <MenuItem id="2" name="betaleen">Betale til flere</MenuItem>
            <MenuItem id="3" name="egne">Overføre egne kontoer</MenuItem>
            <MenuItem id="4" name="betalingsoversikt">Betalingsoversikt</MenuItem>
            <MenuItem id="5" name="betalinger">Utførte betalinger</MenuItem>
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
      var win = window.open(this.state.logon,"_self");
      console.log(this.state.logon)
      console.log(win)
      if (win != null) {
        win.focus();
      }
      console.log(new Date().getSeconds())
      // calling bad code
      //this.sleep(15000);
      console.log(new Date().getSeconds())
      console.log("undef");
      //this.state.logon = undefined;
      //this.readAccounts();
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
        if (this.state.subsubpage == 9999) {
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
        if (this.state.subsubpage == 1) {
          var accts = ConvertToSelect.convertAccounts(this.state.accounts);
            console.log("here");
	    if (this.state.data.length == 0) {
		this.state.data.push({
	  account: "",
	  date: "",
	  creditor: "",
	  amount: "",
	  message: "",
		});
	    }
	    const data = this.state.data;
	    const columns = this.getColumns();
          comp = (
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#home">{this.type}</a>
                </Navbar.Brand>
              </Navbar.Header>
              <Nav>
		<ReactTable
		  //key={date}
		  data={data}
		  columns={columns}
		  defaultPageSize={10}
		  className="-striped -highlight"
		  showPagination="false"
		  />
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
              </Nav>
            </Navbar>
          )
        }
        if (this.state.subsubpage == 2) {
          var win = window.open(this.state.logon,"_self");
          win.focus();
          console.log(new Date().getSeconds())
          // calling bad code
          //this.sleep(15000);
          console.log(new Date().getSeconds())
          console.log("undef");
          //this.state.logon = undefined;
        }
        if (this.state.subsubpage == 3) {
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
      if (this.state.subpage == 2) {
        if (this.state.subsubpage == 1) {
            var accts = [];//ConvertToSelect.convertAccounts(this.state.accounts);
            console.log("here");
	    const data = this.state.data;
	    console.log(data);
	    const columns = this.getColumns();

          comp = (
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#home">{this.type}</a>
                </Navbar.Brand>
              </Navbar.Header>
              <Nav>
		<Button
		  text='Add QnA'
		  primary={ true }
		  onClick={this.addNewQnaToTable}
		 >Add</Button>

		<ReactTable
		  //key={date}
		  data={data}
		  columns={columns}
		  defaultPageSize={10}
		  className="-striped -highlight"
		  />
                    <Nav>
                      <NavItem eventKey={3} href="#">
                        <Button
                          value={this.state.value}
                          placeholder="Enter text"
                          onClick={this.submitMoreMoney}
                        >
                          Send penger
                        </Button>
                      </NavItem>
                    </Nav>
              </Nav>
            </Navbar>
          )
        }
        if (this.state.subsubpage == 2) {
          var win = window.open(this.state.logon,"_self");
          if (win != null) {
            win.focus();
          }
        }
        if (this.state.subsubpage == 3) {
          console.log(new Date().getSeconds())
          // calling bad code
          // this.sleep(15000);
          console.log(new Date().getSeconds())
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
                  <h2>Betalinger registrert</h2>
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

  renderEditable = cellInfo => {
    const cellValue = this.state.data[cellInfo.index][cellInfo.column.id];

    return (
      <input
        placeholder="type here"
        name="input"
        type="text"
        onChange={this.handleInputChange.bind(null, cellInfo)}
        value={cellValue}
      />
    );
  };

  renderEditableSelect = cellInfo => {
    const cellValue = this.state.data[cellInfo.index][cellInfo.column.id];
    var accts = ConvertToSelect.convertAccountsHtml(this.state.accounts);
      //var accts0 = [ { label : '05404649541', value : '05404649541' } ];
      //var accts = [ { id : '05404649541', name : '05404649541 65000' } ];
      var data = accts;
      let options = accts.map((data) =>
                <option
                    key={data.id}
                    value={data.id}
                >
                    {data.name}
                </option>
            );
      console.log(accts);
      console.log(options);
      return (
	  <select name="customSearch" className="custom-search-select" onChange={this.handleInputChange.bind(null, cellInfo)}>
                <option>Select Item</option>
                {options}
           </select>
    );
  };

  renderEditableDate = cellInfo => {
    const cellValue = this.state.data[cellInfo.index][cellInfo.column.id];

    return (
	<DatePicker
	  dateFormat="yyyy-MM-dd"
        onChange={this.handleInputChangeDate.bind(null, cellInfo)}
      />
    );
  };

  addNewQnaToTable() {
      let newQnA = {
	  account: "",
	  date: "",
	  creditor: "",
	  amount: "",
	  message: "",
      };
      const insert = (arr, index, newItem) => [ ...arr.slice(0, index), newItem, ...arr.slice(index) ];
      console.log(newQnA);
      console.log(this.state.data.length);
      this.setState(oldstate => ({ data: insert(oldstate.data, 0, newQnA) }));
  }

    handleInputChange = (cellInfo, event) => {
	console.log(cellInfo)
	console.log(event)
    let data = [...this.state.data];
    data[cellInfo.index][cellInfo.column.id] = event.target.value;

    this.setState({ data });
  };

    handleInputChangeDate = (cellInfo, event) => {
	console.log(cellInfo)
	console.log(event)
    let data = [...this.state.data];
	data[cellInfo.index][cellInfo.column.id] = event;
	    //.target.value;

    this.setState({ data });
  };
}

export default DNBBar;

