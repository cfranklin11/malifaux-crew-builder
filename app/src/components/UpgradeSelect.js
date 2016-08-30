import React, {Component, PropTypes} from 'react';
import {isPotentialUpgrade, isValidUpgrade} from '../utils/UpgradeValidations';

export default class UpgradeSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUpgrade: {
        name: '',
        faction: '',
        cost: 0,
        limit: 0,
        count: 0,
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
    const {actions, character, selectedFaction, upgrades, version} = this.props;
    const {currentUpgrade} = this.state;

    actions.toggleUpgrade(
      upgrades,
      currentUpgrade,
      character,
      selectedFaction,
      version,
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

  // Refresh currently selected upgrade with new count number on change
  componentWillReceiveProps(nextProps) {
    const {character: {characterUpgrades}} = this.props;
    const {currentUpgrade: {name}} = this.state;
    const nextUpgrade = characterUpgrades.find(characterUpgrade => {
      return characterUpgrade.name === name;
    });

    if (nextUpgrade) {
      this.setState({currentUpgrade: nextUpgrade});
    }
  }

  render() {
    const {
      upgrades,
      selectedFaction,
      leaderName,
      version,
      character
    } = this.props;
    const {currentUpgrade} = this.state;
    const stateProps = {selectedFaction, leaderName};
    const isDisabled =
      !isValidUpgrade(currentUpgrade, character, stateProps, version);

    return (
      <div>
        <select
          onChange={this.handleChange.bind(this)}>
          {upgrades.filter(upgrade => {
            return isPotentialUpgrade(upgrade, character, stateProps);
          })
          .map((upgrade, index) => {
            const isThisDisabled =
              !isValidUpgrade(upgrade, character, stateProps, version);
            return (
              <option
                disabled={isThisDisabled}
                key={index}
                value={upgrade.name}>
                {upgrade.name}
              </option>
            );
          })}
        </select>

        <button
          disabled={isDisabled}
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
  version: PropTypes.number.isRequired,
  leaderName: PropTypes.string
};
