import React, {Component, PropTypes} from 'react';
import {LEADER_REGEXP} from '../constants/RegExps';
import {
  isValidCharacter,
  isPotentialCharacter,
  isLessThanLimit
} from '../utils/RulesValidations';

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

    if (LEADER_REGEXP.test(role)) {
      actions.toggleLeader(currentCharacter, selectedFaction, 'add');
    } else {
      actions.toggleFollower(currentCharacter, selectedFaction, 'add');
    }
  }

  componentWillReceiveProps(nextProps) {
    const {role, ssLimit, selectedFaction, leaderName, characters} = nextProps;
    const {currentCharacter} = this.state;
    const stateProps = {role, ssLimit, selectedFaction, leaderName};
    const nextCharacter =
      // If state already has a character, refresh currentCharacter data
      // with any changes
      characters.find(character => {
        return currentCharacter.name === character.name;
      }) ||
      // Otherwise, set state to first valid character
      characters.find(character => {
        return isValidCharacter(character, stateProps) &&
          isLessThanLimit(character.limit, character.count);
      }) ||
      // If no valid characters, return default
      {name: '', faction: '', limit: 0, count: 0};

    this.setState({currentCharacter: nextCharacter});
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
    const {limit, count} = currentCharacter;
    const roleLabel = LEADER_REGEXP.test(role) ? 'leader' : role;
    const stateProps = {role, ssLimit, selectedFaction, leaderName};
    // Disable leaders if one has been added; disable all invalid characters;
    // disable if the max # of this character has been added to the crew
    const isDisabled = isLeaderAdded && LEADER_REGEXP.test(role) ||
      !isValidCharacter(currentCharacter, stateProps) ||
      !isLessThanLimit(limit, count);

    return (
      <div className="form-group
        col-xs-6 col-xs-offset-3
        col-md-4 col-md-offset-4">
        <label htmlFor="character-select">{`Select ${roleLabel}`}</label>
        <select
          className="form-control"
          id="character-select"
          onChange={this.handleChange.bind(this)}>

          {characters.filter(character => {
            // Filter for potentially valid characters
            return isPotentialCharacter(character, stateProps);
          })
          .map((character, index) => {
            // Disable all currently invalid characters
            const isThisDisabled = isLeaderAdded && LEADER_REGEXP.test(role) ||
              !isValidCharacter(character, stateProps) ||
              !isLessThanLimit(character.limit, character.count);
            return (
              <option
                key={index}
                value={character.name}
                disabled={isThisDisabled}>
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
          disabled={isDisabled}/>
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
