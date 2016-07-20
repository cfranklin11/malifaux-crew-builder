import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as FormActions from '../actions/FormActions';
import CrewFilter from '../components/CrewFilter';
import CrewList from '../components/CrewList';

@connect(state => ({
  todolist: state.todolist
}))
export default class TodoApp extends Component {

  static propTypes = {
    todosById: PropTypes.object.isRequired,
    addedToday: PropTypes.number.isRequired,
    completedToday: PropTypes.number.isRequired,
    progressToday: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render () {
    const { todolist: { todosById, addedToday, completedToday, progressToday }, dispatch } = this.props;
    const actions = bindActionCreators(FormActions, dispatch);
    return (
      <h1>Malifaux Crew Builder</h1>
      <CrewForm selectFaction={actions.selectFaction} />
    );
  }
}
