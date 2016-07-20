import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as FormActions from '../actions/FormActions';
import CrewFilter from '../components/CrewFilter';
import CrewList from '../components/CrewList';

@connect(state => ({
  crewBuilder: state.crewBuilder,
}));
export default class TodoApp extends Component {

  static propTypes = {
    ssLimit: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  render () {
    const { crewBuilder: { ssLimit }, dispatch } = this.props;
    const actions = bindActionCreators(FormActions, dispatch);
    return (
      <h1>Malifaux Crew Builder</h1>
      <CrewFilter updateSSLimit={actions.updateSSLimit} />
    );
  }
}
