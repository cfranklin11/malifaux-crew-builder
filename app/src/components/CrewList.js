import React, {Component, PropTypes} from 'react';
import {CrewCharacter, CrewUpgrade} from '../components';
import {LEADER_REGEXP} from '../constants/RegExps';
import {isUpgradable} from '../utils/UpgradeValidations';

export default class CrewList extends Component {
  render() {
    const {
      characters,
      actions,
      selectedFaction,
      leaderName,
      ssLimit,
      upgrades
    } = this.props;
    const roles = ['leader', 'follower'];
    let tableRows = [];
    let index = -1;

    // Loop through leader & follower sections of crew list
    for (let i = 0; i < roles.length; i++) {
      const thisRole = roles[i];

      // Add section labels
      tableRows.push(
        <tr key={index++}>
          <th>{thisRole}</th>
          <th colSpan="10"></th>
        </tr>
      );

      // Create array of all table rows
      tableRows = tableRows.concat(
        characters
          // Filter for characters that have been added,
          // segmented by leader/follower
          .filter(character => {
            const correctRole = LEADER_REGEXP.test(thisRole) ?
              character.isLeader : !character.isLeader;
            return character.count > 0 && correctRole;
          })
          .map(character => {
            const {characterUpgrades, count} = character;
            let characterRows = [];

            // Return character components
            for (let j = 0; j < count; j++) {
              characterRows.push(
                <CrewCharacter
                  key={index++}
                  actions={actions}
                  role={thisRole}
                  character={character}
                  characters={characters}
                  selectedFaction={selectedFaction}
                  leaderName={leaderName}
                  ssLimit={ssLimit}
                  version={j}
                  upgrades={upgrades} />
              );

              // If character is upgradable, separate individuals
              // into different components;
              // otherwise, roll them up into one row
              if (!isUpgradable) {
                break;
              }

              // Add upgrade row(s) below associated character
              for (let k = 0; k < characterUpgrades.length; k++) {
                const thisUpgrade = characterUpgrades[k];
                const {versions} = thisUpgrade;

                // The 'versions' array associates upgrades with
                // specific instances of upgradable characters
                for (let l = 0; l < versions.length; l++) {
                  const thisVersion = versions[l];

                  // Check if this upgrade is associated with
                  // this character version
                  if (parseFloat(thisVersion) === j) {
                    characterRows.push(
                      <CrewUpgrade
                        actions={actions}
                        character={character}
                        selectedFaction={selectedFaction}
                        upgrade={thisUpgrade}
                        upgrades={upgrades}
                        characterUpgrades={characterUpgrades} />
                    );
                    break;
                  }
                }
              }
            }
            return characterRows;
          })
      );
    }

    return (
      <div className="app-section">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Count</th>
              <th>Name</th>
              <th>Faction</th>
              <th>Station</th>
              <th>Limit</th>
              <th>Characteristics</th>
              <th>Cost</th>
              <th>Cache</th>
              <th>Upgrades</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  }
}

CrewList.propTypes = {
  characters: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  selectedFaction: PropTypes.string.isRequired,
  leaderName: PropTypes.string,
  ssLimit: PropTypes.number.isRequired,
  upgrades: PropTypes.array.isRequired
};
