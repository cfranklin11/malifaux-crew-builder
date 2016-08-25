import React, {Component, PropTypes} from 'react';

export default class SSDisplay extends Component {
  render() {
    const {ssLimit, ssCostSum, ssCache} = this.props;
    const CACHE_LIMIT = 7;

    return (
      <div className="text-center row app-section">
        <div className="col-xs-4 ss-box" id="left-box">
          <h4><strong>Crew Size (Soulstones)</strong></h4>
          <h4>{ssLimit}</h4>
        </div>
        <div className="col-xs-4 ss-box">
          <h4><strong>Soulstones Remaining</strong></h4>
          <h4>{ssLimit - ssCostSum}</h4>
        </div>
        <div className="col-xs-4 ss-box" id="right-box">
          <h4><strong>Soulstone Cache</strong></h4>
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
