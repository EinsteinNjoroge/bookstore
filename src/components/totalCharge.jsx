import React from 'react';

const TotalCharge = ({ charge }) => (
  <div className="totalCharge">
    <span>Total Charge</span>
    <span>
      {`${charge}$`}
    </span>
  </div>
);

export default TotalCharge;
