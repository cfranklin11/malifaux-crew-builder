import React, { Component } from 'react';
import { combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import multi from 'redux-multi';

import { createStore, renderDevTools } from '../store_enhancers/devTools';

import CrewBuilder from './CrewBuilder';
import * as reducers from '../reducers/crewBuilder';

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