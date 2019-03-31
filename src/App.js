import React, { Component } from 'react';
import store, { history } from 'redux/createStore';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Routes from 'routes';

class App extends Component {
  render () {
    return (
      <Provider store={ store } history={ history }>
        <ConnectedRouter history={ history }>
          <Routes />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
