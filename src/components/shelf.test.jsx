/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import Shelf from './shelf';

const removeFromShelf = jest.fn();
const addNumOfBooks = jest.fn();
const addRentDays = jest.fn();
const props = {
  books: {
    firstBook: { rentDuration: 1, numOfBooks: 2 },
  },
  addNumOfBooks,
  removeFromShelf,
  addRentDays,
};

const wrapperWithoutBooks = () => {
  const propsWithoutBooks = { ...props };
  propsWithoutBooks.books = [];
  return mount(<Shelf {...propsWithoutBooks} />);
};

const wrapper = mount(<Shelf {...props} />);

describe('Test Shelf', () => {
  it('Shelf should have a header row with 4 spans', () => {
    expect(wrapper.find('.shelf-header').length).toBe(1);
    expect(wrapper.find('.shelf-header').children().length).toBe(4);
  });

  it('Shelf should not have shelf-row when books are not available', () => {
    expect(wrapperWithoutBooks().find('.shelf-row').length).toBe(0);
  });

  it('Shelf should shelf-row when books are available', () => {
    expect(wrapper.find('.shelf-row').length).toBe(1);
  });

  it('Remove button should invoke removeFromShelf', () => {
    wrapper.find('button').simulate('click');
    expect(removeFromShelf).toHaveBeenCalled();
  });

  it('Changing the inputs invokes addRentDays / addNumOfBooks respectively', () => {
    wrapper.find('input').at(0).simulate('change');
    expect(addNumOfBooks).toHaveBeenCalled();

    wrapper.find('input').at(1).simulate('change');
    expect(addRentDays).toHaveBeenCalled();
  });
});
