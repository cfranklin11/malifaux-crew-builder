import React, {Component, PropTypes} from 'react';
import {CharacterOption} from '../components';

export default class CharacterSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: this.props.characters[0]
    };

    this.actions = this.props.actions;
    this.characters = this.props.characters;
    this.role = this.props.role;
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleChange(e) {
    this.setState({character: e.target.value});
  }

  handleAdd(e) {
    if (this.role === 'leader') {
      this.actions.addLeader(this.state.character);
    } else {
      this.actions.addFollower(this.state.character);
    }
  }

  render() {
    return (
      <div>
        <label htmlFor="character-select">{this.role} Select</label>
        <select
          id="character-select"
          onChange={this.handleChange}
        >
          {this.characters.map((character, index) => {
            console.log(character);
            return (
              <option
                key={index}
                value={character.name}
              >{character.name}</option>
            );
          })}
        </select>

        <label htmlFor="character-button">Add to Crew</label>
        <input type="submit" onClick={this.handleAdd} />
      </div>
    );
  }
}

CharacterSelect.propTypes = {
  characters: PropTypes.array.isRequired,
  role: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
};
