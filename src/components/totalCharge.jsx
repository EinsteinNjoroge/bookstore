import React from 'react';
import { number } from 'prop-types';

const TotalCharge = ({ charge }) => (
  <div className="totalCharge">
    <span>Total Charge</span>
    <span>
      {`${charge}$`}
    </span>
  </div>
);

TotalCharge.propTypes = {
  charge: number,
};

TotalCharge.defaultProps = {
  charge: null,
};

export default TotalCharge;
