import React, {Component, PropTypes} from 'react';

export default class CrewCharacter extends Component {
  handleRemove(e) {
    const {actions} = this.props;
    let characterToRemove = e.target.id;
    actions.removeCharacter(characterToRemove);
  }

  render() {
    let {character:
      {
        count = '-',
        name = '-',
        station = 'Leader',
        limit = '-',
        characteristics = '-',
        sscost = '-',
        sscache = '-'
      }
    } = this.props;
    const nameId = name ? name.replace(/\s/g, '-').toLowerCase() : '';
    return (
        <tr>
          <td>{count}</td>
          <td>{name}</td>
          <td>{station}</td>
          <td>{limit}</td>
          <td>{characteristics}</td>
          <td>{sscost}</td>
          <td>{sscache}</td>
          <td>
            <button
              type="submit"
              className="btn btn-default"
              id={nameId}
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
  actions: PropTypes.object.isRequired
};
