import React, {Component, PropTypes} from 'react';
import {CrewCharacter} from '../components';

export default class CrewList extends Component {
  render() {
    const {actions, crew: {leader, followers}} = this.props;
    return (
      <div>
        <table>
          <th>
            <td>Name</td>
            <td>Station</td>
            <td>Limit</td>
            <td>Characteristics</td>
            <td>Cost</td>
            <td>Cache</td>
          </th>
          <CrewCharacter
            actions={actions}
            role="leader"
            character={leader}
          />
          {followers.map((follower, index) => {
            return (
              <CrewCharacter
                key={index}
                actions={actions}
                role="follower"
                character={follower}
              />
            );
          })}
        </table>
      </div>
    );
  }
}

CrewList.propTypes = {
  crew: PropTypes.object,
  actions: PropTypes.object.isRequired
};
