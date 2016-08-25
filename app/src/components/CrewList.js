import React, {Component, PropTypes} from 'react';
import {CrewCharacter} from '../components';

export default class CrewList extends Component {
  render() {
    const {actions, characters, selectedFaction, leaderName} = this.props;

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
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Leader</th>
              <th colSpan="9"></th>
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
                  />
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
                return (
                  <CrewCharacter
                    key={index}
                    actions={actions}
                    role="follower"
                    character={character}
                    selectedFaction={selectedFaction}
                    leaderName={leaderName}
                  />
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
  leaderName: PropTypes.string.isRequired
};
