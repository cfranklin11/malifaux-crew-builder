import React, {Component, PropTypes} from 'react';

export default class ssLimitInput extends Component {
  static propTypes = {
    editSSLimit: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.value || 0
    };
  }

  render() {
    return (
      <label for="ss-limit-input">Soulstone Limit</label>
      <input type="number" id="ss-limit-input" name="ss-limit" value={this.state.value}>
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
