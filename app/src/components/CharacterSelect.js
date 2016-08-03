import React, {Component, PropTypes} from 'react';

export default class CharacterSelect extends Component {
  constructor(props) {
    super(props);

    const {crew, role} = this.props;
    const isLeaderAdded =
      role === 'leaders' && crew.name ||
      role === 'followers';
    this.state = {
      character: undefined,
      isLeaderAdded
    };
  }

  handleChange(e) {
    const characterName = e.target.value;
    const [character] = this.props.characters.filter(char => {
      return characterName === char.name;
    });
    this.setState({character});
  }

  handleAdd(e) {
    const {actions, role} = this.props;
    const {character} = this.state;
    if (role === 'leaders') {
      this.setState({isLeaderAdded: true});
      actions.addLeader(character);
    } else {
      actions.addFollower(character);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.character) {
      const {characters: [character]} = nextProps;
      this.setState({character});
    }
  }

  render() {
    const {role, characters} = this.props;
    const {isLeaderAdded} = this.state;
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
  crew: PropTypes.object,
  actions: PropTypes.object.isRequired
};
