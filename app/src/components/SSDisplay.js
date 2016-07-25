import React, {Component, PropTypes} from 'react';

export default class SSDisplay extends Component {
  render() {
    const {ssLimit, ssCostSum, ssCache} = this.props;

    return (
      <div>
        <div className="col-md-6">
          <h3>Soulstones Remaining</h3>
          <h3>{ssLimit - ssCostSum}</h3>
        </div>
        <div className="col-md-6">
          <h3>Soulstone Cache</h3>
          <h3>{Math.min(ssLimit - ssCostSum + ssCache, 7)}</h3>
        </div>
      </div>
    );
  }
}

SSDisplay.propTypes = {
  ssLimit: PropTypes.number.isRequired,
  ssCostSum: PropTypes.number.isRequired,
  ssCache: PropTypes.number.isRequired
};
