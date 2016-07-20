import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as CrewActions from '../actions/CrewActions';
import CrewFilter from '../components/CrewFilter';

export default class CrewBuilder extends Component {

  render() {
    const {actions} = this.props;

    return (
      <div>
        <h1>Malifaux Crew Builder</h1>
        <CrewFilter updateSSLimit={actions.updateSSLimit} />
      </div>
    );
  }
}

CrewBuilder.propTypes = {
  ssLimit: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    ssLimit: state.ssLimit
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(CrewActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CrewBuilder);
