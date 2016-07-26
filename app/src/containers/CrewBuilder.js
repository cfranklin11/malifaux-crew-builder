import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as CrewActions from '../actions/CrewActions';
import {CrewFilter, SSDisplay} from '../components';

export default class CrewBuilder extends Component {

  componentDidMount() {
    const {faction, actions} = this.props;
    actions.fetchCharactersIfNeeded(faction);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.faction !== this.props.faction) {
      const {actions, faction} = nextProps;
      actions.fetchPostsIfNeeded(faction);
    }
  }

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
  faction: PropTypes.string.isRequired,
  leaders: PropTypes.array.isRequired,
  characters: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const {ssLimit, ssCostSum, ssCache, faction, charactersByFaction} = state;
  const {
    isFetching,
    leaders,
    characters
  } = charactersByFaction[faction] ||
  {
    isFetching: true,
    leaders: [],
    characters: []
  };

  return {
    ssLimit,
    ssCostSum,
    ssCache,
    faction,
    isFetching,
    leaders,
    characters
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
