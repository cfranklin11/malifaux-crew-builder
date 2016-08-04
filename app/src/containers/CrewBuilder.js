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
    const {actions, selectedFaction} = this.props;
    const {characters, isLeaderAdded} = this.props;

    return (
      <div className="container">
        <h1>Malifaux Crew Builder</h1>
        <CrewFilter
          actions={actions}
          selectedFaction={selectedFaction}
          characters={characters}
          isLeaderAdded={isLeaderAdded}
        />
        <SSDisplay
          ssLimit={ssLimit}
          ssCostSum={ssCostSum}
          ssCache={ssCache}
        />
        <CrewList
          actions={actions}
          characters={characters}
        />
      </div>
    );
  }
}

CrewBuilder.propTypes = {
  soulstones: PropTypes.object.isRequired,
  selectedFaction: PropTypes.string.isRequired,
  characters: PropTypes.object.isRequired,
  isLeaderAdded: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const {soulstones, selectedFaction, charactersByFaction} = state;
  const {
    isFetching,
    isLeaderAdded,
    characters
  } = charactersByFaction[selectedFaction] ||
  {
    isFetching: true,
    isLeaderAdded: false,
    characters: {}
  };

  return {
    soulstones,
    selectedFaction,
    isFetching,
    characters,
    isLeaderAdded
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
