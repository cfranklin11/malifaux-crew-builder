import React, {Component, PropTypes} from 'react';

export default class CrewFilter extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.value || 0
    };
  }

  render() {
    return (
      <div>
        <label htmlFor="ss-limit-input">Soulstone Limit</label>
        <input type="number" id="ss-limit-input" name="ss-limit"
          value={this.state.value} onChange={this.handleChange.bind(this)}
        onKeyDown={this.handleSubmit.bind(this)}/>
        <label htmlFor="faction-select">Faction</label>
        <select id="faction-select">
          <option value="guild">The Guild</option>
          <option value="resurrectionists">Resurrectionists</option>
          <option value="neverborn">Neverborn</option>
          <option value="arcanists">Arcanists</option>
          <option value="outcasts">Outcasts</option>
          <option value="ten-thunders">Ten Thunders</option>
          <option value="gremlins">Gremlins</option>
        </select>
      </div>
    );
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  handleSubmit(e) {
    const value = Math.ceil(e.target.value);
    if (e.which === 13) {
      this.props.updateSSLimit(value);
    }
  }

}

CrewFilter.propTypes = {
  value: PropTypes.number,
  updateSSLimit: PropTypes.func.isRequired
};
