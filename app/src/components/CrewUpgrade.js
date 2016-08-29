import React, {Component, PropTypes} from 'react';

export default class CrewCharacter extends Component {
  handleRemove(e) {
    const {upgrades, actions, character, selectedFaction, upgrade} = this.props;
    actions.toggleUpgrade(upgrades, upgrade, character, selectedFaction, 'remove');
  }

  render() {
    const {upgrade} = this.props;

    return (
      <tr className="upgrade-row">
        <td colSpan="5"></td>
        <td>{upgrade.limit === 0 ? '-' : upgrade.limit}</td>
        <td></td>
        <td>{upgrade.cost}</td>
        <td></td>
        <td>{upgrade.name}</td>
        <td>
          <button
            type="submit"
            className="btn btn-default btn-sm"
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
  upgrade: PropTypes.object.isRequired,
  upgrades: PropTypes.array.isRequired
};
