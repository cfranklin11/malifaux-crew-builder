import React, {Component, PropTypes} from 'react';
import {CharacterSelect} from '../components';

export default class CrewFilter extends Component {
  constructor(props) {
    super(props);

    const {selectedFaction} = this.props;
    this.state = {
      value: 0,
      faction: selectedFaction
    };
  }

  handleLimitChange(e) {
    this.setState({value: e.target.value});
  }

  handleSubmit(e) {
    const {actions} = this.props;
    const value = Math.ceil(e.target.value);
    if (e.which === 13) {
      actions.updateSSLimit(value);
    }
  }

  handleBlur(e) {
    const {actions} = this.props;
    const value = Math.ceil(e.target.value);
    actions.updateSSLimit(value);
  }

  handleFactionChange(e) {
    const {actions} = this.props;
    const selectedFaction = e.target.value;
    actions.selectFaction(selectedFaction);
  }

  render() {
    const {
      actions,
      isLeaderAdded,
      leaderName,
      characters,
      ssLimit,
      selectedFaction
    } = this.props;
    const {value} = this.state;

    return (
      <div className="app-section">
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <div className="form-group col-xs-6 col-xs-offset-3">
              <label htmlFor="ss-limit-input">Soulstone Limit</label>
              <input
                className="form-control text-center"
                type="number"
                id="ss-limit-input"
                name="ss-limit"
                value={value}
                onChange={this.handleLimitChange.bind(this)}
                onKeyDown={this.handleSubmit.bind(this)}
                onBlur={this.handleBlur.bind(this)}/>
            </div>

            <div className="form-group col-xs-6 col-xs-offset-3">
              <label htmlFor="faction-select">Faction</label>
              <select
                className="form-control"
                id="faction-select"
                onChange={this.handleFactionChange.bind(this)}>
                <option value="guild">The Guild</option>
                <option value="resurrectionists">Resurrectionists</option>
                <option value="neverborn">Neverborn</option>
                <option value="arcanists">Arcanists</option>
                <option value="outcasts">Outcasts</option>
                <option value="ten-thunders">Ten Thunders</option>
                <option value="gremlins">Gremlins</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <CharacterSelect
            characters={characters}
            role="leaders"
            actions={actions}
            isLeaderAdded={isLeaderAdded}
            leaderName={leaderName}
            ssLimit={ssLimit}
            selectedFaction={selectedFaction}/>
          <CharacterSelect
            characters={characters}
            role="followers"
            actions={actions}
            isLeaderAdded={isLeaderAdded}
            leaderName={leaderName}
            ssLimit={ssLimit}
            selectedFaction={selectedFaction}/>
        </div>
      </div>
    );
  }
}

CrewFilter.propTypes = {
  value: PropTypes.number,
  selectedFaction: PropTypes.string.isRequired,
  characters: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  isLeaderAdded: PropTypes.bool.isRequired,
  leaderName: PropTypes.string,
  ssLimit: PropTypes.number.isRequired
};
