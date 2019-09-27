import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

class Header extends PureComponent {
  render() {
    const { pathname } = this.props.location;

    return (
      <header className="globalHeader">
      </header>
    );
  }
}

export default Header;
