import React, {Component, PropTypes} from 'react';

export default class CharacterSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: this.props.characters[0]
    };
  }

  handleChange(e) {
    this.setState({character: e.target.value});
  }

  handleAdd(e) {
    const {actions, role} = this.props;
    const {character} = this.state;
    if (role === 'leader') {
      actions.addLeader(character);
    } else {
      actions.addFollower(character);
    }
  }

  render() {
    const {role, characters} = this.props;
    return (
      <div>
        <label htmlFor="character-select">{role} Select</label>
        <select
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

        <label htmlFor="character-button">Add to Crew</label>
        <input
          type="submit"
          id="character-button"
          onClick={this.handleAdd.bind(this)}
        />
      </div>
    );
  }
}

CharacterSelect.propTypes = {
  characters: PropTypes.array.isRequired,
  role: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired
};
