import React, { Component, PureComponent, Fragment } from 'react';

import { Button } from 'react-bootstrap';

import './Main.css';
import { Tabs, Tab } from 'react-bootstrap';

import { DNB } from '../Misc'
import { Misc } from '../Misc'
import { Vipps } from '../Misc'
import { Test } from '../test'

const tablist = [];

function newtab() {
		  }

class Main extends React.Component {
    getanewtab(title) {
	return(
            <Tab title={title}>
              <h2>Any content 3</h2>
            </Tab>
	)
    }

    render() {
      console.log(this)
	const { main } = this.props;
	const result = main && main.result2 ? main.result2 : null;
	const tabs = main && main.tabs ? main.tabs : null;

	var mytabs = tabs;
	var map = new Object();
	var newtab = new Tab(map);
	console.log(tabs);
	var arrayLength = tabs.length;
	console.log("arr");
	console.log(tabs);
	console.log(arrayLength);

	if (result && result.size && result.size > 0) {
	    return (
		<Fragment>
		  <h1>Catware React</h1>
		  <Tabs defaultActiveKey={0} id="maintabs">
		    <Tab eventKey={0} title="DNB">
		      <DNB history={main.history}/>
		    </Tab>
		    { mytabs.map(item => this.getanewtab(item)) }
		  </Tabs>
		</Fragment>
	    );
	}
	return <div />;
    }
}

export default Main;
