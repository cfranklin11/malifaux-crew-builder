import React, {Component, PropTypes} from 'react';

export default class SSLimitInput extends Component {
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
          value={this.state.value} />
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

SSLimitInput.propTypes = {
  value: PropTypes.number,
  updateSSLimit: PropTypes.func.isRequired
};
