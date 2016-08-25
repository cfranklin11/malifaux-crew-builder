import React, {Component, PropTypes} from 'react';

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

    // Get upgrade stats from faction object and save in state
    const currentUpgrade = upgrades.find(upgrade => {
      return upgradeName === upgrade.name;
    });

    this.setState({currentUpgrade});
  }

  handleAdd(e) {
    const {actions, role, selectedFaction} = this.props;
    const {currentUpgrade} = this.state;

    // actions.addUpgrade(currentCharacter, selectedFaction, 'add');
  }

  componentWillReceiveProps(nextProps) {
    const {currentUpgrade} = this.state;
    const {upgrades} = nextProps;
    const nextUpgrade = upgrades[0];

    this.setState({currentUpgrade: nextUpgrade});
  }

  render() {
    const {
      role,
      characters,
      upgrades,
      isLeaderAdded,
      leaderName,
      ssLimit,
      selectedFaction
    } = this.props;
    const {currentUpgrade} = this.state;

    return (
      <div>
        <select
          onChange={this.handleChange.bind(this)}>
          {upgrades.map((upgrade, index) => {
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
  actions: PropTypes.object.isRequired
};
