/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import WelcomeMessage from './welcomeMesage';

const wrapper = mount(<WelcomeMessage />);

describe('Test TotalCharge', () => {
  it('Should contain div with clasd .welcomeMessage', () => {
    expect(wrapper.find('.welcomeMessage').length).toBe(1);
  });

  it('Should display a h1', () => {
    expect(wrapper.find('h1').length).toBe(1);
  });
});
