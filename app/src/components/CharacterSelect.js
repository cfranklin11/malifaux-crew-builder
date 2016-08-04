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
    const {actions, role} = this.props;
    const {currentCharacter} = this.state;

    if (role === 'leaders') {
      actions.toggleLeader(currentCharacter, 'add');
    } else {
      actions.toggleFollower(currentCharacter, 'add');
    }
  }

  componentWillReceiveProps(nextProps) {
    const {currentCharacter} = this.state;
    const {role} = nextProps;
    const charRegExp = role === 'leaders' ?
      /master|henchman/i : /[^(?:master)]/i;
    let nextCharacter;

    // If waiting on data, use character info from nextProps
    if (currentCharacter.name === '') {
      nextCharacter = nextProps.characters
        .find(char => charRegExp.test(char.station));
    // Otherwise, refresh state character from incoming props
    // to update count
    } else {
      const {characters} = nextProps;
      nextCharacter = characters.find(char => {
        return currentCharacter.name === char.name;
      });
    }
    this.setState({currentCharacter: nextCharacter});
  }

  render() {
    const {role, characters, isLeaderAdded} = this.props;
    const {currentCharacter} = this.state;
    const charRegExp = role === 'leaders' ?
      /master|henchman/i : /[^(?:master)]/i;
    // Disable options if they've reached their rare limit
    let isLimit = parseFloat(currentCharacter.limit) !== 0 &&
      currentCharacter.count >= parseFloat(currentCharacter.limit);
    const isDisabled = isLeaderAdded && role === 'leaders' || isLimit;

    console.log(currentCharacter);

    return (
      <div>
        <div className="form-group">
          <label htmlFor="character-select">{role} Select</label>
          <select
            className="form-control"
            id="character-select"
            onChange={this.handleChange.bind(this)}
          >
            {characters.map((character, index) => {
              isLimit = parseFloat(character.limit) !== 0 &&
                character.count >= parseFloat(character.limit);

              if (charRegExp.test(character.station)) {
                return (
                  <option
                    key={index}
                    value={character.name}
                    disabled={isLimit}
                  >
                  {character.name}
                  </option>
                );
              }
            })}
          </select>
        </div>

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
  isLeaderAdded: PropTypes.bool.isRequired
};
