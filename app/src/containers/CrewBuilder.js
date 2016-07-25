import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as CrewActions from '../actions/CrewActions';
import {CrewFilter, SSDisplay} from '../components';

export default class CrewBuilder extends Component {

  render() {
    const {ssLimit, ssCostSum, ssCache, actions} = this.props;

    return (
      <div>
        <h1>Malifaux Crew Builder</h1>
        <CrewFilter actions={actions} />
        <SSDisplay ssLimit={ssLimit} ssCostSum={ssCostSum} ssCache={ssCache} />
      </div>
    );
  }
}

CrewBuilder.propTypes = {
  ssLimit: PropTypes.number.isRequired,
  ssCostSum: PropTypes.number.isRequired,
  ssCache: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    ssLimit: state.ssLimit,
    ssCostSum: state.ssCostSum,
    ssCache: state.ssCache
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
