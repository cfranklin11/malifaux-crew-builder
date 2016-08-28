import React, {Component, PropTypes} from 'react';
import {UpgradeSelect} from '../components';
import {LEADER_REGEXP} from '../constants/RegExps';
import {isValidCharacter, isLessThanLimit} from '../utils/RulesValidations';

export default class CrewCharacter extends Component {
  handleRemove(e) {
    const {role, actions, character, selectedFaction} = this.props;

    if (LEADER_REGEXP.test(role)) {
      actions.toggleLeader(character, selectedFaction, 'remove');
    } else {
      actions.toggleFollower(character, selectedFaction, 'remove');
    }
  }

  render() {
    const {
      actions,
      ssLimit,
      role,
      selectedFaction,
      leaderName,
      upgrades,
      character
    } = this.props;
    const {
      count,
      name,
      faction,
      station,
      limit,
      characteristics,
      sscost,
      sscache
      } = character;
    const stateProps = {role, ssLimit, selectedFaction, leaderName};
    const invalid = isValidCharacter(character, stateProps) ? '' : 'invalid';

    return (
      <tr className={invalid}>
        <td></td>
        <td>{count}</td>
        <td>{name}</td>
        <td>{faction}</td>
        <td>{station}</td>
        <td>{limit}</td>
        <td>{characteristics}</td>
        <td>{role === 'leader' ? '-' : sscost}</td>
        <td>{role === 'leader' ? sscache : '-'}</td>
        <td>
          <UpgradeSelect
            upgrades={upgrades}
            character={this.props.character}
            leaderName={leaderName}
            selectedFaction={selectedFaction}
            actions={actions} />
        </td>
        <td>
          <button
            type="submit"
            className="btn btn-default"
            onClick={this.handleRemove.bind(this)}>
            <span className="glyphicon glyphicon-remove" aria-hidden="true">
            </span>
          </button>
        </td>
      </tr>
    );
  }
}

CrewCharacter.propTypes = {
  character: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  selectedFaction: PropTypes.string.isRequired,
  leaderName: PropTypes.string.isRequired,
  upgrades: PropTypes.array.isRequired,
  ssLimit: PropTypes.number.isRequired
};
