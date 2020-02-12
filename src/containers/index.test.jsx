/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import MainContainer, { getSuggestionValue, renderSuggestion } from './index';
import { library } from '../api/library.json';

const bookFixture = {
  oneBook: {
    rentDuration: 1,
    numOfBooks: 2,
    rentRate: 1.5,
    genre: 'fiction',
  },
};

let wrapper;

describe('Test MainContainer', () => {
  beforeEach(() => {
    wrapper = shallow(<MainContainer />);
  });

  afterEach(() => {
    wrapper = null;
  });

  it('Should render a container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('Should render WelcomeMessage and Form components', () => {
    expect(wrapper.find('WelcomeMessage').length).toBe(1);
    expect(wrapper.find('Form').length).toBe(1);
  });

  it('Default should not render  Shelf and TotalCharge components', () => {
    expect(wrapper.find('TotalCharge').length).toBe(0);
    expect(wrapper.find('Shelf').length).toBe(0);
  });

  it('Should conditionally render Shelf and TotalCharge component', () => {
    wrapper.setState({ myShelf: bookFixture });
    expect(wrapper.find('Shelf').length).toBe(1);
    expect(wrapper.find('TotalCharge').length).toBe(1);
  });

  it('Should removeFromShelf', () => {
    wrapper.setState({ myShelf: bookFixture });
    expect(wrapper.state().myShelf).toEqual(bookFixture);

    wrapper.instance().removeFromShelf({ target: { name: 'oneBook' } });
    expect(wrapper.state().myShelf).toEqual({});
  });

  it('Should show message when number of books in myMhelf equal 10', () => {
    const newShelf = {
      1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}, 9: {}, 10: {},
    };

    const showMessage = jest.spyOn(wrapper.instance(), 'showMessage');
    wrapper.setState({ myShelf: newShelf });
    expect(showMessage).toBeCalled();
  });

  it('Should addToShelf', () => {
    const showMessage = jest.spyOn(wrapper.instance(), 'showMessage');

    // should show message when currentBook is not set
    wrapper.setState({ currentBook: '' });
    wrapper.instance().addToShelf({ preventDefault: () => {} });
    expect(showMessage).toBeCalled();

    // should show message when currentBook is not in library
    wrapper.setState({ currentBook: 'not-in-library' });
    wrapper.instance().addToShelf({ preventDefault: () => {} });
    expect(showMessage).toBeCalled();

    const currentBook = 'Fairy tales';

    // should add a book to myShelf correctly
    wrapper.setState({ currentBook });
    wrapper.instance().addToShelf({ preventDefault: () => {} });
    expect(typeof wrapper.state().myShelf[currentBook]).toEqual('object');

    // should increment count when existing book is added to myShelf
    wrapper.setState({ currentBook });
    wrapper.instance().addToShelf({ preventDefault: () => {} });
    expect(wrapper.state().myShelf[currentBook].numOfBooks).toEqual(2);
  });

  it('Should addRentDays', () => {
    // should increase addRentDays correctly
    const currentBook = 'Fairy tales';
    wrapper.setState({ currentBook });
    wrapper.instance().addToShelf({ preventDefault: () => {} });
    wrapper.instance().addRentDays({ target: { name: currentBook, value: 5 } });
    const { rentDuration } = wrapper.state().myShelf[currentBook];
    expect(rentDuration).toEqual(5);

    // should show message when rentDays are less than 1
    const showMessage = jest.spyOn(wrapper.instance(), 'showMessage');
    wrapper.instance().addRentDays({ target: { name: currentBook, value: 0 } });
    expect(showMessage).toBeCalled();
  });

  it('Should addNumOfBooks', () => {
    const currentBook = 'Fairy tales';
    wrapper.setState({ currentBook });
    wrapper.instance().addToShelf({ preventDefault: () => {} });
    wrapper.instance().addNumOfBooks({ target: { name: currentBook, value: 3 } });
    const { numOfBooks } = wrapper.state().myShelf[currentBook];
    expect(numOfBooks).toEqual(3);


    // should show message when numOfBooks is less than 1
    const showMessage = jest.spyOn(wrapper.instance(), 'showMessage');
    wrapper.instance().addNumOfBooks({ target: { name: currentBook, value: 0 } });
    expect(showMessage).toBeCalled();
  });

  it('Should getTotalCharge fictional', () => {
    const currentBook = library.fiction.books[0].title;
    const { rentRate } = library.fiction;
    wrapper.setState({ currentBook });

    wrapper.instance().addToShelf({ preventDefault: () => {} });
    expect(wrapper.instance().getTotalCharge()).toEqual(rentRate);

    wrapper.instance().addRentDays({ target: { name: currentBook, value: 3 } });
    expect(wrapper.instance().getTotalCharge()).toEqual(3 * rentRate);
  });

  it('Should getTotalCharge novels', () => {
    const currentBook = library.novel.books[0].title;
    const { rentRate, minCharge } = library.novel;

    wrapper.setState({ currentBook });
    wrapper.instance().addToShelf({ preventDefault: () => {} });
    expect(wrapper.instance().getTotalCharge()).toEqual(minCharge);

    wrapper.instance().addRentDays({ target: { name: currentBook, value: 3 } });
    expect(wrapper.instance().getTotalCharge()).toEqual(minCharge);

    wrapper.instance().addRentDays({ target: { name: currentBook, value: 4 } });
    expect(wrapper.instance().getTotalCharge()).toEqual(minCharge + rentRate);
  });

  it('Should calculateCharge', () => {
    const currentBook = library.fiction.books[0].title;
    const { rentRate } = library.fiction;
    wrapper.setState({ currentBook });

    wrapper.instance().addToShelf({ preventDefault: () => {} });
    wrapper.instance().calculateCharge(currentBook);
    expect(wrapper.state().myShelf[currentBook].charge).toEqual(rentRate);
  });

  it('Should setBookState', () => {
    const newBook = 'new book';
    wrapper.instance().setBookState(null, { newValue: newBook });
    expect(wrapper.state().currentBook).toEqual('new book');
  });

  it('test onSuggestionsClearRequested', () => {
    wrapper.setState({ suggestions: [1, 2, 3, 4] });
    wrapper.instance().onSuggestionsClearRequested();
    expect(wrapper.state().suggestions).toEqual([]);
  });

  it('test onSuggestionsFetchRequested', () => {
    wrapper.setState({ suggestions: [] });

    // Should return empty array when no suggestion matches value
    wrapper.instance().onSuggestionsFetchRequested({ value: 'Q' });
    expect(wrapper.state().suggestions).toEqual([]);

    // Should return array with books when some suggestion match the value
    wrapper.instance().onSuggestionsFetchRequested({ value: 'R' });
    expect(wrapper.state().suggestions.length).toEqual(1);
  });

  it('test getSuggestionValue', () => {
    const suggestion = { title: 'title', name: 'name' };
    expect(getSuggestionValue(suggestion)).toEqual('title');
  });

  it('test renderSuggestion', () => {
    const suggestion = library.fiction.books[0];
    expect(renderSuggestion(suggestion)).toEqual(`${suggestion.title} - fiction`);
  });
});
