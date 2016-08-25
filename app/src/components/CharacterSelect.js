import React, {Component, PropTypes} from 'react';

export default class CharacterSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCharacter: {
        name: '',
        faction: '',
        limit: 0,
        count: 0
      }
    };
  }

  handleChange(e) {
    const {characters} = this.props;
    const characterName = e.target.value;

    // Get character stats from faction object and save in state
    const currentCharacter = characters.find(char => {
      return characterName === char.name;
    });

    this.setState({currentCharacter});
  }

  handleAdd(e) {
    const {actions, role, selectedFaction} = this.props;
    const {currentCharacter} = this.state;

    if (role === 'leaders') {
      actions.toggleLeader(currentCharacter, selectedFaction, 'add');
    } else {
      actions.toggleFollower(currentCharacter, selectedFaction, 'add');
    }
  }

  componentWillReceiveProps(nextProps) {
    const {currentCharacter} = this.state;
    const {role, ssLimit, characters} = nextProps;
    // RegExp to separate characters into leaders & followers;
    // valid leaders depend on crew size
    const charRegExp = role === 'leaders' ? /master|henchman/i :
      /[^(?:master)]/i;
    const leadRegExp = ssLimit <= 25 ? /henchman/i :
      ssLimit > 40 ? /master/i :
      /master|henchman/i;
    const nextCharacter = characters.find(
      characterTest(currentCharacter.name, role)
      // Use empty name to reset list on faction change
    ) || {name: '', faction: '', limit: 0, count: 0};

    this.setState({currentCharacter: nextCharacter});

    function characterTest(currentName, role) {
      // If waiting on data, use character info from nextProps
      if (currentName === '') {
        if (role === 'leaders') {
          return char => leadRegExp.test(char.station);
        }
        return char => charRegExp.test(char.station);
      }
      // Otherwise, refresh state character from incoming props
      // to update count
      return char => currentName === char.name;
    }
  }

  render() {
    const {
      role,
      characters,
      isLeaderAdded,
      leaderName,
      ssLimit,
      selectedFaction
    } = this.props;
    const {currentCharacter} = this.state;
    const roleLabel = role === 'leaders' ? 'leader' : role;
    // RegExp to separate characters into leaders & followers;
    // valid leaders depend on crew size
    const charRegExp = role === 'leaders' ? /master|henchman/i :
      /[^(?:master)]/i;
    const leadRegExp = ssLimit <= 25 ? /henchman/i :
      ssLimit > 40 ? /master/i :
      /master|henchman/i;
    const factionRegExp = new RegExp(selectedFaction, 'i');
    const specificTotemRegExp = /totem\s\(((?:\w*\s?)+)\)/i;
    let totemMaster =
      specificTotemRegExp.exec(currentCharacter.characteristics) ?
      specificTotemRegExp.exec(currentCharacter.characteristics)[1] : '';
    let totemMasterRegExp = new RegExp(totemMaster, 'i');
    // Disable options if they've reached their rare limit,
    // or invalid leader station, or totem without associated master
    let isNotValid = parseFloat(currentCharacter.limit) !== 0 &&
      currentCharacter.count >= parseFloat(currentCharacter.limit) ||
      role === 'leaders' &&
      !leadRegExp.test(currentCharacter.station) ||
      totemMaster && !totemMasterRegExp.test(leaderName);
    const isDisabled = isLeaderAdded &&
      role === 'leaders' ||
      isNotValid;

    return (
      <div className="form-group
        col-xs-6 col-xs-offset-3
        col-md-4 col-md-offset-4"
      >
        <label htmlFor="character-select">{`Select ${roleLabel}`}</label>
        <select
          className="form-control"
          id="character-select"
          onChange={this.handleChange.bind(this)}
        >
          {characters.filter(character => {
            // Leaders must be same faction and Master or Henchman
            if (role === 'leaders') {
              return factionRegExp.test(
                character.faction.replace(/\s/g, '-')
                ) && charRegExp.test(character.station);
            }
            return charRegExp.test(character.station);
          })
          .map((character, index) => {
            totemMaster =
              specificTotemRegExp.exec(character.characteristics) ?
              specificTotemRegExp.exec(character.characteristics)[1] : '';
            totemMasterRegExp = new RegExp(totemMaster, 'i');
            isNotValid = parseFloat(character.limit) !== 0 &&
              character.count >= parseFloat(character.limit) ||
              role === 'leaders' &&
              !leadRegExp.test(character.station) ||
              totemMaster && !totemMasterRegExp.test(leaderName);

            return (
              <option
                key={index}
                value={character.name}
                disabled={isNotValid}
              >
              {character.name}
              </option>
            );
          })}
        </select>

        <input
          className="btn btn-default"
          type="submit"
          value="Add to Crew"
          onClick={this.handleAdd.bind(this)}
          disabled={isDisabled}
        />
      </div>
    );
  }
}

CharacterSelect.propTypes = {
  characters: PropTypes.array.isRequired,
  role: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  character: PropTypes.object,
  isLeaderAdded: PropTypes.bool.isRequired,
  leaderName: PropTypes.string.isRequired,
  ssLimit: PropTypes.number.isRequired,
  selectedFaction: PropTypes.string.isRequired
};
