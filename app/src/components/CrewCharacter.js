import React, {Component, PropTypes} from 'react';

export default class CrewCharacter extends Component {
  handleRemove(e) {
    const {role, actions, character} = this.props;

    if (role === 'leader') {
      actions.toggleLeader(character, 'remove');
    } else {
      actions.toggleFollower(character, 'remove');
    }
  }

  render() {
    const {
      role,
      character:
      {
        count,
        name,
        station,
        limit,
        characteristics,
        sscost,
        sscache
      }
    } = this.props;
    return (
        <tr>
          <td>{count}</td>
          <td>{name}</td>
          <td>{station}</td>
          <td>{limit}</td>
          <td>{characteristics}</td>
          <td>{role === 'leader' ? '-' : sscost}</td>
          <td>{role === 'leader' ? sscache : '-'}</td>
          <td>
            <button
              type="submit"
              className="btn btn-default"
              onClick={this.handleRemove.bind(this)}
            >
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
  actions: PropTypes.object.isRequired
};
