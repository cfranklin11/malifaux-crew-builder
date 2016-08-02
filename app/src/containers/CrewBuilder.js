import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as CrewActions from '../actions/CrewActions';
import {CrewFilter, SSDisplay, CrewList} from '../components';

export default class CrewBuilder extends Component {

  componentDidMount() {
    const {selectedFaction, actions} = this.props;
    actions.fetchCharactersIfNeeded(selectedFaction);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedFaction !== this.props.selectedFaction) {
      const {actions, selectedFaction} = nextProps;
      actions.fetchCharactersIfNeeded(selectedFaction);
    }
  }

  render() {
    const {ssLimit, ssCostSum, ssCache} = this.props.soulstones;
    const {actions, selectedFaction, leaders, followers, crew} = this.props;
    return (
      <div className="container">
        <h1>Malifaux Crew Builder</h1>
        <CrewFilter
          actions={actions}
          selectedFaction={selectedFaction}
          leaders={leaders}
          followers={followers}
        />
        <SSDisplay
          ssLimit={ssLimit}
          ssCostSum={ssCostSum}
          ssCache={ssCache}
        />
        <CrewList
          actions={actions}
          crew={crew}
        />
      </div>
    );
  }
}

CrewBuilder.propTypes = {
  soulstones: PropTypes.object.isRequired,
  selectedFaction: PropTypes.string.isRequired,
  leaders: PropTypes.array.isRequired,
  followers: PropTypes.array.isRequired,
  crew: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const {soulstones, selectedFaction, charactersByFaction, crew} = state;
  const {
    isFetching,
    leaders,
    followers
  } = charactersByFaction[selectedFaction] ||
  {
    isFetching: true,
    leaders: [],
    followers: []
  };

  return {
    soulstones,
    selectedFaction,
    crew,
    isFetching,
    leaders,
    followers
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
