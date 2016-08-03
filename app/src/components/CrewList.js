import React, {Component, PropTypes} from 'react';
import {CrewCharacter} from '../components';

export default class CrewList extends Component {
  render() {
    const {actions, crew: {leader, followers}} = this.props;
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
  crew: PropTypes.object,
  actions: PropTypes.object.isRequired
};
