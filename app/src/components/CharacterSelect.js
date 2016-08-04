import React, {Component, PropTypes} from 'react';

export default class CharacterSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: undefined
    };
  }

  handleChange(e) {
    const {characterList} = this.props;
    const characterName = e.target.value;
    const character = characterList.find(char => {
      return characterName === char.name;
    });
    this.setState({character});
  }

  handleAdd(e) {
    const {actions, role} = this.props;
    const {character} = this.state;

    if (role === 'leaders') {
      actions.addLeader(character);
    } else {
      actions.addFollower(character);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.character) {
      const {characterList: [character]} = nextProps;
      this.setState({character});
    }
  }

  render() {
    const {role, characterList, isLeaderAdded} = this.props;
    const isDisabled = !isLeaderAdded || role === 'leaders';

    return (
      <div>
        <div className="form-group">
          <label htmlFor="character-select">{role} Select</label>
          <select
            className="form-control"
            id="character-select"
            onChange={this.handleChange.bind(this)}
          >
            {characterList.map((character, index) => {
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
          disabled={isDisabled}
        />
      </div>
    );
  }
}

CharacterSelect.propTypes = {
  characterList: PropTypes.array.isRequired,
  role: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  character: PropTypes.object,
  isLeaderAdded: PropTypes.bool.isRequired
};
