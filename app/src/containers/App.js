import React, {Component} from 'react';
import {Provider} from 'react-redux';
import configureStore from '../stores/configureStore';
import CrewBuilder from './CrewBuilder';

const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <CrewBuilder />
        </Provider>
      </div>
    );
  }
}
