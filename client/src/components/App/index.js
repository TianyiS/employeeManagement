import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from '../Home';
import Create from '../Create';
import Edit from '../Edit';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path='/' exact={true} component={Home} />
          <Route path='/create' component={Create} />
          <Route path='/edit/:soldierId' component={Edit} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;