import React, {Component, PropTypes} from 'react';

export default class CharacterOption extends Component {
  constructor(props) {
    super(props);
    this.name = this.props.character.name;
  }

  render() {
    console.log(this.name);
    return (
      <option value={this.name}>{this.name}</option>
    );
  }
}

CharacterOption.propTypes = {
  character: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired
};
