import React, {Component, PropTypes} from 'react';
import {UpgradeSelect} from '../components';

export default class CrewCharacter extends Component {
  handleRemove(e) {
    const {role, actions, character, selectedFaction} = this.props;

    if (role === 'leader') {
      actions.toggleLeader(character, selectedFaction, 'remove');
    } else {
      actions.toggleFollower(character, selectedFaction, 'remove');
    }
  }

  render() {
    const {
      actions,
      role,
      selectedFaction,
      leaderName,
      upgrades,
      character:
      {
        count,
        name,
        faction,
        station,
        limit,
        characteristics,
        sscost,
        sscache
      }
    } = this.props;
    const specificTotemRegExp = /totem\s\(((?:\w*\s?)+)\)/i;
    const totemMaster = specificTotemRegExp.exec(characteristics) ?
      specificTotemRegExp.exec(characteristics)[1] : '';
    const totemMasterRegExp =
      new RegExp(totemMaster, 'i');
    const factionRegExp = new RegExp(selectedFaction, 'i');
    const invalid = factionRegExp.test(faction.replace(/\s/g, '-')) ||
      /mercenary/i.test(characteristics) ?
        totemMaster ?
          totemMasterRegExp.test(leaderName) ? '' : 'invalid' :
      '' : 'invalid';

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
  upgrades: PropTypes.array.isRequired
};
