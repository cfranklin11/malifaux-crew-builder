import React, {Component, PropTypes} from 'react';
import {CharacterFilter, CharacterSelect} from '../components';

export default class CrewFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.actions = this.props.actions;
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFactionChange = this.handleFactionChange.bind(this);
    this.hanldeLeaderChange = this.handleLeaderChange.bind(this);
  }

  handleLimitChange(e) {
    this.setState({value: e.target.value});
  }

  handleSubmit(e) {
    const value = Math.ceil(e.target.value);
    if (e.which === 13) {
      this.actions.updateSSLimit(value);
    }
  }

  handleFactionChange(e) {
    const faction = e.target.value;
    this.actions.selectFaction(faction);
  }

  render() {
    return (
      <div>
        <label htmlFor="ss-limit-input">Soulstone Limit</label>
        <input
          type="number"
          id="ss-limit-input"
          name="ss-limit"
          value={this.state.value}
          onChange={this.handleLimitChange}
          onKeyDown={this.handleSubmit}
        />

        <label htmlFor="faction-select">Faction</label>
        <select
          id="faction-select"
          onChange={this.handleFactionChange}
        >
          <option value="guild">The Guild</option>
          <option value="resurrectionists">Resurrectionists</option>
          <option value="neverborn">Neverborn</option>
          <option value="arcanists">Arcanists</option>
          <option value="outcasts">Outcasts</option>
          <option value="ten-thunders">Ten Thunders</option>
          <option value="gremlins">Gremlins</option>
        </select>

        <CharacterSelect />
        <CharacterFilter />
        <CharacterSelect />
      </div>
    );
  }
}

CrewFilter.propTypes = {
  value: PropTypes.number,
  faction: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};
