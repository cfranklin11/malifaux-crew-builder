import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as CrewActions from '../actions/CrewActions';
import {CrewFilter, SSDisplay} from '../components';

export default class CrewBuilder extends Component {

  componentDidMount() {
    const {selectedFaction, actions} = this.props;
    actions.fetchCharactersIfNeeded(selectedFaction);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedFaction !== this.props.selectedFaction) {
      const {actions, faction} = nextProps;
      actions.fetchPostsIfNeeded(faction);
    }
  }

  render() {
    const {ssLimit, ssCostSum, ssCache} = this.props.soulstones;
    const {actions, selectedFaction} = this.props;
    return (
      <div>
        <h1>Malifaux Crew Builder</h1>
        <CrewFilter actions={actions} selectedFaction={selectedFaction} />
        <SSDisplay ssLimit={ssLimit} ssCostSum={ssCostSum} ssCache={ssCache} />
      </div>
    );
  }
}

CrewBuilder.propTypes = {
  soulstones: PropTypes.object.isRequired,
  selectedFaction: PropTypes.string.isRequired,
  leaders: PropTypes.array.isRequired,
  characters: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const {soulstones, selectedFaction, charactersByFaction} = state;
  const {
    isFetching,
    leaders,
    characters
  } = charactersByFaction[selectedFaction] ||
  {
    isFetching: true,
    leaders: [],
    characters: []
  };

  return {
    soulstones,
    selectedFaction,
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
