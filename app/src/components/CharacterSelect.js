import React, {Component, PropTypes} from 'react';

export default class CharacterSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: undefined
    };
  }

  handleChange(e) {
    const characterName = e.target.value;
    const character = this.props.characters.find(char => {
      return characterName === char.name;
    });
    this.setState({character});
  }

  handleAdd(e) {
    const {actions, role, crew} = this.props;
    const {character} = this.state;
    const crewCharacter = crew.find(char => {
      return char.name === character.name;
    }) || {count: 0};
    const {count} = crewCharacter;
    const characterToAdd = {...character, count};

    if (role === 'leaders') {
      actions.addLeader(characterToAdd);
    } else {
      actions.addFollower(characterToAdd);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.character) {
      const {characters: [character]} = nextProps;
      this.setState({character});
    }
  }

  render() {
    const {role, characters, isLeaderAdded} = this.props;

    console.log(this.props);

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
              return (
                <option
                  key={index}
                  value={character.name}
                >
                {character.name}
                </option>
              );
            })}
          </select>
        </div>

        <input
          className="btn btn-default"
          type="submit"
          value="Add to Crew"
          onClick={this.handleAdd.bind(this)}
          disabled={isLeaderAdded}
        />
      </div>
    );
  }
}

CharacterSelect.propTypes = {
  characters: PropTypes.array.isRequired,
  role: PropTypes.string.isRequired,
  crew: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  character: PropTypes.object,
  isLeaderAdded: PropTypes.bool.isRequired
};
