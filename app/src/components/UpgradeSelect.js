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

    // Get upgrade stats from upgrades array and save in state
    const currentUpgrade = upgrades.find(upgrade => {
      return upgradeName === upgrade.name;
    });

    this.setState({currentUpgrade});
  }

  handleAdd(e) {
    const {actions, character, selectedFaction} = this.props;
    const {currentUpgrade} = this.state;

    actions.toggleUpgrade(currentUpgrade, character, selectedFaction, 'add');
  }

  componentWillMount() {
    const {
      upgrades,
      selectedFaction,
      leaderName,
      character: {
        name,
        characteristics,
        station
      }
    } = this.props;
    const factionRegExp = new RegExp(selectedFaction.replace(/\s/g, '-'), 'i');
    let firstUpgrade;

    for (let i = 0; i < upgrades.length; i++) {
      const thisUpgrade = upgrades[i];
      const {
        namerestrictions: nameRestrictions,
        characteristicrestrictions1: restrictions1,
        characteristicrestrictions2: restrictions2,
        faction
      } = thisUpgrade;

      if (factionRegExp.test(faction)) {
        if (nameRestrictions) {
          const nameRegExp =
            new RegExp(nameRestrictions.replace(/,\s/g, '|'), 'i');
          if (nameRegExp.test(name)) {
            firstUpgrade = thisUpgrade;
            break;
          }
        }

        if (restrictions1) {
          let nonRestriction1 =
            /non-(\w+)/i.exec(restrictions1) || ['', ''];
          nonRestriction1 = nonRestriction1[1];
          const restriction1RegExp =
            new RegExp(restrictions1
              .replace(/,\s/g, '|')
              .replace(/non-\w+/gi, `[^(${nonRestriction1})]`), 'i');

          if (/leader/i.test(restrictions1)) {
            if (restrictions2) {
              let nonRestriction2 =
                /non-(\w+)/i.exec(restrictions2) || ['', ''];
              nonRestriction2 = nonRestriction2[1];
              const restriction2RegExp = new RegExp(restrictions2
                  .replace(/,\s/g, '|')
                  .replace(/non-\w+/gi, `[^(${nonRestriction2})]`), 'i');

              if (leaderName === name) {
                if (restriction2RegExp.test(characteristics) ||
                  restriction2RegExp.test(station)) {
                  firstUpgrade = thisUpgrade;
                  break;
                }
              }
            }

            if (leaderName === name) {
              firstUpgrade = thisUpgrade;
              break;
            }
          }

          if (restrictions2) {
            let nonRestriction2 =
              /non-(\w+)/i.exec(restrictions2) || ['', ''];
            nonRestriction2 = nonRestriction2[1];
            const restriction2RegExp =
              new RegExp(restrictions2
                .replace(/,\s/g, '|')
                .replace(/non-\w+/gi, `[^(${nonRestriction2})]`), 'i');

            if (restriction1RegExp.test(characteristics) ||
              restriction1RegExp.test(station) &&
              restriction2RegExp.test(characteristics) ||
              restriction2RegExp.test(station)) {
              firstUpgrade = thisUpgrade;
              break;
            }
          }

          if (restriction1RegExp.test(characteristics) ||
            restriction1RegExp.test(station)) {
            firstUpgrade = thisUpgrade;
            break;
          }
        }

        if (factionRegExp.test(faction)) {
          firstUpgrade = thisUpgrade;
          break;
        }
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
    const {characteristics, station} = character;
    const factionRegExp = new RegExp(selectedFaction.replace(/\s/g, '-'), 'i');

    return (
      <div>
        <select
          onChange={this.handleChange.bind(this)}>
          {upgrades.filter(upgrade => {
            const {
              namerestrictions: nameRestrictions,
              characteristicrestrictions1: restrictions1,
              characteristicrestrictions2: restrictions2,
              faction
            } = upgrade;

            if (factionRegExp.test(faction)) {
              if (nameRestrictions) {
                const nameRegExp =
                  new RegExp(nameRestrictions.replace(/,\s/g, '|'), 'i');
                return nameRegExp.test(character.name);
              }

              if (restrictions1) {
                let nonRestriction1 =
                  /non-(\w+)/i.exec(restrictions1) || ['', ''];
                nonRestriction1 = nonRestriction1[1];
                const restriction1RegExp =
                  new RegExp(restrictions1
                    .replace(/,\s/g, '|')
                    .replace(/non-\w+/gi, `[^(${nonRestriction1})]`), 'i');

                if (/leader/i.test(restrictions1)) {
                  if (restrictions2) {
                    let nonRestriction2 =
                      /non-(\w+)/i.exec(restrictions2) || ['', ''];
                    nonRestriction2 = nonRestriction2[1];
                    const restriction2RegExp = new RegExp(restrictions2
                        .replace(/,\s/g, '|')
                        .replace(/non-\w+/gi, `[^(${nonRestriction2})]`), 'i');

                    if (leaderName === character.name) {
                      return restriction2RegExp.test(characteristics) ||
                        restriction2RegExp.test(station);
                    }
                  }

                  return leaderName === character.name;
                }

                if (restrictions2) {
                  let nonRestriction2 =
                    /non-(\w+)/i.exec(restrictions2) || ['', ''];
                  nonRestriction2 = nonRestriction2[1];
                  const restriction2RegExp =
                    new RegExp(restrictions2
                      .replace(/,\s/g, '|')
                      .replace(/non-\w+/gi, `[^(${nonRestriction2})]`), 'i');

                  return restriction1RegExp.test(characteristics) ||
                    restriction1RegExp.test(station) &&
                    restriction2RegExp.test(characteristics) ||
                    restriction2RegExp.test(station);
                }

                return restriction1RegExp.test(characteristics) ||
                  restriction1RegExp.test(station);
              }

              return factionRegExp.test(faction);
            }

            return factionRegExp.test(faction);
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
