import React, {Component, PropTypes} from 'react';

export default class CrewCharacter extends Component {
  handleRemove(e) {
    const {actions, character, selectedFaction} = this.props;
    const removedUpgrade = e.target.id.replace(/-/g, ' ');

    actions.toggleUpgrade(removedUpgrade, character, selectedFaction, 'remove');
  }

  render() {
    const {
      upgrade
    } = this.props;

    return (
      <tr>
        <td colSpan="5"></td>
        <td>{upgrade.limit}</td>
        <td></td>
        <td>{upgrade.cost}</td>
        <td></td>
        <td>{upgrade.name}</td>
        <td>
          <button
            type="submit"
            className="btn btn-default"
            id={upgrade.name.replace(/\s/g, '-')}
            onClick={this.handleRemove.bind(this)}>
            <span
              className="glyphicon glyphicon-minus-sign"
              aria-hidden="true">
            </span>
          </button>
        </td>
      </tr>
    );
  }
}

CrewCharacter.propTypes = {
  character: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  selectedFaction: PropTypes.string.isRequired,
  upgrade: PropTypes.object.isRequired
};
