import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import fetch from 'node-fetch';
import components from '../components';

const {
  WelcomeMessage,
  Form,
  Shelf,
  TotalCharge,
} = components;

const DEFAULT_RENT_DURATION = 1;
const DEFAULT_BOOK_COUNT = 1;
const MAX_RENTED_BOOK = 10;

const getSuggestions = (books, value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0 ? []
    : books.filter(book => book.title.toLowerCase().startsWith(inputValue));
};

export const getSuggestionValue = suggestion => suggestion.title;

export const renderSuggestion = suggestion => suggestion.title;


// eslint-disable-next-line react/prefer-stateless-function
class MainContainer extends React.Component {
  state = {
    currentBook: '',
    myShelf: {},
    rentRate: 1,
    books: [],
    suggestions: [],
  };

  componentDidMount() {
    fetch('../api/library.json')
      .then(res => res.json())
      .then(({ books }) => this.setState({ books }))
      .catch(err => console.log(err));
  }

  onSuggestionsFetchRequested = ({ value }) => {
    const { books } = this.state;
    this.setState({ suggestions: getSuggestions(books, value) });
  };

  onSuggestionsClearRequested = () => this.setState({ suggestions: [] });

  setBookState = (event, { newValue }) => this.setState({ currentBook: newValue });

  calculateCharge = () => {
    const { myShelf, rentRate } = this.state;
    let totalCharge = 0;
    Object.keys(myShelf).forEach((title) => {
      const { rentDuration, numOfBooks } = myShelf[title];
      totalCharge += rentDuration * rentRate * numOfBooks;
    });

    return totalCharge;
  };

  showMessage = (msg, state) => {
    switch (state) {
      case 'error':
        toast.error(msg);
        break;
      case 'warn':
        toast.warn(msg);
        break;
      default:
    }
  };

  addNumOfBooks = ({ target: { name: book, value } }) => {
    if (value < 1) {
      this.showMessage('Number Books rented can only cannot be less than 1', 'error');
      return;
    }
    const { myShelf } = this.state;
    const newShelf = Object.assign({}, myShelf);
    newShelf[book].numOfBooks = parseInt(value, 10);
    this.setState({ myShelf: newShelf });
  };

  addRentDays = ({ target: { name: book, value } }) => {
    if (value < 1) {
      this.showMessage('Books can only be rented for at-least one day', 'error');
      return;
    }

    const { myShelf } = this.state;
    const newShelf = Object.assign({}, myShelf);
    newShelf[book].rentDuration = parseInt(value, 10);
    this.setState({ myShelf: newShelf });
  };

  addToShelf = (e) => {
    e.preventDefault();

    const { currentBook, myShelf, books } = this.state;
    if (!currentBook) {
      this.showMessage('Please enter a valid title', 'error');
      return;
    }

    if (!books.find(book => book.title === currentBook)) {
      this.showMessage('Sorry we dont have that book in our library', 'error');
      return;
    }

    const newShelf = Object.assign({}, myShelf);

    if (newShelf[currentBook]) {
      newShelf[currentBook].numOfBooks += 1;
    } else {
      newShelf[currentBook] = {
        rentDuration: DEFAULT_RENT_DURATION,
        numOfBooks: DEFAULT_BOOK_COUNT,
      };
    }

    this.setState({ myShelf: newShelf, currentBook: '' });
  };

  removeFromShelf = ({ target: { name: book } }) => {
    const { myShelf } = this.state;
    const newShelf = Object.assign({}, myShelf);
    delete newShelf[book];
    this.setState({ myShelf: newShelf });
  };

  render() {
    const {
      addToShelf,
      setBookState,
      showMessage,
      state,
      calculateCharge,
      addNumOfBooks,
      addRentDays,
      removeFromShelf,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
    } = this;

    const { currentBook, myShelf, suggestions } = state;

    const iHaveBooksInMyShelf = Object.keys(myShelf).length > 0;
    const disableInputs = Object.keys(myShelf).length >= MAX_RENTED_BOOK;
    if (disableInputs) {
      showMessage("You've reached the maximum number of books borrowable", 'warn');
    }
    const totalCharge = calculateCharge();

    const inputProps = {
      placeholder: 'What would you like to read?',
      value: currentBook,
      onChange: setBookState,
      type: 'search',
    };

    const autoSuggestProps = {
      suggestions,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
      inputProps,
    };

    return (
      <div className="container">
        <WelcomeMessage />
        <div>
          <ToastContainer position={toast.POSITION.TOP_LEFT} />
          <Form
            autoSuggestProps={autoSuggestProps}
            disabled={disableInputs}
            onSubmit={addToShelf}
          />
          {
            iHaveBooksInMyShelf && (
            <Shelf
              removeFromShelf={removeFromShelf}
              addNumOfBooks={addNumOfBooks}
              addRentDays={addRentDays}
              books={myShelf}
            />
            )
          }
          { totalCharge > 0 && <TotalCharge charge={totalCharge} /> }
        </div>
      </div>
    );
  }
}
export default MainContainer;
