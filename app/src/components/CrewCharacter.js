import React, {Component, PropTypes} from 'react';
import {UpgradeSelect} from '../components';
import {LEADER_REGEXP} from '../constants/RegExps';
import {isValidCharacter} from '../utils/CharacterValidations';
import {isUpgradable} from '../utils/UpgradeValidations';

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
      version,
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
    const upgradeSelectElement = isUpgradable(station) ?
      <td>
        <UpgradeSelect
          upgrades={upgrades}
          character={this.props.character}
          leaderName={leaderName}
          selectedFaction={selectedFaction}
          version={version}
          actions={actions} />
      </td> :
      <td>-</td>;
    let costDisplay;

    if (LEADER_REGEXP.test(role)) {
      costDisplay = '-';
    } else {
      costDisplay = isUpgradable(station) ?
      sscost : parseFloat(sscost) * parseFloat(count);
    }

    return (
      <tr className={invalid}>
        <td></td>
        <td>{isUpgradable(station) ? 1 : count}</td>
        <td>{name}</td>
        <td>{faction}</td>
        <td>{station}</td>
        <td>{parseFloat(limit) === 0 ? '-' : limit}</td>
        <td>{characteristics}</td>
        <td>{costDisplay}</td>
        <td>{role === 'leader' ? sscache : '-'}</td>
        {upgradeSelectElement}
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
  leaderName: PropTypes.string,
  upgrades: PropTypes.array.isRequired,
  version: PropTypes.number.isRequired,
  ssLimit: PropTypes.number.isRequired
};
