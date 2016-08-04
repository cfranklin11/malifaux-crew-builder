import React, {Component, PropTypes} from 'react';
import {CrewCharacter} from '../components';

export default class CrewList extends Component {
  render() {
    const {actions, characters: {leaders, followers}} = this.props;
    const leader = leaders.find(leader => {
      return leader.count === 1;
    }) ||
    {
      count: '-',
      name: '-',
      station: 'Leader',
      limit: '-',
      characteristics: '-',
      sscost: '-',
      sscache: '-'
    };
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>Name</th>
              <th>Station</th>
              <th>Limit</th>
              <th>Characteristics</th>
              <th>Cost</th>
              <th>Cache</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
      </div>
    );
  }
}

CrewList.propTypes = {
  characters: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};
