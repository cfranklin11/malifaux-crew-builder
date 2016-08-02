import React, {Component, PropTypes} from 'react';

export default class SSDisplay extends Component {
  render() {
    const {ssLimit, ssCostSum, ssCache} = this.props;
    const CACHE_LIMIT = 7;

    return (
      <div>
        <div className="col-sm-6">
          <h4>Soulstones Remaining</h4>
          <h4>{ssLimit - ssCostSum}</h4>
        </div>
        <div className="col-sm-6">
          <h4>Soulstone Cache</h4>
          <h4>{Math.min(ssLimit - ssCostSum + ssCache, CACHE_LIMIT)}</h4>
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
