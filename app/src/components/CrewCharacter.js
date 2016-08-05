import React, {Component, PropTypes} from 'react';

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
      role,
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

    return (
        <tr>
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
  actions: PropTypes.object.isRequired,
  selectedFaction: PropTypes.string.isRequired
};
