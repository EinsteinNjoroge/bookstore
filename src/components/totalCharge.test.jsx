/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import TotalCharge from './totalCharge';

const charge = '10';
const wrapper = shallow(<TotalCharge charge={charge} />);

describe('Test TotalCharge', () => {
  it("Should display the words 'Total Charge'", () => {
    expect(wrapper.html()).toContain('Total Charge');
  });

  it('Should display a charge value', () => {
    expect(wrapper.html()).toContain(charge);
  });
});
