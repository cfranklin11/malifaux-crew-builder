import React, {Component, PropTypes} from 'react';
import {CharacterSelect} from '../components';

export default class CrewFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      faction: this.props.selectedFaction
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

  handleFactionChange(e) {
    const {actions} = this.props;
    const selectedFaction = e.target.value;
    actions.selectFaction(selectedFaction);
  }

  render() {
    const {leaders, actions, followers} = this.props;
    const {value} = this.state;
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <div className="form-group">
          <label htmlFor="ss-limit-input">Soulstone Limit</label>
          <input
            type="number"
            id="ss-limit-input"
            name="ss-limit"
            value={value}
            onChange={this.handleLimitChange.bind(this)}
            onKeyDown={this.handleSubmit.bind(this)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="faction-select">Faction</label>
          <select
            id="faction-select"
            onChange={this.handleFactionChange.bind(this)}
          >
            <option value="guild">The Guild</option>
            <option value="resurrectionists">Resurrectionists</option>
            <option value="neverborn">Neverborn</option>
            <option value="arcanists">Arcanists</option>
            <option value="outcasts">Outcasts</option>
            <option value="ten-thunders">Ten Thunders</option>
            <option value="gremlins">Gremlins</option>
          </select>
        </div>

        <div>
          <CharacterSelect
            characters={leaders}
            role="leader"
            actions={actions}
          />
          <CharacterSelect
            characters={followers}
            role="followers"
            actions={actions}
          />
        </div>
      </div>
    );
  }
}

CrewFilter.propTypes = {
  value: PropTypes.number,
  selectedFaction: PropTypes.string.isRequired,
  leaders: PropTypes.array.isRequired,
  followers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};
