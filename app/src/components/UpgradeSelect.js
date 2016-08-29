import React, {Component, PropTypes} from 'react';
import {isPotentialUpgrade} from '../utils/UpgradeValidations';

export default class UpgradeSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUpgrade: {
        name: '',
        faction: '',
        cost: 0,
        limit: 0,
        namerestrictions: '',
        characteristicrestrictions1: '',
        characteristicrestrictions2: '',
        islimited: false
      }
    };
  }

  handleChange(e) {
    const {upgrades} = this.props;
    const upgradeName = e.target.value;
    // Get upgrade stats from upgrades array and save in state
    const currentUpgrade = upgrades.find(upgrade => {
      return upgradeName === upgrade.name;
    });

    this.setState({currentUpgrade});
  }

  handleAdd(e) {
    const {actions, character, selectedFaction, upgrades} = this.props;
    const {currentUpgrade} = this.state;

    actions.toggleUpgrade(
      upgrades,
      currentUpgrade,
      character,
      selectedFaction,
      'add'
    );
  }

  componentWillMount() {
    const {
      upgrades,
      selectedFaction,
      leaderName,
      character
    } = this.props;
    let firstUpgrade;

    for (let i = 0; i < upgrades.length; i++) {
      const stateProps = {selectedFaction, leaderName};
      const thisUpgrade = upgrades[i];

      if (isPotentialUpgrade(thisUpgrade, character, stateProps)) {
        firstUpgrade = thisUpgrade;
        break;
      }
    }

    this.setState({currentUpgrade: firstUpgrade});
  }

  render() {
    const {
      upgrades,
      selectedFaction,
      leaderName,
      character
    } = this.props;

    return (
      <div>
        <select
          onChange={this.handleChange.bind(this)}>
          {upgrades.filter(upgrade => {
            const stateProps = {selectedFaction, leaderName};
            return isPotentialUpgrade(upgrade, character, stateProps);
          })
          .map((upgrade, index) => {
            return (
              <option
                key={index}
                value={upgrade.name}>
                {upgrade.name}
              </option>
            );
          })}
        </select>

        <button
          type="submit"
          className="btn btn-default btn-xs"
          onClick={this.handleAdd.bind(this)}>
          <span className="glyphicon glyphicon-plus-sign" aria-hidden="true">
          </span>
        </button>
      </div>
    );
  }
}

UpgradeSelect.propTypes = {
  upgrades: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  character: PropTypes.object.isRequired,
  selectedFaction: PropTypes.string.isRequired,
  leaderName: PropTypes.string
};
