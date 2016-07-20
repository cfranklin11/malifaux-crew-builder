import React, { Component } from 'react';
import { combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { createStore, renderDevTools } from './stores/configureStore';

import CrewBuilder from './containers/CrewBuilder';
import * as reducers from './reducers/crewBuilder';

const reducer = combineReducers(reducers);
const createStoreWithMiddleware = applyMiddleware(multi)(createStore);
const store = createStoreWithMiddleware(reducer);

export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          {() => <CrewBuilder /> }
        </Provider>

        {renderDevTools(store)}
      </div>
    );
  }
}