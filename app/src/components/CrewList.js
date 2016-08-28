import React, {Component, PropTypes} from 'react';
import {CrewCharacter, CrewUpgrade} from '../components';

export default class CrewList extends Component {
  render() {
    const {
      actions,
      characters,
      selectedFaction,
      leaderName,
      ssLimit,
      upgrades
    } = this.props;

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
            <tr>
              <th>Leader</th>
              <th colSpan="10"></th>
            </tr>
            {characters
              .filter(character => character.count > 0 && character.isLeader)
              .map((character, index) => {
                return (
                  <CrewCharacter
                    key={index}
                    actions={actions}
                    role="leader"
                    character={character}
                    selectedFaction={selectedFaction}
                    leaderName={leaderName}
                    ssLimit={ssLimit}
                    upgrades={upgrades} />
                );
              })
            }

            <tr>
              <th>Followers</th>
              <th colSpan="9"></th>
            </tr>
            {characters
              .filter(character => character.count > 0 && !character.isLeader)
              .map((character, index) => {
                const characterUpgrades = character.characterUpgrades;

                if (characterUpgrades.length > 0) {
                  const upgradeElements =
                    characterUpgrades.map((upgrade, index) => {
                      return (
                        <CrewUpgrade
                          key={index * 2}
                          actions={actions}
                          character={character}
                          selectedFaction={selectedFaction}
                          upgrade={upgrade} />
                      );
                    });

                  return [
                    <CrewCharacter
                      key={index * 2 + 1}
                      actions={actions}
                      role="follower"
                      character={character}
                      selectedFaction={selectedFaction}
                      leaderName={leaderName}
                      ssLimit={ssLimit}
                      upgrades={upgrades} />,

                    <tr>
                      <th></th>
                      <th>Upgrades</th>
                      <th>Name</th>
                      <th colSpan="2"></th>
                      <th>Limit</th>
                      <th></th>
                      <th>Cost</th>
                      <th>Remove</th>
                      <th colSpan="2"></th>
                    </tr>
                  ].concat(upgradeElements);
                }

                return (
                  <CrewCharacter
                    key={index}
                    actions={actions}
                    role="follower"
                    character={character}
                    selectedFaction={selectedFaction}
                    leaderName={leaderName}
                    ssLimit={ssLimit}
                    upgrades={upgrades} />
                );
              })
            }
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
